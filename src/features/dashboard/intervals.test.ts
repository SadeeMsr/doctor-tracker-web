import { describe, expect, it } from 'vitest';

import { bucketLabel } from './intervals';

/** Chart axis labels: a UTC bucket must land on the same calendar day in every time zone. */
describe('bucketLabel', () => {
  it('labels days and months from the date part only', () => {
    expect(bucketLabel('2026-11-09T00:00:00.000Z', 'day')).toBe('9 Nov');
    expect(bucketLabel('2026-11-01T00:00:00.000Z', 'month')).toBe('Nov 26');
  });
});
