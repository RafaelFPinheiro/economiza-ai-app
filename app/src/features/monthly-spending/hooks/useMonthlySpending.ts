import { useEffect, useState } from 'react';

import { getMonthlySpendingResponse } from '../../../services/mocked/monthlySpendingService';
import type { MonthlySpendingResponse, MonthlySpendingState } from '../types';

export function useMonthlySpending(month: string) {
  const [state, setState] = useState<MonthlySpendingState>({ status: 'loading' });

  useEffect(() => {
    let isMounted = true;

    setState({ status: 'loading' });

    getMonthlySpendingResponse(month)
      .then((data: MonthlySpendingResponse) => {
        if (!isMounted) {
          return;
        }

        setState({
          status: data.status === 'ok' ? 'ok' : data.status,
          data,
          errorMessage: data.status === 'error' ? 'Unable to load monthly spending data.' : undefined
        });
      })
      .catch(() => {
        if (!isMounted) {
          return;
        }

        setState({
          status: 'error',
          errorMessage: 'Unable to load monthly spending data.'
        });
      });

    return () => {
      isMounted = false;
    };
  }, [month]);

  return state;
}
