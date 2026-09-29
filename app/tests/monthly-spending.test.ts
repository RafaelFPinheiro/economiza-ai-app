import assert from 'node:assert/strict';
import test from 'node:test';

import { getMonthlySpendingResponse } from '../src/services/mocked/monthlySpendingService.ts';

test('monthly spending exposes the full account-activity list with balanced income and expense entries', async () => {
  const response = await getMonthlySpendingResponse('2026-09');

  assert.ok(Array.isArray(response.transactions));
  assert.ok(response.transactions.length > 0);
  assert.ok(response.transactions.some((item) => item.type === 'income' && item.amount > 0));
  assert.ok(response.transactions.some((item) => item.type === 'expense' && item.amount < 0));
});

test('monthly spending keeps the transaction list as account activity instead of a spend-only subset', async () => {
  const response = await getMonthlySpendingResponse('2026-09');

  assert.ok(response.transactions.some((item) => item.description === 'Salário'));
  assert.ok(response.transactions.some((item) => item.description === 'Supermercado'));
  assert.ok(response.transactions.every((item) => item.type === 'income' || item.type === 'expense'));
});
