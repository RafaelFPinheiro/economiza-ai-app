import { useEffect, useState } from 'react';

import { getExpenseCategories, listExpenses } from '../../../services/mocked/expenseService';
import type { ExpenseCategory, ExpenseListState } from '../types';
import { getExpenseListState } from '../state';

export function useExpenses() {
  const [state, setState] = useState<ExpenseListState>({ status: 'loading', items: [] });
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const categoriesResponse = await getExpenseCategories();
        if (!isMounted) {
          return;
        }

        setCategories(categoriesResponse);

        const response = await listExpenses();
        if (!isMounted) {
          return;
        }

        setState(getExpenseListState(response, categoriesResponse));
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setState({
          status: 'error',
          items: [],
          message: 'Não foi possível carregar as despesas no momento.'
        });
      }
    }

    setState({ status: 'loading', items: [] });
    load();

    return () => {
      isMounted = false;
    };
  }, []);

  return { state, categories };
}

export function getExpenseListStateForTest(data: { status: 'ok' | 'empty' | 'error'; expenses?: Array<{ id: string; description: string; amount: number; currency: string; date: string; categoryId: string }>; message?: string }, categories: ExpenseCategory[]) {
  return getExpenseListState(data, categories);
}
