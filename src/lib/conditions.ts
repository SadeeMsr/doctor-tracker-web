/**
 * Patient conditions, shared by the patients feature (badges, filters, forms) and the dashboard
 * (charts). Must match the API's `PATIENT_CONDITIONS`. Ordered from most to least urgent.
 */
export const CONDITIONS = [
  'critical',
  'under-observation',
  'stable',
  'recovering',
  'discharged',
] as const;

export type Condition = (typeof CONDITIONS)[number];

/** Wording, badge tone and chart colour for each condition, in one place. */
export const CONDITION_META = {
  critical: { label: 'Critical', tone: 'critical', color: 'var(--status-critical)' },
  'under-observation': {
    label: 'Under observation',
    tone: 'observation',
    color: 'var(--status-observation)',
  },
  stable: { label: 'Stable', tone: 'stable', color: 'var(--status-stable)' },
  recovering: { label: 'Recovering', tone: 'recovering', color: 'var(--status-recovering)' },
  discharged: { label: 'Discharged', tone: 'discharged', color: 'var(--status-discharged)' },
} as const satisfies Record<Condition, { label: string; tone: string; color: string }>;
