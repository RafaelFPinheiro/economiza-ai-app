import type { MonthlySpendingResponse } from '../contracts/monthlySpendingContract';

export const availableMonths = ['2026-07', '2026-08', '2026-09'];

const defaultResponse: MonthlySpendingResponse = {
  month: '2026-09',
  totalSpending: 2860.5,
  previousMonthTotal: 2490.25,
  comparisonDifference: 370.25,
  comparisonDirection: 'increase',
  categories: [
    { category: 'Moradia', amount: 1120, shareOfTotal: 39.2 },
    { category: 'Alimentação', amount: 640, shareOfTotal: 22.4 },
    { category: 'Transporte', amount: 420, shareOfTotal: 14.7 },
    { category: 'Utilidades', amount: 300, shareOfTotal: 10.5 },
    { category: 'Lazer', amount: 260, shareOfTotal: 9.1 },
    { category: 'Outros', amount: 120.5, shareOfTotal: 4.2 }
  ],
  transactions: [
    { id: 'tx-1', date: '2026-09-12', description: 'Aluguel', amount: -1120, category: 'Moradia' },
    { id: 'tx-2', date: '2026-09-18', description: 'Mercado', amount: -240, category: 'Alimentação' },
    { id: 'tx-3', date: '2026-09-07', description: 'Combustível', amount: -180, category: 'Transporte' },
    { id: 'tx-4', date: '2026-09-14', description: 'Streaming + apps', amount: -42.5, category: 'Lazer' },
    { id: 'tx-5', date: '2026-09-23', description: 'Energia', amount: -95, category: 'Utilidades' }
  ],
  status: 'ok'
};

export async function getMonthlySpendingResponse(month: string): Promise<MonthlySpendingResponse> {
  if (month === '2026-07') {
    return {
      month: '2026-07',
      totalSpending: 1820.35,
      previousMonthTotal: 0,
      comparisonDifference: 0,
      comparisonDirection: 'no-change',
      categories: [
        { category: 'Moradia', amount: 980, shareOfTotal: 53.8 },
        { category: 'Alimentação', amount: 430, shareOfTotal: 23.6 },
        { category: 'Transporte', amount: 210, shareOfTotal: 11.5 },
        { category: 'Utilidades', amount: 130, shareOfTotal: 7.1 },
        { category: 'Outros', amount: 70.35, shareOfTotal: 3.9 }
      ],
      transactions: [
        { id: 'tx-6', date: '2026-07-08', description: 'Aluguel', amount: -980, category: 'Moradia' },
        { id: 'tx-7', date: '2026-07-15', description: 'Mercado', amount: -220, category: 'Alimentação' },
        { id: 'tx-8', date: '2026-07-20', description: 'Combustível', amount: -110, category: 'Transporte' }
      ],
      status: 'ok'
    };
  }

  if (month === '2026-08') {
    return {
      month: '2026-08',
      totalSpending: 0,
      previousMonthTotal: 1820.35,
      comparisonDifference: 0,
      comparisonDirection: 'no-change',
      categories: [],
      transactions: [],
      status: 'empty'
    };
  }

  if (month === '2026-09') {
    return defaultResponse;
  }

  return {
    month,
    totalSpending: 0,
    previousMonthTotal: 0,
    comparisonDifference: 0,
    comparisonDirection: 'no-change',
    categories: [],
    transactions: [],
    status: 'empty'
  };
}
