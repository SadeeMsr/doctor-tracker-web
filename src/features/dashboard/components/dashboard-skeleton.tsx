import { Skeleton } from '@/components/ui/skeleton';

/** Same bento footprint as the loaded dashboard, so nothing jumps when data arrives. */
export function DashboardSkeleton() {
  return (
    <div role="status" aria-label="Loading dashboard" className="grid gap-4 xl:grid-cols-12">
      <Skeleton className="h-64 rounded-3xl xl:col-span-6" />
      <Skeleton className="h-64 rounded-3xl xl:col-span-6" />
      <Skeleton className="h-96 rounded-3xl xl:col-span-8" />
      <Skeleton className="h-96 rounded-3xl xl:col-span-4" />
      <Skeleton className="h-80 rounded-3xl xl:col-span-7" />
      <Skeleton className="h-80 rounded-3xl xl:col-span-5" />
    </div>
  );
}
