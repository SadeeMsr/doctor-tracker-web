import type { Metadata } from 'next';
import { Suspense } from 'react';

import { DashboardSkeleton } from '@/features/dashboard/components/dashboard-skeleton';
import { DashboardView } from '@/features/dashboard/components/dashboard-view';

export const metadata: Metadata = { title: 'Dashboard' };

export default function DashboardPage() {
  return (
    // URL state (the chart interval) is read on the client, so the shell can prerender.
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardView />
    </Suspense>
  );
}
