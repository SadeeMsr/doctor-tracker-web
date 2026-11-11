import type { TreemapItem } from '@/components/charts/treemap-chart';

import type { DashboardSummary } from '../types';

/** Named tiles; the rest share one "Other" tile so small departments stay readable. */
const NAMED_TILES = 7;

const doctorsHint = (count: number) => `${String(count)} ${count === 1 ? 'doctor' : 'doctors'}`;

/** Specializations with patients, largest first, folded into at most eight tiles. */
export function toSpecializationTiles(
  specializations: DashboardSummary['specializations'],
): TreemapItem[] {
  const ranked = specializations
    .filter((row) => row.patients > 0)
    .sort((a, b) => b.patients - a.patients);
  const named = ranked.slice(0, NAMED_TILES).map((row) => ({
    id: row.specialization,
    label: row.specialization,
    value: row.patients,
    hint: doctorsHint(row.doctors),
  }));
  const rest = ranked.slice(NAMED_TILES);
  if (rest.length === 0) return named;

  return [
    ...named,
    {
      id: null,
      label: 'Other',
      value: rest.reduce((sum, row) => sum + row.patients, 0),
      hint: `${String(rest.length)} more specializations`,
    },
  ];
}
