export type {
  CategorySummary,
  ComparisonDirection,
  MonthlySpendingResponse,
  TransactionSummary
} from '../../services/contracts/monthlySpendingContract';

import type { MonthlySpendingResponse as ContractMonthlySpendingResponse } from '../../services/contracts/monthlySpendingContract';

export type MonthlySpendingState = {
  status: 'loading' | 'ok' | 'empty' | 'error';
  data?: ContractMonthlySpendingResponse;
  errorMessage?: string;
};
