import { Skeleton } from '@/components/ui/skeleton';

const ROW_KEYS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const;

function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 border-t px-5 py-4 first:border-t-0">
      <Skeleton className="size-10 shrink-0 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3.5 w-2/5" />
        <Skeleton className="h-3 w-1/4" />
      </div>
      <Skeleton className="hidden h-6 w-24 rounded-full sm:block" />
      <Skeleton className="hidden h-3.5 w-20 md:block" />
    </div>
  );
}

/**
 * Stands in for a `DataTable` while its first page loads.
 * @example <TableSkeleton label="Loading doctors" />
 */
export function TableSkeleton({ label }: { label: string }) {
  return (
    <div role="status" aria-label={label} className="rounded-3xl bg-surface ring-1 ring-border">
      {ROW_KEYS.map((key) => (
        <SkeletonRow key={key} />
      ))}
    </div>
  );
}
