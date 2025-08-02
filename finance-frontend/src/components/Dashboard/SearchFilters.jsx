import React, { useState } from "react";
import {
  Box,
  TextField,
  Modal,
  IconButton,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Checkbox,
  ListItemText,
  Fab,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";

const paymentMethods = ["cash", "card", "bank_transfer", "upi", "other"];

const formatText = (text) => {
  if (!text) return "";
  return text
    .replace(/_/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const SearchFilters = ({
  searchParty,
  setSearchParty,
  searchCategory,
  setSearchCategory,
  searchPaymentMethod,
  setSearchPaymentMethod,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  filterType,
  setFilterType,
}) => {
  const [open, setOpen] = useState(false);

  const handlePaymentChange = (event) => {
    const {
      target: { value },
    } = event;
    setSearchPaymentMethod(
      typeof value === "string" ? value.split(",") : value
    );
  };

  return (
    <>
      {/* Floating Filter Button */}
      <Fab
        color="primary"
        aria-label="filter"
        onClick={() => setOpen(true)}
        sx={{ position: "fixed", bottom: 16, right: 16, zIndex: 1300 }}
      >
        <FilterListIcon />
      </Fab>

      {/* Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: 400,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {/* From and To Date */}
          <Box display="flex" gap={2}>
            <TextField
              label="From Date"
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="To Date"
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Box>

          {/* Type Filter */}
          <FormControl fullWidth>
            <InputLabel>Type</InputLabel>
            <Select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              label="Type"
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="income">Income</MenuItem>
              <MenuItem value="expenditure">Expenditure</MenuItem>
            </Select>
          </FormControl>

          {/* Party Search */}
          <TextField
            label="Search by Party"
            value={searchParty}
            onChange={(e) => setSearchParty(e.target.value)}
            fullWidth
          />

          {/* Category Search */}
          <TextField
            label="Search by Category"
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
            fullWidth
          />

          {/* Payment Method (Multi-select) */}
          <FormControl fullWidth>
            <InputLabel>Payment Method</InputLabel>
            <Select
              multiple
              value={searchPaymentMethod}
              onChange={handlePaymentChange}
              renderValue={(selected) =>
                selected.map((item) => formatText(item)).join(", ")
              }
              label="Payment Method"
            >
              {paymentMethods.map((method) => (
                <MenuItem key={method} value={method}>
                  <Checkbox
                    checked={searchPaymentMethod.indexOf(method) > -1}
                  />
                  <ListItemText primary={formatText(method)} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Modal>
    </>
  );
};

export default SearchFilters;
