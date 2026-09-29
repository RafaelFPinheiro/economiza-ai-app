import { DEFAULT_CURRENCY, SUPPORTED_CURRENCIES } from '../constants';
import type { Expense, ExpenseCategory, ExpenseDetailEntry, ExpenseListEntry } from '../types';

const currencySymbols: Record<string, string> = {
  BRL: 'R$',
  USD: 'US$',
  EUR: '€'
};

export function formatCurrency(amount: number, currency: string = DEFAULT_CURRENCY, type: 'income' | 'expense' = 'expense'): string {
  const safeCurrency = SUPPORTED_CURRENCIES.includes(currency as (typeof SUPPORTED_CURRENCIES)[number])
    ? currency
    : DEFAULT_CURRENCY;

  const normalizedAmount = Number(amount) || 0;
  const formatted = normalizedAmount.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  const symbol = currencySymbols[safeCurrency] ?? 'R$';
  const sign = type === 'income' ? '+' : '-';

  return `${sign} ${symbol} ${formatted}`;
}

export function formatDatePtBr(date: string): string {
  const [year, month, day] = date.split('-');
  if (!year || !month || !day) {
    return date;
  }

  return `${day}/${month}/${year}`;
}

export function getCategoryName(categoryId: string, categories: ExpenseCategory[]): string {
  return categories.find((category) => category.id === categoryId)?.name ?? 'Outros';
}

export function toExpenseListEntry(expense: Expense, categories: ExpenseCategory[]): ExpenseListEntry {
  return {
    id: expense.id,
    description: expense.description,
    date: expense.date,
    categoryName: getCategoryName(expense.categoryId, categories),
    amount: expense.amount,
    amountLabel: formatCurrency(expense.amount, expense.currency, expense.type),
    currency: expense.currency,
    type: expense.type
  };
}

export function toExpenseDetail(expense: Expense, categories: ExpenseCategory[]): ExpenseDetailEntry {
  return {
    id: expense.id,
    description: expense.description,
    amount: expense.amount,
    amountLabel: formatCurrency(expense.amount, expense.currency),
    currency: expense.currency,
    currencyLabel: expense.currency,
    date: expense.date,
    categoryName: getCategoryName(expense.categoryId, categories)
  };
}
