import { useState, useEffect, useMemo } from "react";
import TransactionForm from "../components/Transactions/TransactionForm";
import TransactionList from "../components/Transactions/TransactionList";
import ReceiptUpload from "../components/Receipt/ReceiptUpload";
import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "../components/Dashboard/Layout";
import { ThemeProvider, createTheme } from "@mui/material";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showReceiptUpload, setShowReceiptUpload] = useState(false);
  const [loading, setLoading] = useState(true);
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
        palette: { mode: darkMode ? "dark" : "light" },
      }),
    [darkMode]
  );

  const handleFormSubmit = async (transactionData) => {
    try {
      if (editingTransaction) {
        const updated = transactions.map((t) =>
          t.id === editingTransaction.id
            ? { ...transactionData, id: editingTransaction.id }
            : t
        );
        setTransactions(updated);
        toast({
          title: "Transaction updated",
          description: "Your transaction has been successfully updated.",
        });
      } else {
        const newTransaction = {
          ...transactionData,
          id: Date.now().toString(),
        };
        setTransactions((prev) => [newTransaction, ...prev]);
        toast({
          title: "Transaction added",
          description: "Your transaction has been successfully added.",
        });
      }
      setShowForm(false);
      setEditingTransaction(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save transaction",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
    setShowReceiptUpload(false);
  };

  const handleDelete = async (id) => {
    try {
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      toast({
        title: "Transaction deleted",
        description: "The transaction has been successfully removed.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete transaction",
        variant: "destructive",
      });
    }
  };

  const handleReceiptExtraction = (data) => {
    setEditingTransaction(null);
    setShowForm(true);
    setShowReceiptUpload(false);
    setTimeout(() => {
      setEditingTransaction({
        payee: data.payee,
        amount: data.amount,
        date: data.date,
        category: data.category,
        description: data.description,
        type: "expense",
        paymentMethod: "Credit Card",
      });
    }, 100);
  };

  const handleCancel = () => {
    setShowForm(false);
    setShowReceiptUpload(false);
    setEditingTransaction(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <DashboardLayout
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        selectedItem="Transactions"
      >
        <div className="space-y-8">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <TransactionList
                onEdit={handleEdit}
                onDelete={handleDelete}
                loading={loading}
              />
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ThemeProvider>
  );
};

export default Transactions;
