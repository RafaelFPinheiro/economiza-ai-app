import type { ExpenseListState } from './types';

export const initialExpenseListState: ExpenseListState = {
  status: 'loading',
  items: []
};

export function getExpenseListState(
  data: { status: 'ok' | 'empty' | 'error'; expenses?: Array<{ id: string; description: string; amount: number; currency: string; date: string; categoryId: string; type?: 'income' | 'expense' }>; message?: string },
  categories: Array<{ id: string; name: string }>
): ExpenseListState {
  if (data.status === 'error') {
    return {
      status: 'error',
      items: [],
      message: data.message ?? 'Não foi possível carregar as transações.'
    };
  }

  if (data.status === 'empty' || !data.expenses || data.expenses.length === 0) {
    return {
      status: 'empty',
      items: [],
      message: 'Nenhuma transação cadastrada.'
    };
  }

  return {
    status: 'ok',
    items: data.expenses.map((expense) => {
      const type = expense.type ?? 'expense';
      const sign = type === 'income' ? '+' : '-';
      const currencyLabel = expense.currency === 'BRL' ? 'R$' : expense.currency === 'USD' ? 'US$' : '€';
      const categoryName = categories.find((category) => category.id === expense.categoryId)?.name ?? (type === 'income' ? 'Receita' : 'Outros');

      return {
        id: expense.id,
        description: expense.description,
        date: expense.date,
        categoryName,
        amount: expense.amount,
        amountLabel: `${sign} ${currencyLabel} ${Number(expense.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        currency: expense.currency as 'BRL' | 'USD' | 'EUR',
        type
      };
    })
  };
}
