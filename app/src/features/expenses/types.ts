export type ExpenseCurrency = 'BRL' | 'USD' | 'EUR';

export type Expense = {
  id: string;
  description: string;
  amount: number;
  currency: ExpenseCurrency;
  date: string;
  categoryId: string;
  type: 'income' | 'expense';
};

export type ExpenseCategory = {
  id: string;
  name: string;
};

export type ExpenseForm = {
  description: string;
  amount: string;
  currency: ExpenseCurrency;
  date: string;
  categoryId: string;
};

export type ExpenseListEntry = {
  id: string;
  description: string;
  date: string;
  categoryName: string;
  amount: number;
  amountLabel: string;
  currency: ExpenseCurrency;
  type: 'income' | 'expense';
};

export type ExpenseDetailEntry = {
  id: string;
  description: string;
  amount: number;
  amountLabel: string;
  currency: ExpenseCurrency;
  currencyLabel: string;
  date: string;
  categoryName: string;
};

export type ExpenseListState = {
  status: 'loading' | 'ok' | 'empty' | 'error';
  items: ExpenseListEntry[];
  message?: string;
};

export type ExpenseResponse = {
  expenses: Expense[];
  status: 'ok' | 'empty' | 'error';
  message?: string;
};

export type ExpenseDetailResponse = {
  expense?: Expense;
  status: 'ok' | 'not-found' | 'error';
  message?: string;
};
