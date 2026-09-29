import { useMemo, useState } from 'react';

import type { Expense, ExpenseCategory, ExpenseCurrency, ExpenseForm } from '../types';
import { DEFAULT_CURRENCY } from '../constants';
import { validateExpenseInput } from '../forms/expenseValidation';

export function useExpenseForm(initialExpense?: Partial<Expense>, categories: ExpenseCategory[] = []) {
  const defaultForm: ExpenseForm = useMemo(() => ({
    description: initialExpense?.description ?? '',
    amount: initialExpense ? String(initialExpense.amount ?? '') : '',
    currency: initialExpense?.currency ?? DEFAULT_CURRENCY,
    date: initialExpense?.date ?? '',
    categoryId: initialExpense?.categoryId ?? categories[0]?.id ?? ''
  }), [categories, initialExpense]);

  const [values, setValues] = useState<ExpenseForm>(defaultForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = <K extends keyof ExpenseForm>(field: K, value: ExpenseForm[K]) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: '' }));
  };

  const reset = (nextValues?: Partial<ExpenseForm>) => {
    setValues({
      description: nextValues?.description ?? '',
      amount: nextValues?.amount ?? '',
      currency: (nextValues?.currency ?? DEFAULT_CURRENCY) as ExpenseCurrency,
      date: nextValues?.date ?? '',
      categoryId: nextValues?.categoryId ?? categories[0]?.id ?? ''
    });
    setErrors({});
  };

  const submit = (onSubmit: (payload: { description: string; amount: number; currency: ExpenseCurrency; date: string; categoryId: string }) => void | Promise<void>) => {
    const nextErrors = validateExpenseInput(values);
    setErrors(nextErrors as Record<string, string>);

    if (Object.keys(nextErrors).length > 0) {
      return false;
    }

    const payload = {
      description: values.description.trim(),
      amount: Number(values.amount),
      currency: values.currency,
      date: values.date,
      categoryId: values.categoryId
    };

    void Promise.resolve(onSubmit(payload));
    return true;
  };

  return { values, errors, updateField, submit, reset };
}
