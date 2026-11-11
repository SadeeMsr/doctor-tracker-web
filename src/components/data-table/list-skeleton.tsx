import { ToolbarSkeleton } from '@/components/filters/toolbar-skeleton';
import { cn } from '@/lib/cn';

import { TableSkeleton } from './table-skeleton';

interface ListSkeletonProps {
  /** Announced to screen readers while the list loads. */
  label: string;
  /** Match the gap of the list it stands in for, e.g. `space-y-6`. */
  className?: string;
}

/**
 * A route-level fallback for a filtered list: toolbar, then table. It mirrors the list's own first
 * paint, so the page doesn't jump from one skeleton to another as it loads.
 * @example <Suspense fallback={<ListSkeleton label="Loading patients" />}>…</Suspense>
 */
export function ListSkeleton({ label, className }: ListSkeletonProps) {
  return (
    <div className={cn('space-y-5', className)}>
      <ToolbarSkeleton />
      <TableSkeleton label={label} />
    </div>
  );
}
