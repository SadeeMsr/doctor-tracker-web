'use client';

import { Plus, Stethoscope } from 'lucide-react';
import Link from 'next/link';

import { EmptyState } from '@/components/feedback/empty-state';
import { ErrorState } from '@/components/feedback/error-state';
import { PageHeader } from '@/components/feedback/page-header';
import { buttonStyles } from '@/components/ui/button';
import { getErrorMessage, getErrorReference } from '@/lib/errors';

import { useDashboardInterval } from '../hooks/use-dashboard-interval';
import { useDashboardSummary } from '../queries';

import { DashboardGrid } from './dashboard-grid';
import { DashboardSkeleton } from './dashboard-skeleton';

/** Opens the doctors page with the "Add a doctor" dialog already showing. */
function AddDoctorLink() {
  return (
    <Link href={{ pathname: '/doctors', query: { new: 'true' } }} className={buttonStyles()}>
      <Plus aria-hidden />
      Add doctor
    </Link>
  );
}

function DashboardContent() {
  const [interval, setInterval] = useDashboardInterval();
  const query = useDashboardSummary(interval);

  if (!query.data) {
    return query.isError ? (
      <ErrorState
        description={getErrorMessage(query.error)}
        reference={getErrorReference(query.error)}
        onRetry={() => void query.refetch()}
      />
    ) : (
      <DashboardSkeleton />
    );
  }
  if (query.data.totals.doctors === 0) {
    return (
      <EmptyState
        icon={<Stethoscope aria-hidden />}
        title="Nothing to chart yet"
        description="Add a doctor, then their patients. Totals and trends appear here as you go."
        action={<AddDoctorLink />}
      />
    );
  }
  return (
    <DashboardGrid
      summary={query.data}
      onIntervalChange={setInterval}
      isStale={query.isPlaceholderData}
    />
  );
}

/** The dashboard page: header plus the analytics grid in whichever state it is in. */
export function DashboardView() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Overview"
        title="Dashboard"
        description="The roster, the caseload and how admissions are moving."
        actions={<AddDoctorLink />}
      />
      <DashboardContent />
    </div>
  );
}
