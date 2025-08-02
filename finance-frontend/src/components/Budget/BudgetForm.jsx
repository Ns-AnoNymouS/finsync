import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Plus, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const BudgetForm = ({ budget, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    category: '',
    limit: '',
    period: 'monthly'
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
    'Other'
  ];

  // Populate form if editing
  useEffect(() => {
    if (budget) {
      setFormData({
        category: budget.category || '',
        limit: budget.limit?.toString() || '',
        period: budget.period || 'monthly'
      });
    }
  }, [budget]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.limit || parseFloat(formData.limit) <= 0) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid budget amount.",
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
      limit: parseFloat(formData.limit),
      spent: budget?.spent || 0, // Keep existing spent amount for edits
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
        <CardTitle className="flex items-center space-x-2">
          <Target className="h-5 w-5" />
          <span>{budget ? 'Edit Budget' : 'Create New Budget'}</span>
        </CardTitle>
        <CardDescription>
          {budget 
            ? 'Update your budget settings'
            : 'Set spending limits for different categories'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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

          {/* Budget Amount */}
          <div className="space-y-2">
            <Label htmlFor="limit">Budget Amount ($)</Label>
            <Input
              id="limit"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={formData.limit}
              onChange={(e) => handleInputChange('limit', e.target.value)}
              required
            />
          </div>

          {/* Period */}
          <div className="space-y-2">
            <Label>Budget Period</Label>
            <Select
              value={formData.period}
              onValueChange={(value) => handleInputChange('period', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Budget preview */}
          {formData.limit && (
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2">Budget Summary</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Category:</span>
                  <span className="font-medium">
                    {showCustomCategory && customCategory ? customCategory : formData.category || 'Not selected'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Limit:</span>
                  <span className="font-medium">
                    ${parseFloat(formData.limit || 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Period:</span>
                  <span className="font-medium capitalize">{formData.period}</span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-gradient-primary hover:opacity-90"
            >
              {budget ? 'Update Budget' : 'Create Budget'}
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

export default BudgetForm;