import { useState, useMemo, useEffect } from "react";
import {
  ThemeProvider,
  createTheme,
  Box,
  CircularProgress,
} from "@mui/material";
import DashboardLayout from "../components/Dashboard/Layout";
import StatCard from "../components/Dashboard/Cards";
import PieChartBox from "../components/Dashboard/PieChartBox";
import LineChartBox from "../components/Dashboard/LineChartBox";
import TransactionsTable from "../components/Dashboard/TransactionsTable";
import SearchFilters from "../components/Dashboard/SearchFilters";
import axios from "axios";
import {
  AccountBalanceWallet as Wallet,
  TrendingUp,
  TrendingDown,
  Receipt,
} from "@mui/icons-material";
import { trendSampleData } from "../data/chartData";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const COLORS = [
  "#4285F4",
  "#DB4437",
  "#F4B400",
  "#0F9D58",
  "#AB47BC",
  "#00ACC1",
  "#FF7043",
  "#9E9D24",
];

export default function Dashboard() {
  const [darkMode, setDarkMode] = useState(() => {
    const storedMode = localStorage.getItem("darkMode");
    return storedMode ? JSON.parse(storedMode) : false;
  });

  const [transactions, setTransactions] = useState([]);
  const [incomeData, setIncomeData] = useState([]);
  const [expenditureData, setExpenditureData] = useState([]);
  const [stats, setStats] = useState([]);
  const [trendSampleData, setTrendSampleData] = useState({});
  const [period, setPeriod] = useState("week");

  // Filter states
  const [searchParty, setSearchParty] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [searchPaymentMethod, setSearchPaymentMethod] = useState([
    "cash",
    "card",
    "bank_transfer",
    "upi",
    "other",
  ]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const theme = useMemo(
    () => createTheme({ palette: { mode: darkMode ? "dark" : "light" } }),
    [darkMode]
  );

  const fetchTrendData = async (selectedPeriod) => {
    try {
      const token = localStorage.getItem("token");

      const trendResponse = await axios.get(
        `${API_BASE_URL}/transactions/stats?period=${selectedPeriod}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTrendSampleData(trendResponse.data);
    } catch (err) {
      console.error("Failed to load trend data:", err);
    }
  };

  useEffect(() => {
    if (period) {
      const apiPeriod = {
        week: "weekly",
        month: "monthly",
        year: "yearly",
      }[period];
      fetchTrendData(apiPeriod);
    }
  }, [period]);
  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const query = new URLSearchParams({
        page: 0,
        limit: 10,
        ...(searchParty && { party: searchParty }),
        ...(searchCategory && { category: searchCategory }),
        ...(searchPaymentMethod && {
          paymentMethod: JSON.stringify(searchPaymentMethod),
        }),
        ...(fromDate && { fromDate }),
        ...(toDate && { toDate }),
      });

      const token = localStorage.getItem("token");

      const mainResponse = await axios.get(
        `${API_BASE_URL}/transactions?${query.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const {
        results,
        incomeBreakdown,
        expenditureBreakdown,
        totalExpenditure,
        totalIncome,
        totalBalance,
        totalTransactions,
      } = mainResponse.data;

      setTransactions(results);
      setIncomeData(incomeBreakdown);
      setExpenditureData(expenditureBreakdown);
      setStats([
        {
          title: "Balance",
          value: `₹ ${Number(totalBalance).toLocaleString("en-IN")}`,
          icon: <Wallet />,
          color: "#1976d2",
        },
        {
          title: "Income",
          value: `₹ ${Number(totalIncome).toLocaleString("en-IN")}`,
          icon: <TrendingUp />,
          color: "#388e3c",
        },
        {
          title: "Expenditure",
          value: `₹ ${Number(totalExpenditure).toLocaleString("en-IN")}`,
          icon: <TrendingDown />,
          color: "#d32f2f",
        },
        {
          title: "Transactions",
          value: Number(totalTransactions).toLocaleString("en-IN"),
          icon: <Receipt />,
          color: "#7b1fa2",
        },
      ]);
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [searchParty, searchCategory, searchPaymentMethod, fromDate, toDate]);

  const categories = useMemo(
    () => [...new Set(transactions.map((t) => t.category))],
    [transactions]
  );

  const types = useMemo(
    () => [...new Set(transactions.map((t) => t.type))],
    [transactions]
  );

  const statuses = useMemo(
    () => [...new Set(transactions.map((t) => t.status))],
    [transactions]
  );

  return (
    <ThemeProvider theme={theme}>
      <DashboardLayout
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        selectedItem="Dashboard"
      >
        <SearchFilters
          searchParty={searchParty}
          setSearchParty={setSearchParty}
          searchCategory={searchCategory}
          setSearchCategory={setSearchCategory}
          searchPaymentMethod={searchPaymentMethod}
          setSearchPaymentMethod={setSearchPaymentMethod}
          fromDate={fromDate}
          setFromDate={setFromDate}
          toDate={toDate}
          setToDate={setToDate}
        />

        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="50vh"
          >
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Box display="flex" flexWrap="wrap" gap={2}>
              {stats.map((stat, idx) => (
                <StatCard key={idx} {...stat} darkMode={darkMode} />
              ))}
            </Box>

            <Box display="flex" flexWrap="wrap" gap={2} mt={2} mb={2}>
              <PieChartBox
                title="Income Breakdown"
                data={incomeData}
                colors={COLORS}
              />
              <PieChartBox
                title="Expenditure Breakdown"
                data={expenditureData}
                colors={COLORS}
              />
            </Box>

            <LineChartBox
              data={trendSampleData || []}
              period={period}
              setPeriod={setPeriod}
            />

            <TransactionsTable
              transactions={transactions}
              darkMode={darkMode}
            />
          </>
        )}
      </DashboardLayout>
    </ThemeProvider>
  );
}
