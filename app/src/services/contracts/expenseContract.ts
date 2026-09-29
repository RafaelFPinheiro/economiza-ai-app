export type ExpenseCurrency = 'BRL' | 'USD' | 'EUR';
export type TransactionType = 'income' | 'expense';

export type ExpenseContract = {
  id: string;
  description: string;
  amount: number;
  currency: ExpenseCurrency;
  date: string;
  categoryId: string;
  type: TransactionType;
};

export type ExpenseCategoryContract = {
  id: string;
  name: string;
};

export type ExpenseListContract = {
  expenses: ExpenseContract[];
  status: 'ok' | 'empty' | 'error';
  message?: string;
};

export type ExpenseDetailContract = {
  expense?: ExpenseContract;
  status: 'ok' | 'not-found' | 'error';
  message?: string;
};

export type ExpenseInput = {
  description: string;
  amount: number;
  currency: ExpenseCurrency;
  date: string;
  categoryId: string;
};

export type ExpenseCategoryLookup = {
  categories: ExpenseCategoryContract[];
  status: 'ok' | 'error';
  message?: string;
};
