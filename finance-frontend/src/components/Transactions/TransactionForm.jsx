import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, CalendarIcon, Plus, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';

const TransactionForm = ({ transaction, onSubmit, onCancel, categories }) => {
  const [formData, setFormData] = useState({
    payee: '',
    category: '',
    amount: '',
    date: new Date(),
    paymentMethod: '',
    type: 'expense',
    description: ''
  });
  const [customCategory, setCustomCategory] = useState('');
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const { toast } = useToast();

  // Default categories
  const defaultCategories = [
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Entertainment',
    'Bills & Utilities',
    'Healthcare',
    'Travel',
    'Education',
    'Personal Care',
    'Groceries',
    'Rent/Mortgage',
    'Insurance',
    'Savings',
    'Investment',
    'Other'
  ];

  const paymentMethods = [
    'Cash',
    'Credit Card',
    'Debit Card',
    'Bank Transfer',
    'PayPal',
    'Other'
  ];

  // Populate form if editing
  useEffect(() => {
    if (transaction) {
      setFormData({
        payee: transaction.payee || '',
        category: transaction.category || '',
        amount: transaction.amount?.toString() || '',
        date: transaction.date ? new Date(transaction.date) : new Date(),
        paymentMethod: transaction.paymentMethod || '',
        type: transaction.type || 'expense',
        description: transaction.description || ''
      });
    }
  }, [transaction]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.payee.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a payee name.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid amount.",
        variant: "destructive",
      });
      return;
    }

    const finalCategory = showCustomCategory && customCategory.trim() 
      ? customCategory.trim() 
      : formData.category;

    if (!finalCategory) {
      toast({
        title: "Validation Error",
        description: "Please select or enter a category.",
        variant: "destructive",
      });
      return;
    }

    // Prepare submission data
    const submitData = {
      ...formData,
      category: finalCategory,
      amount: parseFloat(formData.amount),
      date: formData.date.toISOString()
    };

    onSubmit(submitData);
  };

  const handleAddCustomCategory = () => {
    if (customCategory.trim()) {
      setFormData(prev => ({
        ...prev,
        category: customCategory.trim()
      }));
      setShowCustomCategory(false);
      setCustomCategory('');
    }
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle>
          {transaction ? 'Edit Transaction' : 'Add New Transaction'}
        </CardTitle>
        <CardDescription>
          {transaction 
            ? 'Update the transaction details below'
            : 'Enter the details for your new transaction'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Transaction Type */}
          <div className="space-y-2">
            <Label>Transaction Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => handleInputChange('type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Payee */}
          <div className="space-y-2">
            <Label htmlFor="payee">Payee</Label>
            <Input
              id="payee"
              placeholder="Enter payee name"
              value={formData.payee}
              onChange={(e) => handleInputChange('payee', e.target.value)}
              required
            />
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => handleInputChange('amount', e.target.value)}
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>Category</Label>
            {!showCustomCategory ? (
              <div className="space-y-2">
                <Select
                  value={formData.category}
                  onValueChange={(value) => {
                    if (value === 'custom') {
                      setShowCustomCategory(true);
                    } else {
                      handleInputChange('category', value);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {defaultCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                    <SelectItem value="custom">
                      <div className="flex items-center space-x-2">
                        <Plus className="h-4 w-4" />
                        <span>Add Custom Category</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter custom category"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddCustomCategory}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowCustomCategory(false);
                    setCustomCategory('');
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.date ? format(formData.date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={formData.date}
                  onSelect={(date) => handleInputChange('date', date)}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <Label>Payment Method</Label>
            <Select
              value={formData.paymentMethod}
              onValueChange={(value) => handleInputChange('paymentMethod', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map((method) => (
                  <SelectItem key={method} value={method}>
                    {method}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Add any additional notes..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-gradient-primary hover:opacity-90"
            >
              {transaction ? 'Update Transaction' : 'Add Transaction'}
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1"
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TransactionForm;