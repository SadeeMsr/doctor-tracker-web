import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';

import { TableSkeleton } from '@/components/data-table/table-skeleton';
import { PageHeader } from '@/components/feedback/page-header';
import { buttonStyles } from '@/components/ui/button';
import { PatientsView } from '@/features/patients/components/patients-view';

export const metadata: Metadata = { title: 'Patients' };

export default function PatientsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Records"
        title="Patients"
        description="Every patient across all doctors. Search, filter, edit or remove a record."
      />
      {/* Filters live in the URL and are read on the client, so the shell can prerender. */}
      <Suspense fallback={<TableSkeleton label="Loading patients" />}>
        <PatientsView
          emptyAction={
            <Link href="/doctors" className={buttonStyles()}>
              Go to doctors
            </Link>
          }
        />
      </Suspense>
    </div>
  );
}
