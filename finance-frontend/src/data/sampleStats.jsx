import {
  AccountBalanceWallet as Wallet,
  TrendingUp,
  TrendingDown,
  Receipt,
} from "@mui/icons-material";

export const stats = [
  { title: "Balance", value: "₹24,500", icon: <Wallet />, color: "#1976d2" },
  { title: "Income", value: "₹80,000", icon: <TrendingUp />, color: "#388e3c" },
  {
    title: "Expenditure",
    value: "₹55,500",
    icon: <TrendingDown />,
    color: "#d32f2f",
  },
  { title: "Transactions", value: "34", icon: <Receipt />, color: "#7b1fa2" },
];
