'use client';

import { parseAsStringLiteral, useQueryState } from 'nuqs';

import { INTERVALS, type Interval } from '../types';

/** The chart interval lives in the URL, so a view of the dashboard can be shared. */
export function useDashboardInterval() {
  const [interval, setIntervalParam] = useQueryState(
    'interval',
    parseAsStringLiteral(INTERVALS).withDefault('month'),
  );
  return [interval, (next: Interval) => void setIntervalParam(next)] as const;
}
