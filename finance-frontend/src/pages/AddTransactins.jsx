import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Container,
  TextField,
  MenuItem,
  Button,
  Typography,
  Paper,
  Tabs,
  Tab,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "../components/Dashboard/Layout";

const incomeCategories = ["Salary", "Bonus", "Interest", "Investment"];
const expenseCategories = ["Food", "Transport", "Rent", "Utilities", "Health"];
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getLocalDateTimeString = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const localDate = new Date(now.getTime() - offset * 60000);
  return localDate.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:mm"
};

const convertLocalToUTCWithoutOffset = (localDateTimeStr) => {
  const localDate = new Date(localDateTimeStr);
  const offsetInMs = localDate.getTimezoneOffset() * 60 * 1000; // convert minutes to ms
  const correctedDate = new Date(localDate.getTime() - offsetInMs);
  return correctedDate.toISOString(); // This will give you the same wall time as input, marked as UTC
};

const AddTransactionPage = () => {
  const { toast } = useToast();

  const [transactionType, setTransactionType] = useState("income");
  const [formData, setFormData] = useState({
    party: "",
    category: "",
    paymentMethod: "",
    amount: "",
    description: "",
    createdAt: getLocalDateTimeString(),
  });

  const [darkMode, setDarkMode] = useState(() => {
    const storedMode = localStorage.getItem("darkMode");
    return storedMode ? JSON.parse(storedMode) : false;
  });

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: { mode: darkMode ? "dark" : "light" },
      }),
    [darkMode]
  );

  const paymentMethods = [
    { label: "Cash", value: "cash" },
    { label: "Card", value: "card" },
    { label: "Bank Transfer", value: "bank_transfer" },
    { label: "UPI", value: "upi" },
    { label: "Other", value: "other" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTabChange = (event, newValue) => {
    setTransactionType(newValue);
    setFormData((prev) => ({ ...prev, category: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const utcDate = new Date(formData.createdAt).toISOString();
    const payload = {
      ...formData,
      type: transactionType,
      amount: parseFloat(formData.amount),
      createdAt: utcDate, // Always UTC in backend
    };

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to create transaction");

      toast({
        title: "Transaction added",
        description: `Your ${transactionType} was recorded successfully.`,
      });

      // Reset form
      setFormData({
        party: "",
        category: "",
        paymentMethod: "",
        amount: "",
        description: "",
        createdAt: getLocalDateTimeString(),
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err.message || "Something went wrong.",
        variant: "destructive",
      });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <DashboardLayout
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        selectedItem="Add Transactions"
      >
        <Container maxWidth="sm">
          <Paper elevation={3} sx={{ p: 4, mt: 6, borderRadius: 3 }}>
            <Typography
              variant="h5"
              fontWeight="bold"
              mb={2}
              textAlign="center"
            >
              Add New Transaction
            </Typography>

            <Tabs
              value={transactionType}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{ mb: 3 }}
            >
              <Tab label="Income" value="income" />
              <Tab label="Expenditure" value="expenditure" />
            </Tabs>

            <form onSubmit={handleSubmit}>
              <Box display="flex" flexDirection="column" gap={2}>
                <TextField
                  fullWidth
                  label="Party"
                  name="party"
                  value={formData.party}
                  onChange={handleInputChange}
                  required
                />

                <TextField
                  select
                  fullWidth
                  label="Category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  {(transactionType === "income"
                    ? incomeCategories
                    : expenseCategories
                  ).map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  fullWidth
                  label="Payment Method"
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  required
                >
                  {paymentMethods.map((method) => (
                    <MenuItem key={method.value} value={method.value}>
                      {method.label}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  fullWidth
                  label="Amount"
                  name="amount"
                  type="number"
                  inputProps={{ min: 0 }}
                  value={formData.amount}
                  onChange={handleInputChange}
                  required
                />

                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  multiline
                  rows={2}
                  value={formData.description}
                  onChange={handleInputChange}
                />

                <TextField
                  fullWidth
                  label="Date & Time"
                  name="createdAt"
                  type="datetime-local"
                  value={formData.createdAt}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  required
                />

                <Button variant="contained" type="submit" size="large">
                  Add Transaction
                </Button>
              </Box>
            </form>
          </Paper>
        </Container>
      </DashboardLayout>
    </ThemeProvider>
  );
};

export default AddTransactionPage;
