import { Plus } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';

import { ListSkeleton } from '@/components/data-table/list-skeleton';
import { PageHeader } from '@/components/feedback/page-header';
import { buttonStyles } from '@/components/ui/button';
import { PatientsView } from '@/features/patients/components/patients-view';
import { ariaKeyShortcut, SHORTCUTS } from '@/lib/shortcuts';

export const metadata: Metadata = { title: 'Patients' };

export default function PatientsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Records"
        title="Patients"
        description="Every patient across all doctors. Search, filter, edit or remove a record."
        actions={
          // Opens the add form via `?new=true`, so the page itself stays a Server Component.
          <Link
            href={{ pathname: '/patients', query: { new: 'true' } }}
            title="Add patient (N)"
            aria-keyshortcuts={ariaKeyShortcut(SHORTCUTS.create)}
            className={buttonStyles()}
          >
            <Plus aria-hidden />
            Add patient
          </Link>
        }
      />
      {/* Filters live in the URL and are read on the client, so the shell can prerender. */}
      <Suspense fallback={<ListSkeleton label="Loading patients" />}>
        <PatientsView />
      </Suspense>
    </div>
  );
}
