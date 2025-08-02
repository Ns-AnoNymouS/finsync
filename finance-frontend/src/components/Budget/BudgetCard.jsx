import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, AlertTriangle } from 'lucide-react';

const BudgetCard = ({ budget, onEdit, onDelete }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount || 0);
  };

  const spent = budget.spent || 0;
  const limit = budget.limit || 0;
  const percentage = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
  const remaining = Math.max(limit - spent, 0);
  const isOverBudget = spent > limit;
  const isNearLimit = percentage >= 80 && !isOverBudget;

  // Get color based on percentage
  const getProgressColor = () => {
    if (isOverBudget) return 'bg-expense';
    if (isNearLimit) return 'bg-accent';
    return 'bg-income';
  };

  const getStatusBadge = () => {
    if (isOverBudget) {
      return (
        <Badge variant="destructive" className="bg-expense text-expense-foreground">
          Over Budget
        </Badge>
      );
    }
    if (isNearLimit) {
      return (
        <Badge variant="secondary" className="bg-accent text-accent-foreground">
          Near Limit
        </Badge>
      );
    }
    return (
      <Badge variant="default" className="bg-income text-income-foreground">
        On Track
      </Badge>
    );
  };

  return (
    <Card className="shadow-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">{budget.category}</CardTitle>
        <div className="flex items-center space-x-2">
          {(isOverBudget || isNearLimit) && (
            <AlertTriangle className={`h-4 w-4 ${isOverBudget ? 'text-expense' : 'text-accent'}`} />
          )}
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Budget amounts */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Spent</span>
            <span className={`font-medium ${isOverBudget ? 'text-expense' : ''}`}>
              {formatCurrency(spent)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Budget</span>
            <span className="font-medium">{formatCurrency(limit)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Remaining</span>
            <span className={`font-medium ${isOverBudget ? 'text-expense' : 'text-income'}`}>
              {isOverBudget ? `-${formatCurrency(spent - limit)}` : formatCurrency(remaining)}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progress</span>
            <span>{percentage.toFixed(0)}%</span>
          </div>
          <div className="relative">
            <Progress 
              value={Math.min(percentage, 100)} 
              className="h-2"
            />
            <div 
              className={`absolute top-0 left-0 h-2 rounded-full transition-all ${getProgressColor()}`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex space-x-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(budget)}
            className="flex-1"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(budget.id)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Warning message */}
        {isOverBudget && (
          <div className="p-3 bg-expense-light rounded-lg border border-expense/20">
            <p className="text-sm text-expense font-medium">
              You've exceeded your budget by {formatCurrency(spent - limit)}
            </p>
          </div>
        )}

        {isNearLimit && !isOverBudget && (
          <div className="p-3 bg-accent/10 rounded-lg border border-accent/20">
            <p className="text-sm text-accent-foreground">
              You're close to your budget limit. {formatCurrency(remaining)} remaining.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BudgetCard;