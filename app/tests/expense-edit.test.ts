import assert from 'node:assert/strict';
import test from 'node:test';

import { createExpense, getExpenseById, updateExpense } from '../src/services/mocked/expenseService.ts';

test('edit expense allows category-only correction without recreating the record', async () => {
  const created = await createExpense({
    description: 'Uber',
    amount: 55,
    currency: 'BRL',
    date: '2026-09-26',
    categoryId: 'lazer'
  });

  const updated = await updateExpense(created.id, { categoryId: 'transporte' });

  assert.ok(updated);
  assert.equal(updated?.id, created.id);
  assert.equal(updated?.categoryId, 'transporte');
  assert.equal(updated?.description, 'Uber');

  const detail = await getExpenseById(created.id);
  assert.equal(detail.status, 'ok');
  assert.equal(detail.expense?.categoryId, 'transporte');
});
