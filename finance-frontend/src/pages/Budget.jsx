import React, { useState, useEffect } from 'react';
import Navbar from '../components/Common/Navbar';
import BudgetCard from '../components/Budget/BudgetCard';
import BudgetForm from '../components/Budget/BudgetForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Target, TrendingUp, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { budgetAPI } from '../services/api';

const Budget = () => {
  const [budgets, setBudgets] = useState([]);
  const [editingBudget, setEditingBudget] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Sample budget data for demo
  const sampleBudgets = [
    {
      id: '1',
      category: 'Food & Dining',
      limit: 500.00,
      spent: 387.50,
      period: 'monthly'
    },
    {
      id: '2',
      category: 'Transportation',
      limit: 300.00,
      spent: 245.00,
      period: 'monthly'
    },
    {
      id: '3',
      category: 'Entertainment',
      limit: 200.00,
      spent: 165.99,
      period: 'monthly'
    },
    {
      id: '4',
      category: 'Shopping',
      limit: 400.00,
      spent: 520.00, // Over budget
      period: 'monthly'
    },
    {
      id: '5',
      category: 'Healthcare',
      limit: 150.00,
      spent: 45.00,
      period: 'monthly'
    },
    {
      id: '6',
      category: 'Bills & Utilities',
      limit: 350.00,
      spent: 320.00, // Near limit
      period: 'monthly'
    }
  ];

  // Load budgets
  useEffect(() => {
    const loadBudgets = async () => {
      try {
        setLoading(true);
        // In a real app: const response = await budgetAPI.getAll();
        // For demo, using sample data
        setBudgets(sampleBudgets);
      } catch (error) {
        console.error('Error loading budgets:', error);
        toast({
          title: "Error",
          description: "Failed to load budgets",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadBudgets();
  }, []);

  // Calculate summary stats
  const summaryStats = React.useMemo(() => {
    const totalBudget = budgets.reduce((sum, budget) => sum + budget.limit, 0);
    const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);
    const overBudgetCount = budgets.filter(budget => budget.spent > budget.limit).length;
    const nearLimitCount = budgets.filter(budget => {
      const percentage = budget.limit > 0 ? (budget.spent / budget.limit) * 100 : 0;
      return percentage >= 80 && budget.spent <= budget.limit;
    }).length;

    return {
      totalBudget,
      totalSpent,
      overBudgetCount,
      nearLimitCount,
      remaining: totalBudget - totalSpent,
      usagePercentage: totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0
    };
  }, [budgets]);

  // Handle form submission
  const handleFormSubmit = async (budgetData) => {
    try {
      if (editingBudget) {
        // Update existing budget
        const updatedBudgets = budgets.map(b =>
          b.id === editingBudget.id
            ? { ...budgetData, id: editingBudget.id }
            : b
        );
        setBudgets(updatedBudgets);
        
        toast({
          title: "Budget updated",
          description: "Your budget has been successfully updated.",
        });
      } else {
        // Add new budget
        const newBudget = {
          ...budgetData,
          id: Date.now().toString(),
          spent: 0 // New budgets start with 0 spent
        };
        setBudgets(prev => [...prev, newBudget]);
        
        toast({
          title: "Budget created",
          description: "Your new budget has been successfully created.",
        });
      }

      // Reset form state
      setShowForm(false);
      setEditingBudget(null);
    } catch (error) {
      console.error('Error saving budget:', error);
      toast({
        title: "Error",
        description: "Failed to save budget",
        variant: "destructive",
      });
    }
  };

  // Handle edit budget
  const handleEdit = (budget) => {
    setEditingBudget(budget);
    setShowForm(true);
  };

  // Handle delete budget
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      try {
        setBudgets(prev => prev.filter(b => b.id !== id));
        
        toast({
          title: "Budget deleted",
          description: "The budget has been successfully removed.",
        });
      } catch (error) {
        console.error('Error deleting budget:', error);
        toast({
          title: "Error",
          description: "Failed to delete budget",
          variant: "destructive",
        });
      }
    }
  };

  // Handle cancel form
  const handleCancel = () => {
    setShowForm(false);
    setEditingBudget(null);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount || 0);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Budget Management</h1>
            <p className="text-muted-foreground">
              Set and track your spending limits
            </p>
          </div>
          
          <Button
            onClick={() => {
              setShowForm(!showForm);
              setEditingBudget(null);
            }}
            className="bg-gradient-primary hover:opacity-90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Budget
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Budget
              </CardTitle>
              <Target className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(summaryStats.totalBudget)}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Spent
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-expense" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-expense">
                {formatCurrency(summaryStats.totalSpent)}
              </div>
              <p className="text-xs text-muted-foreground">
                {summaryStats.usagePercentage.toFixed(1)}% of budget used
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Remaining
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-income" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-income">
                {formatCurrency(summaryStats.remaining)}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Alerts
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {summaryStats.overBudgetCount + summaryStats.nearLimitCount}
              </div>
              <p className="text-xs text-muted-foreground">
                {summaryStats.overBudgetCount} over, {summaryStats.nearLimitCount} near limit
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Content Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Form Section */}
          <div className="lg:col-span-1">
            {showForm ? (
              <BudgetForm
                budget={editingBudget}
                onSubmit={handleFormSubmit}
                onCancel={handleCancel}
              />
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
                <div className="space-y-4">
                  <div className="mx-auto w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                    <Target className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-medium">Create a Budget</h3>
                    <p className="text-sm text-muted-foreground">
                      Set spending limits for different categories
                    </p>
                  </div>
                  <Button
                    onClick={() => setShowForm(true)}
                    variant="outline"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Budget
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Budget Cards Grid */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="grid gap-4 md:grid-cols-2">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="shadow-card">
                    <CardContent className="p-6">
                      <div className="animate-pulse space-y-3">
                        <div className="h-5 bg-muted rounded w-3/4"></div>
                        <div className="h-4 bg-muted rounded"></div>
                        <div className="h-2 bg-muted rounded"></div>
                        <div className="h-8 bg-muted rounded w-1/2"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : budgets.length === 0 ? (
              <Card className="shadow-card">
                <CardContent className="p-12 text-center">
                  <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No budgets created</h3>
                  <p className="text-muted-foreground mb-4">
                    Start by creating your first budget to track your spending
                  </p>
                  <Button
                    onClick={() => setShowForm(true)}
                    className="bg-gradient-primary hover:opacity-90"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Budget
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {budgets.map((budget) => (
                  <BudgetCard
                    key={budget.id}
                    budget={budget}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Budget;