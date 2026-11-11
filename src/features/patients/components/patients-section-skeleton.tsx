import { ListSkeleton } from '@/components/data-table/list-skeleton';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * A doctor's patient section while the route resolves: the same heading, add button slot,
 * toolbar and table as `PatientsView` renders on its first paint.
 */
export function PatientsSectionSkeleton() {
  return (
    <section className="space-y-5" aria-label="Patients">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold tracking-tight">Patients</h2>
        <Skeleton className="h-11 w-36 rounded-full" />
      </div>
      <ListSkeleton label="Loading patients" />
    </section>
  );
}
