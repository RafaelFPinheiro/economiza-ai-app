import { useCallback, useState } from 'react';

import { createExpense, deleteExpense, updateExpense } from '../../../services/mocked/expenseService';
import type { ExpenseCurrency } from '../types';

export function useExpenseActions() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = useCallback(async (input: {
    description: string;
    amount: number;
    currency: ExpenseCurrency;
    date: string;
    categoryId: string;
  }) => {
    setIsSubmitting(true);
    try {
      return await createExpense(input);
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const handleUpdate = useCallback(async (id: string, input: Partial<{
    description: string;
    amount: number;
    currency: ExpenseCurrency;
    date: string;
    categoryId: string;
  }>) => {
    setIsSubmitting(true);
    try {
      return await updateExpense(id, input);
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    setIsSubmitting(true);
    try {
      return await deleteExpense(id);
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return { isSubmitting, handleCreate, handleUpdate, handleDelete };
}
