import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/cn';

const PILL_WIDTHS = ['w-36', 'w-28', 'w-36', 'w-40', 'w-32'] as const;

/**
 * Stands in for a list toolbar (search box plus filter pills) with the same sizes and wrapping,
 * so nothing moves when the real toolbar mounts.
 * @example <ToolbarSkeleton pills={4} />
 */
export function ToolbarSkeleton({ pills = 4 }: { pills?: number }) {
  return (
    <div aria-hidden className="flex flex-col gap-3 xl:flex-row xl:items-center">
      <Skeleton className="h-11 w-full rounded-2xl xl:w-80" />
      <div className="flex flex-wrap items-center gap-2">
        {PILL_WIDTHS.slice(0, pills).map((width) => (
          <Skeleton key={width + String(pills)} className={cn('h-10 rounded-full', width)} />
        ))}
      </div>
    </div>
  );
}
