import { Plus } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';

import { ListSkeleton } from '@/components/data-table/list-skeleton';
import { PageHeader } from '@/components/feedback/page-header';
import { buttonStyles } from '@/components/ui/button';
import { DoctorsView } from '@/features/doctors/components/doctors-view';
import { AddPatientFromUrl } from '@/features/patients/components/add-patient-from-url';
import { ariaKeyShortcut, SHORTCUTS } from '@/lib/shortcuts';

export const metadata: Metadata = { title: 'Doctors' };

export default function DoctorsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Directory"
        title="Doctors"
        description="Everyone on the roster. Open a doctor to see and manage their patients."
        actions={
          // Opens the add form via `?new=true`, so the header renders on the server.
          <Link
            href={{ pathname: '/doctors', query: { new: 'true' } }}
            title="Add doctor (N)"
            aria-keyshortcuts={ariaKeyShortcut(SHORTCUTS.create)}
            className={buttonStyles()}
          >
            <Plus aria-hidden />
            Add doctor
          </Link>
        }
      />
      {/* Filters live in the URL and are read on the client, so the shell can prerender. */}
      <Suspense fallback={<ListSkeleton label="Loading doctors" className="space-y-6" />}>
        <DoctorsView />
        <AddPatientFromUrl />
      </Suspense>
    </div>
  );
}
