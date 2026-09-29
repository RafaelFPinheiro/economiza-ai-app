import assert from 'node:assert/strict';
import test from 'node:test';

import { createExpense, deleteExpense, getExpenseById } from '../src/services/mocked/expenseService.ts';

test('delete expense removes the record after confirmation', async () => {
  const created = await createExpense({
    description: 'Cinema',
    amount: 48,
    currency: 'BRL',
    date: '2026-09-22',
    categoryId: 'lazer'
  });

  const deleted = await deleteExpense(created.id);

  assert.equal(deleted, true);

  const detail = await getExpenseById(created.id);
  assert.equal(detail.status, 'not-found');
});
