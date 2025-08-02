import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Pagination,
  Chip,
  CircularProgress,
  Stack,
  InputAdornment,
} from "@mui/material";
import { Edit, Delete, Search } from "@mui/icons-material";
import { format } from "date-fns";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import EditTransactionModal from "./EditTransactionModal";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const TransactionList = ({ onEdit, onDelete }) => {
  const { toast } = useToast();
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [sortBy, setSortBy] = useState("createdAt:desc");
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(true);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const resetPage = () => setCurrentPage(1);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        page: currentPage,
        limit,
        ...(searchTerm && { party: searchTerm }),
        ...(categoryFilter !== "all" && { category: categoryFilter }),
        ...(typeFilter !== "all" && { type: typeFilter }),
        ...(fromDate && { fromDate }),
        ...(toDate && { toDate }),
        ...(sortBy && { sortBy }),
      });

      const token = localStorage.getItem("token");

      const [transactionsRes, categoriesRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/transactions?${query.toString()}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_BASE_URL}/categories`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const transactions = transactionsRes.data.results || [];
      const total = transactionsRes.data.totalResults || 0;
      const staticCategories = categoriesRes.data.categories || [];

      setTransactions(transactions);
      setTotalResults(total);

      // Extract category names from static list
      const staticCategoryNames = staticCategories.map((cat) => cat.name);

      // Extract unique categories from transactions
      const transactionCategories = [
        ...new Set(transactions.map((t) => t.category)),
      ];

      // Merge both (union) without duplicates
      const allCategories = Array.from(
        new Set([...staticCategoryNames, ...transactionCategories])
      );
      console.log(staticCategories);
      setCategories(allCategories);
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          err?.response?.data?.message || "Failed to fetch transactions.",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTransactions();
  }, [
    categoryFilter,
    typeFilter,
    currentPage,
    limit,
    sortBy,
    fromDate,
    toDate,
  ]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchTransactions();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const formatCurrency = (amount, currency = "USD") =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount);

  const handleDelete = async ({ tid }) => {
    if (!window.confirm("Delete this transaction?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/transactions/${tid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast({
        variant: "default",
        title: "Success",
        description: "Transaction deleted successfully.",
      });

      await fetchTransactions();
    } catch (err) {
      console.error("Failed to delete transaction:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          err?.response?.data?.message || "Failed to delete transaction.",
      });
    }
  };

  return (
    <Card elevation={4} sx={{ p: { xs: 2, md: 3 } }}>
      <CardHeader
        title={<Typography variant="h5">Transaction History</Typography>}
        subheader="View, filter, and manage your transactions"
        sx={{ mb: 2 }}
      />
      <CardContent>
        <Box display="flex" flexWrap="wrap" gap={2} mb={2}>
          <TextField
            label="Search Party"
            size="small"
            sx={{ flex: "1 1 300px" }}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              resetPage();
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />

          <FormControl size="small" sx={{ flex: "1 1 200px" }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                resetPage();
              }}
              label="Category"
            >
              <MenuItem value="all">All Categories</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ flex: "1 1 200px" }}>
            <InputLabel>Type</InputLabel>
            <Select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                resetPage();
              }}
              label="Type"
            >
              <MenuItem value="all">All Types</MenuItem>
              <MenuItem value="income">Income</MenuItem>
              <MenuItem value="expenditure">Expenditure</MenuItem>
            </Select>
          </FormControl>

          <TextField
            type="date"
            label="From Date"
            size="small"
            InputLabelProps={{ shrink: true }}
            sx={{ flex: "1 1 200px" }}
            value={fromDate}
            onChange={(e) => {
              setFromDate(e.target.value);
              resetPage();
            }}
          />

          <TextField
            type="date"
            label="To Date"
            size="small"
            InputLabelProps={{ shrink: true }}
            sx={{ flex: "1 1 200px" }}
            value={toDate}
            onChange={(e) => {
              setToDate(e.target.value);
              resetPage();
            }}
          />

          <FormControl size="small" sx={{ flex: "1 1 200px" }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                resetPage();
              }}
              label="Sort By"
            >
              <MenuItem value="createdAt:desc">Date (Newest)</MenuItem>
              <MenuItem value="createdAt:asc">Date (Oldest)</MenuItem>
              <MenuItem value="amount:desc">Amount (High → Low)</MenuItem>
              <MenuItem value="amount:asc">Amount (Low → High)</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ flex: "1 1 200px" }}>
            <InputLabel>Items/Page</InputLabel>
            <Select
              value={limit}
              onChange={(e) => {
                setLimit(parseInt(e.target.value));
                resetPage();
              }}
              label="Items/Page"
            >
              {[5, 10, 25, 50].map((val) => (
                <MenuItem key={val} value={val}>
                  {val}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow sx={{ fontWeight: "bold" }}>
                <TableCell>
                  <strong>Date</strong>
                </TableCell>
                <TableCell>
                  <strong>Party</strong>
                </TableCell>
                <TableCell>
                  <strong>Description</strong>
                </TableCell>
                <TableCell>
                  <strong>Category</strong>
                </TableCell>
                <TableCell>
                  <strong>Type</strong>
                </TableCell>
                <TableCell align="right">
                  <strong>Amount (₹)</strong>
                </TableCell>
                <TableCell align="right">
                  <strong>Actions</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <CircularProgress size={24} />
                  </TableCell>
                </TableRow>
              ) : transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No transactions found.
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((t) => (
                  <TableRow key={t.id} hover>
                    <TableCell>
                      {t.date || t.createdAt
                        ? format(
                            new Date(t.date || t.createdAt),
                            "MMM dd, yyyy, hh:mm a"
                          )
                        : "Invalid Date"}
                    </TableCell>
                    <TableCell>{t.party}</TableCell>
                    <TableCell>{t.description}</TableCell>
                    <TableCell>{t.category}</TableCell>
                    <TableCell>
                      <Chip
                        label={t.type}
                        color={t.type === "income" ? "success" : "error"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      {formatCurrency(Math.abs(t.amount), t.currency)}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={() => {
                          setEditingTransaction(t);
                          setIsEditModalOpen(true);
                        }}
                        size="small"
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete({ tid: t.id })}
                        size="small"
                        color="error"
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {totalResults > limit && (
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mt={3}
          >
            <Typography variant="body2" color="text.secondary">
              Showing {(currentPage - 1) * limit + 1}–
              {Math.min(currentPage * limit, totalResults)} of {totalResults}
            </Typography>
            <Pagination
              count={Math.ceil(totalResults / limit)}
              page={currentPage}
              onChange={(_, page) => setCurrentPage(page)}
              size="medium"
              color="primary"
            />
          </Box>
        )}
      </CardContent>
      <EditTransactionModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        transaction={editingTransaction}
        onUpdate={fetchTransactions}
      />
    </Card>
  );
};

export default TransactionList;
