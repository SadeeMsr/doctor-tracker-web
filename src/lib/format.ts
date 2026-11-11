import { format, isValid, parseISO } from 'date-fns';

const numberFormat = new Intl.NumberFormat('en');

export const formatNumber = (value: number): string => numberFormat.format(value);

/** `12 Nov 2026`, in the viewer's time zone. */
export const formatDate = (iso: string): string => format(parseISO(iso), 'd MMM yyyy');

/** Value for `<input type="date">`, in the viewer's time zone. */
export const toDateInput = (date: Date | string): string =>
  format(typeof date === 'string' ? parseISO(date) : date, 'yyyy-MM-dd');

const DATE_INPUT = /^\d{4}-\d{2}-\d{2}$/;

/** True for a real `YYYY-MM-DD` date; guards values that came from the URL. */
export const isDateInput = (value: string): boolean =>
  DATE_INPUT.test(value) && isValid(parseISO(value));

/**
 * A picked calendar day as an instant: local noon, so it stays on the same day in any nearby
 * time zone, but never later than now (the API rejects future dates).
 */
export function dateInputToIso(value: string): string {
  const noon = parseISO(`${value}T12:00:00`);
  return new Date(Math.min(noon.getTime(), Date.now())).toISOString();
}

/** Up to two initials: "Dr. Ayesha Rahman" → "AR". */
export function initials(name: string): string {
  const words = name
    .replace(/^dr\.?\s+/i, '')
    .split(/\s+/)
    .filter(Boolean);
  const first = words[0]?.[0] ?? '';
  const last = words.length > 1 ? (words[words.length - 1]?.[0] ?? '') : '';
  return (first + last).toUpperCase();
}
