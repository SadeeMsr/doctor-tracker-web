import { describe, expect, it } from 'vitest';

import type { DashboardSummary } from '../types';

import { toSpecializationTiles } from './specialization-tiles';

type Row = DashboardSummary['specializations'][number];
const row = (specialization: string, patients: number, doctors = 1) =>
  ({ specialization, patients, doctors }) as Row;

/** The "patients by specialization" treemap: readable however many departments exist. */
describe('toSpecializationTiles', () => {
  it('ranks departments by patients and drops the empty ones', () => {
    const tiles = toSpecializationTiles([
      row('Urology', 2),
      row('Cardiology', 9, 3),
      row('Oncology', 0),
    ]);

    expect(tiles.map((tile) => tile.label)).toEqual(['Cardiology', 'Urology']);
    expect(tiles[0]?.hint).toBe('3 doctors');
  });

  it('folds everything after the seventh into one "Other" tile with the summed count', () => {
    const rows = Array.from({ length: 10 }, (_, i) => row(`Dept ${String(i)}`, 20 - i));

    const tiles = toSpecializationTiles(rows);

    expect(tiles).toHaveLength(8);
    expect(tiles.at(-1)).toMatchObject({ id: null, label: 'Other', value: 13 + 12 + 11 });
    expect(tiles.at(-1)?.hint).toBe('3 more specializations');
  });
});
