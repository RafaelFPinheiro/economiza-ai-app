import assert from 'node:assert/strict';
import test from 'node:test';

import { validateExpenseInput } from '../src/features/expenses/forms/expenseValidation.ts';
import { createExpense, listExpenses } from '../src/services/mocked/expenseService.ts';

test('create expense defaults to BRL and persists the expense transaction type', async () => {
  const created = await createExpense({
    description: 'Padaria',
    amount: 32.5,
    currency: 'BRL',
    date: '2026-09-27',
    categoryId: 'alimentacao'
  });

  assert.equal(created.currency, 'BRL');
  assert.equal(created.type, 'expense');
  assert.equal(created.categoryId, 'alimentacao');

  const list = await listExpenses();
  assert.ok(list.expenses.some((item) => item.id === created.id));
});

test('create expense validation rejects missing values before save', () => {
  const errors = validateExpenseInput({
    description: '',
    amount: '',
    currency: 'BRL',
    date: '',
    categoryId: ''
  });

  assert.match(errors.description ?? '', /obrigatória/i);
  assert.match(errors.amount ?? '', /válido|maior/i);
  assert.match(errors.date ?? '', /data/i);
  assert.match(errors.categoryId ?? '', /categoria/i);
});
