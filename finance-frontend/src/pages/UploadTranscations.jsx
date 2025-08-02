import React, { useState, useMemo, useEffect } from "react";
import {
  ThemeProvider,
  createTheme,
  Box,
  Typography,
  Button,
  Paper,
  Divider,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import DeleteIcon from "@mui/icons-material/Delete";
import DashboardLayout from "../components/Dashboard/Layout";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const incomeCategories = [
  "Salary",
  "Investment",
  "Gift",
  "Bonus",
  "Interest",
  "Other Income",
];
const expenseCategories = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Entertainment",
  "Health",
  "Other",
];
const paymentMethods = ["cash", "card", "bank_transfer", "upi", "other"];
const types = ["income", "expenditure"];

const ReceiptUploadPage = () => {
  const { toast } = useToast();
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
        palette: {
          mode: darkMode ? "dark" : "light",
          ...(darkMode && {
            background: {
              default: "#121212",
              paper: "#1e1e1e",
            },
          }),
        },
        typography: {
          fontFamily: "Inter, sans-serif",
        },
      }),
    [darkMode]
  );

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    const isPdf = file.type === "application/pdf";

    if (!isImage && !isPdf) {
      alert("Please upload an image or PDF file.");
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(isImage ? URL.createObjectURL(file) : "");
    setUploadProgress(0);
  };

  const handleProcess = async () => {
    if (!selectedFile) {
      alert("Please upload a receipt first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}/transactions/extract`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percent);
            if (percent === 100) {
              setIsProcessing(true);
            }
          },
        }
      );

      let data = response.data.transactions;
      if (!data) {
        data = [response.data.transaction];
      }
      if (!Array.isArray(data)) throw new Error("Invalid format returned.");

      setTransactions(data);
      setModalOpen(true);
      setIsProcessing(false);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
      setIsProcessing(false);
    }
  };

  const handleFieldChange = (index, field, value) => {
    const updated = [...transactions];
    updated[index][field] = value;
    setTransactions(updated);
  };

  const handleDeleteRow = (index) => {
    const updated = [...transactions];
    updated.splice(index, 1);
    setTransactions(updated);
  };
  const availableCategories =
    transactions.length > 0 && transactions[0].type === "income"
      ? incomeCategories
      : expenseCategories;

  return (
    <ThemeProvider theme={theme}>
      <DashboardLayout
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        selectedItem="Upload Receipt"
      >
        <Box
          maxWidth="sm"
          mx="auto"
          py={6}
          px={2}
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <Typography variant="h5" fontWeight="bold" mb={3}>
            Upload Receipt
          </Typography>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              borderRadius: 4,
              width: "100%",
              border: "2px dashed",
              borderColor: "primary.main",
              textAlign: "center",
              transition: "0.3s",
              backgroundColor: theme.palette.background.default,
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
                cursor: "pointer",
              },
            }}
          >
            <input
              type="file"
              accept="image/*,application/pdf"
              hidden
              id="file-upload"
              onChange={handleFileChange}
            />
            <label htmlFor="file-upload">
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
              >
                <CloudUploadIcon fontSize="large" sx={{ color: "gray" }} />
                <Typography variant="subtitle1" mt={1}>
                  Click or drag file to upload
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Supported formats: JPG, PNG, PDF
                </Typography>
              </Box>
            </label>
          </Paper>

          {selectedFile && (
            <Paper
              elevation={2}
              sx={{
                mt: 4,
                p: 3,
                borderRadius: 3,
                width: "100%",
                backgroundColor: theme.palette.background.paper,
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.05)",
              }}
            >
              <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                Receipt Details
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {previewUrl ? (
                <Box
                  component="img"
                  src={previewUrl}
                  alt="Receipt Preview"
                  sx={{
                    width: "100%",
                    borderRadius: 2,
                    maxHeight: 300,
                    objectFit: "contain",
                  }}
                />
              ) : (
                <Box display="flex" alignItems="center" gap={1}>
                  <InsertDriveFileIcon color="action" />
                  <Typography>{selectedFile.name}</Typography>
                </Box>
              )}

              {uploadProgress > 0 && (
                <Box mt={2}>
                  <Typography variant="body2" gutterBottom>
                    Upload Progress: {uploadProgress}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={uploadProgress}
                    color="primary"
                    sx={{ borderRadius: 1 }}
                  />
                </Box>
              )}

              {isProcessing && (
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  mt={2}
                >
                  <CircularProgress size={24} color="primary" />
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ mt: 1, fontStyle: "italic", textAlign: "center" }}
                  >
                    Processing your file. This may take a few moments...
                  </Typography>
                </Box>
              )}
            </Paper>
          )}

          <Button
            variant="contained"
            color="primary"
            onClick={handleProcess}
            size="large"
            sx={{
              mt: 4,
              borderRadius: 3,
              px: 5,
              py: 1.5,
              textTransform: "none",
              fontWeight: "bold",
              boxShadow: 2,
            }}
          >
            Process Receipt
          </Button>
        </Box>

        <Dialog
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            Extracted Transaction{transactions.length > 1 ? "s" : ""}
          </DialogTitle>
          <DialogContent>
            {transactions.length === 1 ? (
              <>
                {["date", "party", "amount"].map((field) => (
                  <TextField
                    key={field}
                    label={field.charAt(0).toUpperCase() + field.slice(1)}
                    value={transactions[0][field]}
                    onChange={(e) =>
                      handleFieldChange(0, field, e.target.value)
                    }
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                ))}

                {/* Type dropdown */}
                <Select
                  fullWidth
                  value={
                    types.includes(transactions[0].type)
                      ? transactions[0].type
                      : types[0]
                  }
                  onChange={(e) => handleFieldChange(0, "type", e.target.value)}
                  sx={{ mb: 2 }}
                >
                  {types.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>

                {/* Payment Method dropdown */}
                <Select
                  fullWidth
                  value={
                    paymentMethods.includes(transactions[0].paymentMethod)
                      ? transactions[0].paymentMethod
                      : paymentMethods[0]
                  }
                  onChange={(e) =>
                    handleFieldChange(0, "paymentMethod", e.target.value)
                  }
                  sx={{ mb: 2 }}
                >
                  {paymentMethods.map((method) => (
                    <MenuItem key={method} value={method}>
                      {method}
                    </MenuItem>
                  ))}
                </Select>

                {/* Category dropdown */}
                <Select
                  fullWidth
                  value={
                    availableCategories.includes(transactions[0].category)
                      ? transactions[0].category
                      : availableCategories[0]
                  }
                  onChange={(e) =>
                    handleFieldChange(0, "category", e.target.value)
                  }
                  sx={{ mb: 2 }}
                >
                  {availableCategories.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
              </>
            ) : (
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Party</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Payment</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.map((tx, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <TextField
                          value={tx.date}
                          onChange={(e) =>
                            handleFieldChange(index, "date", e.target.value)
                          }
                          size="small"
                          fullWidth
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          value={tx.party}
                          onChange={(e) =>
                            handleFieldChange(index, "party", e.target.value)
                          }
                          size="small"
                          fullWidth
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          value={tx.amount}
                          onChange={(e) =>
                            handleFieldChange(index, "amount", e.target.value)
                          }
                          size="small"
                          fullWidth
                        />
                      </TableCell>
                      <TableCell>
                        <Select
                          value={types.includes(tx.type) ? tx.type : types[0]}
                          onChange={(e) =>
                            handleFieldChange(index, "type", e.target.value)
                          }
                          size="small"
                          fullWidth
                        >
                          {types.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={
                            paymentMethods.includes(tx.paymentMethod)
                              ? tx.paymentMethod
                              : paymentMethods[0]
                          }
                          onChange={(e) =>
                            handleFieldChange(
                              index,
                              "paymentMethod",
                              e.target.value
                            )
                          }
                          size="small"
                          fullWidth
                        >
                          {paymentMethods.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={
                            (tx.type === "income"
                              ? incomeCategories
                              : expenseCategories
                            ).includes(tx.category)
                              ? tx.category
                              : (tx.type === "income"
                                  ? incomeCategories
                                  : expenseCategories)[0]
                          }
                          onChange={(e) =>
                            handleFieldChange(index, "category", e.target.value)
                          }
                          size="small"
                          fullWidth
                        >
                          {(tx.type === "income"
                            ? incomeCategories
                            : expenseCategories
                          ).map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteRow(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setModalOpen(false)}>Close</Button>
            <Button
              variant="contained"
              onClick={async () => {
                try {
                  const transactionsWithCreateAt = transactions.map((txn) => {
                    const { date, ...rest } = txn;

                    const [day, month, year] = date.split(/[/\-]/);
                    const isoDate = new Date(
                      `${year}-${month}-${day}`
                    ).toISOString();
                    return {
                      ...rest,
                      createdAt: isoDate,
                    };
                  });

                  const token = localStorage.getItem("token");
                  setModalOpen(false);
                  const response = await axios.post(
                    `${API_BASE_URL}/transactions/bulk`,
                    transactionsWithCreateAt,
                    {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  );
                  toast({
                    title: "Success",
                    description: "Transactions saved successfully!",
                    variant: "success",
                  });
                  setSelectedFile(null);
                  setPreviewUrl("");
                  setUploadProgress(0);
                  setTransactions([]);
                  setIsProcessing(false);
                } catch (error) {
                  console.error(error);
                  toast({
                    title: "Error",
                    description: "Failed to save transactions.",
                    variant: "destructive",
                  });
                }
              }}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </DashboardLayout>
    </ThemeProvider>
  );
};

export default ReceiptUploadPage;
