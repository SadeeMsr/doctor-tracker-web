import type { Condition } from '@/lib/conditions';

export const INTERVALS = ['day', 'week', 'month'] as const;
export type Interval = (typeof INTERVALS)[number];

/** Mirrors the API's `presentSummary` exactly. */
export interface DashboardSummary {
  window: { from: string; to: string };
  interval: Interval;
  totals: {
    doctors: number;
    patients: number;
    criticalPatients: number;
    admissions: number;
    previousAdmissions: number;
    /** Percent change vs the previous window; null when there is nothing to compare with. */
    admissionsChange: number | null;
  };
  admissionsOverTime: { periodStart: string; count: number }[];
  conditions: { condition: Condition; count: number }[];
  topDoctors: { doctor: { id: string; name: string; specialization: string }; patients: number }[];
  specializations: { specialization: string; doctors: number; patients: number }[];
}
