/**
 * Root query keys, shared so one feature can invalidate another's data (a patient change also
 * changes doctor counts and the dashboard) without importing that feature's internals.
 */
export const QUERY_ROOTS = {
  doctors: ['doctors'],
  patients: ['patients'],
  dashboard: ['dashboard'],
} as const;
