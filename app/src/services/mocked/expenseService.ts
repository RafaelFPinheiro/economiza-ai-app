import type {
  ExpenseCategoryContract,
  ExpenseContract,
  ExpenseDetailContract,
  ExpenseInput,
  ExpenseListContract
} from '../contracts/expenseContract';

export const EXPENSE_CATEGORIES: ExpenseCategoryContract[] = [
  { id: 'alimentacao', name: 'Alimentação' },
  { id: 'moradia', name: 'Moradia' },
  { id: 'transporte', name: 'Transporte' },
  { id: 'contas', name: 'Contas' },
  { id: 'lazer', name: 'Lazer' },
  { id: 'saude', name: 'Saúde' },
  { id: 'outros', name: 'Outros' }
];

const expenseSeed: ExpenseContract[] = [
  {
    id: 'exp-1',
    description: 'Mercado',
    amount: 284.9,
    currency: 'BRL',
    date: '2026-09-15',
    categoryId: 'alimentacao',
    type: 'expense'
  },
  {
    id: 'exp-2',
    description: 'Aluguel',
    amount: 1250,
    currency: 'USD',
    date: '2026-09-09',
    categoryId: 'moradia',
    type: 'expense'
  },
  {
    id: 'exp-3',
    description: 'Transporte',
    amount: 90,
    currency: 'BRL',
    date: '2026-09-11',
    categoryId: 'transporte',
    type: 'expense'
  },
  {
    id: 'exp-4',
    description: 'Streaming',
    amount: 19.9,
    currency: 'EUR',
    date: '2026-09-06',
    categoryId: 'lazer',
    type: 'expense'
  },
  {
    id: 'inc-1',
    description: 'Salário',
    amount: 16400,
    currency: 'BRL',
    date: '2026-09-01',
    categoryId: 'receita',
    type: 'income'
  },
  {
    id: 'inc-2',
    description: 'Freelance',
    amount: 2500,
    currency: 'BRL',
    date: '2026-09-23',
    categoryId: 'receita',
    type: 'income'
  }
];

let expenses: ExpenseContract[] = [...expenseSeed];

export async function listExpenses(): Promise<ExpenseListContract> {
  if (expenses.length === 0) {
    return { expenses: [], status: 'empty' };
  }

  return { expenses: [...expenses], status: 'ok' };
}

export async function getExpenseById(id: string): Promise<ExpenseDetailContract> {
  const expense = expenses.find((item) => item.id === id);

  if (!expense) {
    return { status: 'not-found', message: 'Despesa não encontrada.' };
  }

  return { expense: { ...expense }, status: 'ok' };
}

export async function getExpenseCategories(): Promise<ExpenseCategoryContract[]> {
  return [...EXPENSE_CATEGORIES];
}

export async function createExpense(input: ExpenseInput): Promise<ExpenseContract> {
  const id = `exp-${Date.now()}`;
  const created: ExpenseContract = {
    id,
    description: input.description,
    amount: input.amount,
    currency: input.currency,
    date: input.date,
    categoryId: input.categoryId,
    type: 'expense'
  };

  expenses = [...expenses, created];
  return created;
}

export async function updateExpense(id: string, input: Partial<ExpenseInput>): Promise<ExpenseContract | null> {
  const index = expenses.findIndex((item) => item.id === id);

  if (index === -1) {
    return null;
  }

  const current = expenses[index];
  const updated = {
    ...current,
    ...input,
    amount: input.amount ?? current.amount,
    currency: input.currency ?? current.currency,
    date: input.date ?? current.date,
    categoryId: input.categoryId ?? current.categoryId,
    description: input.description ?? current.description,
    type: 'expense' as const
  };

  expenses = expenses.map((item) => (item.id === id ? updated : item));
  return updated;
}

export async function deleteExpense(id: string): Promise<boolean> {
  const previousLength = expenses.length;
  expenses = expenses.filter((item) => item.id !== id);
  return previousLength !== expenses.length;
}
