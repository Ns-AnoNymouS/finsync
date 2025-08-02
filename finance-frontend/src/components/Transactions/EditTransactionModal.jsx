import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const EditTransactionModal = ({ open, onClose, transaction, onUpdate }) => {
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    party: "",
    description: "",
    category: "",
    type: "income",
    amount: "",
    createdAt: "",
  });

  useEffect(() => {
    if (transaction) {
      setFormData({
        party: transaction.party || "",
        description: transaction.description || "",
        category: transaction.category || "",
        type: transaction.type || "income",
        amount: transaction.amount || "",
        createdAt: transaction.createdAt ? transaction.createdAt.slice(0, 10) : "",
      });
    }
  }, [transaction]);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${API_BASE_URL}/transactions/${transaction.id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast({
        title: "Updated",
        description: "Transaction updated successfully.",
      });
      onUpdate();
      onClose();
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err?.response?.data?.message || "Update failed.",
      });
    }
  };
  const createdAt = formData.createdAt;
  const formattedDate = createdAt
    ? new Date(createdAt).toISOString().split("T")[0]
    : "";
  console.log(formattedDate);
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          fontSize: "1.1rem", // Smaller text
          paddingTop: 2,
          paddingBottom: 0.5,
          paddingX: 2, // Optional: control horizontal padding
          lineHeight: 1.2, // Compact line height
        }}
      >
        Edit Transaction
      </DialogTitle>
      <DialogContent
        dividers
        sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
      >
        <TextField
          label="Party"
          name="party"
          value={formData.party}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Amount"
          name="amount"
          type="number"
          value={formData.amount}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Date"
          name="date"
          type="date"
          value={formattedDate}
          onChange={handleChange}
          fullWidth
        />
        <FormControl fullWidth>
          <InputLabel>Category</InputLabel>
          <Select
            name="category"
            value={formData.category}
            onChange={handleChange}
            label="Category"
          >
            <MenuItem value="Salary">Salary</MenuItem>
            <MenuItem value="Food">Food</MenuItem>
            <MenuItem value="Rent">Rent</MenuItem>
            <MenuItem value="Bonus">Bonus</MenuItem>
            <MenuItem value="Shopping">Shopping</MenuItem>
            <MenuItem value="Health">Health</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Type</InputLabel>
          <Select
            name="type"
            value={formData.type}
            onChange={handleChange}
            label="Type"
          >
            <MenuItem value="income">Income</MenuItem>
            <MenuItem value="expenditure">Expenditure</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditTransactionModal;
