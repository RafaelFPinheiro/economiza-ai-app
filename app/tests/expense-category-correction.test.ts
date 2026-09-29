import assert from 'node:assert/strict';
import test from 'node:test';

import { createExpense, updateExpense } from '../src/services/mocked/expenseService.ts';

test('category correction updates categoryId without embedding the category name in the record', async () => {
  const created = await createExpense({
    description: 'Plano de celular',
    amount: 89.9,
    currency: 'BRL',
    date: '2026-09-20',
    categoryId: 'contas'
  });

  const updated = await updateExpense(created.id, { categoryId: 'saude' });

  assert.ok(updated);
  assert.equal(updated?.categoryId, 'saude');
  assert.equal(updated?.description, 'Plano de celular');
  assert.notEqual(updated?.categoryId, 'Plano de celular');
});
