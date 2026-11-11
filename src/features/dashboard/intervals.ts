import { format, parseISO } from 'date-fns';

import type { Interval } from './types';

/** Wording for each interval; the windows match the API's defaults. */
export const INTERVAL_META = {
  day: { label: 'Daily', window: 'last 30 days', per: 'per day', axis: 'd MMM' },
  week: { label: 'Weekly', window: 'last 12 weeks', per: 'per week', axis: 'd MMM' },
  month: { label: 'Monthly', window: 'last 12 months', per: 'per month', axis: 'MMM yy' },
} as const satisfies Record<Interval, { label: string; window: string; per: string; axis: string }>;

export const INTERVAL_OPTIONS = [
  { value: 'day', label: INTERVAL_META.day.label },
  { value: 'week', label: INTERVAL_META.week.label },
  { value: 'month', label: INTERVAL_META.month.label },
] as const;

/**
 * Axis label for a bucket. Buckets start at UTC midnight; reading only the date part keeps the
 * label on the right day in every time zone.
 */
export function bucketLabel(periodStart: string, interval: Interval): string {
  return format(parseISO(periodStart.slice(0, 10)), INTERVAL_META[interval].axis);
}
