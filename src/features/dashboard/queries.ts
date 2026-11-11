import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { QUERY_ROOTS } from '@/lib/query-keys';

import { dashboardApi } from './api';
import type { Interval } from './types';

export const dashboardKeys = {
  all: QUERY_ROOTS.dashboard,
  summary: (interval: Interval) => [...dashboardKeys.all, 'summary', interval] as const,
};

export function useDashboardSummary(interval: Interval) {
  return useQuery({
    queryKey: dashboardKeys.summary(interval),
    queryFn: async ({ signal }) => (await dashboardApi.summary(interval, signal)).data,
    // Switching interval keeps the old charts on screen until the new ones arrive.
    placeholderData: keepPreviousData,
  });
}
