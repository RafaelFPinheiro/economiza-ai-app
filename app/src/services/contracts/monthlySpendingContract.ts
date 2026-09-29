export type ComparisonDirection = 'increase' | 'decrease' | 'no-change';
export type TransactionType = 'income' | 'expense';

export type CategorySummary = {
  category: string;
  amount: number;
  shareOfTotal: number;
};

export type TransactionSummary = {
  id: string;
  date: string;
  description: string;
  amount: number;
  category?: string;
  type: TransactionType;
  currency?: string;
};

export type MonthlySpendingResponse = {
  month: string;
  totalSpending: number;
  previousMonthTotal: number;
  comparisonDifference: number;
  comparisonDirection: ComparisonDirection;
  categories: CategorySummary[];
  transactions: TransactionSummary[];
  status: 'ok' | 'empty' | 'error';
};
