import { api } from '@/lib/api-client';
import type { Single } from '@/lib/types';

import type { DashboardSummary, Interval } from './types';

export const dashboardApi = {
  /** One request loads the whole dashboard; the API picks a sensible window per interval. */
  summary: (interval: Interval, signal: AbortSignal) =>
    api.get<Single<DashboardSummary>>('/analytics/summary', { interval }, { signal }),
};
