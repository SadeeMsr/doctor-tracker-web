import { formatNumber } from '@/lib/format';

interface ResultCountProps {
  total: number;
  /** Singular and plural nouns: ['doctor', 'doctors']. */
  noun: readonly [string, string];
  isFiltered: boolean;
}

/**
 * How many records the current view holds, above the table: "132 doctors" or, with filters on,
 * "4 doctors match". Announced politely as filters change.
 * @example <ResultCount total={meta.total} noun={['doctor', 'doctors']} isFiltered={state.hasFilters} />
 */
export function ResultCount({ total, noun, isFiltered }: ResultCountProps) {
  const word = total === 1 ? noun[0] : noun[1];

  return (
    <p aria-live="polite" className="text-sm text-muted-foreground">
      <span className="font-semibold text-foreground tabular-nums">{formatNumber(total)}</span>{' '}
      {word}
      {isFiltered && (total === 1 ? ' matches your filters' : ' match your filters')}
    </p>
  );
}
