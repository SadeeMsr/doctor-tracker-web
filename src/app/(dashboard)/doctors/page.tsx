import type { Metadata } from 'next';
import { Suspense } from 'react';

import { TableSkeleton } from '@/components/data-table/table-skeleton';
import { DoctorsView } from '@/features/doctors/components/doctors-view';

export const metadata: Metadata = { title: 'Doctors' };

export default function DoctorsPage() {
  return (
    // Filters live in the URL and are read on the client, so the shell can prerender.
    <Suspense fallback={<TableSkeleton label="Loading doctors" />}>
      <DoctorsView />
    </Suspense>
  );
}
