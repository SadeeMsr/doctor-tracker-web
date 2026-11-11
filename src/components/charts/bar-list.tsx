import type { ReactNode } from 'react';

import { formatNumber } from '@/lib/format';

export interface BarListItem {
  id: string;
  label: string;
  value: number;
  /** Secondary text after the label. */
  hint?: string;
}

interface BarListProps<TItem extends BarListItem> {
  items: TItem[];
  /** Replaces the plain label, e.g. with a link to the item's page. */
  renderLabel?: (item: TItem) => ReactNode;
}

function BarRow({ item, max, label }: { item: BarListItem; max: number; label: ReactNode }) {
  const width = `${String(Math.max(2, (item.value / max) * 100))}%`;
  return (
    <li className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className="min-w-0 truncate font-medium">
          {label}
          {item.hint && (
            <span className="ml-2 text-xs font-normal text-muted-foreground">{item.hint}</span>
          )}
        </span>
        <span className="font-semibold tabular-nums">{formatNumber(item.value)}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-canvas-soft">
        {/* Width is data: the one place an inline style is the right tool. */}
        <div className="h-full rounded-full bg-brand" style={{ width }} />
      </div>
    </li>
  );
}

/**
 * Ranked horizontal bars: readable at any width, labels never truncate into an axis.
 * @example <BarList items={[{ id: '1', label: 'Dr. Rahman', value: 42 }]} />
 */
export function BarList<TItem extends BarListItem>({ items, renderLabel }: BarListProps<TItem>) {
  const max = Math.max(...items.map((item) => item.value), 1);
  return (
    <ul className="space-y-4">
      {items.map((item) => (
        <BarRow key={item.id} item={item} max={max} label={renderLabel?.(item) ?? item.label} />
      ))}
    </ul>
  );
}
