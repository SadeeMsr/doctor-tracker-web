import { Skeleton } from '@/components/ui/skeleton';

import { DoctorBackLink } from './doctor-back-link';

/**
 * The doctor banner while it loads, in the same place and size as the real one. The route's
 * Suspense fallback uses it too, so navigating in shows one skeleton, not two in a row.
 */
export function DoctorProfileSkeleton() {
  return (
    <div className="space-y-3">
      <DoctorBackLink />
      <Skeleton
        className="h-60 rounded-3xl"
        role="status"
        aria-label="Loading doctor"
        aria-hidden={false}
      />
    </div>
  );
}
