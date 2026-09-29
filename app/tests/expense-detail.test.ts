import test from 'node:test';
import assert from 'node:assert/strict';

import { formatCurrency, toExpenseDetail } from '../src/features/expenses/utils/formatters.ts';
import { getExpenseById, getExpenseCategories } from '../src/services/mocked/expenseService.ts';

const EXPENSE_ID = 'exp-2';

test('detail view keeps the original currency explicitly visible', async () => {
  const categories = await getExpenseCategories();
  const response = await getExpenseById(EXPENSE_ID);

  assert.ok(response.expense);
  const detail = toExpenseDetail(response.expense, categories);

  assert.equal(detail.categoryName, 'Moradia');
  assert.equal(detail.currencyLabel, 'USD');
  assert.equal(detail.amountLabel, '- US$ 1.250,00');
  assert.equal(formatCurrency(1250, 'USD', 'expense'), '- US$ 1.250,00');
});

test('detail view preserves the selected currency and date in PT-BR', async () => {
  const response = await getExpenseById(EXPENSE_ID);
  assert.ok(response.expense);
  assert.equal(response.expense.currency, 'USD');
  assert.equal(response.expense.date, '2026-09-09');
  assert.match(response.expense.description, /aluguel|Aluguel/i);
});
