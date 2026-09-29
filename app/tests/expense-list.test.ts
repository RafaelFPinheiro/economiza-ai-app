import test from 'node:test';
import assert from 'node:assert/strict';

import { formatCurrency, toExpenseListEntry } from '../src/features/expenses/utils/formatters.ts';
import { getExpenseListState } from '../src/features/expenses/state.ts';
import { getExpenseCategories, listExpenses } from '../src/services/mocked/expenseService.ts';

const BRL_EXPENSE = {
  id: 'exp-1',
  description: 'Mercado',
  amount: 284.9,
  currency: 'BRL',
  date: '2026-09-15',
  categoryId: 'alimentacao'
};

test('list view keeps empty state distinct from service failures', async () => {
  const categories = await getExpenseCategories();
  const emptyState = getExpenseListState({ status: 'empty', expenses: [] }, categories);
  assert.equal(emptyState.status, 'empty');
  assert.equal(emptyState.items.length, 0);

  const serviceFailure = getExpenseListState({ status: 'error', message: 'Serviço indisponível' }, categories);
  assert.equal(serviceFailure.status, 'error');
  assert.match(serviceFailure.message ?? '', /Serviço/);
});

test('list entries format currency and category labels in PT-BR', async () => {
  const categories = await getExpenseCategories();
  const items = [toExpenseListEntry(BRL_EXPENSE, categories)];

  assert.equal(items[0].categoryName, 'Alimentação');
  assert.equal(items[0].amountLabel, '- R$ 284,90');
  assert.equal(formatCurrency(284.9, 'BRL'), '- R$ 284,90');
  assert.equal(formatCurrency(42.5, 'USD', 'income'), '+ US$ 42,50');
  assert.equal(formatCurrency(42.5, 'EUR', 'expense'), '- € 42,50');

  const listResponse = await listExpenses();
  assert.ok(Array.isArray(listResponse.expenses));
});
