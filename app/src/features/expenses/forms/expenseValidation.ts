import { DEFAULT_CURRENCY, SUPPORTED_CURRENCIES } from '../constants';

export type ExpenseValidationErrors = {
  description?: string;
  amount?: string;
  currency?: string;
  date?: string;
  categoryId?: string;
};

export function validateExpenseInput(input: {
  description: string;
  amount: string;
  currency?: string;
  date: string;
  categoryId: string;
}): ExpenseValidationErrors {
  const errors: ExpenseValidationErrors = {};

  if (!input.description || !input.description.trim()) {
    errors.description = 'A descrição é obrigatória.';
  }

  if (!input.amount || Number.isNaN(Number(input.amount))) {
    errors.amount = 'Informe um valor válido.';
  } else if (Number(input.amount) <= 0) {
    errors.amount = 'O valor deve ser maior que zero.';
  }

  const currency = (input.currency ?? DEFAULT_CURRENCY) as string;
  if (!SUPPORTED_CURRENCIES.includes(currency as (typeof SUPPORTED_CURRENCIES)[number])) {
    errors.currency = 'Selecione uma moeda válida.';
  }

  if (!input.date) {
    errors.date = 'Selecione a data do gasto.';
  }

  if (!input.categoryId) {
    errors.categoryId = 'Selecione uma categoria.';
  }

  return errors;
}
