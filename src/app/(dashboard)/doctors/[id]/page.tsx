import type { Metadata } from 'next';
import { Suspense } from 'react';

import { TableSkeleton } from '@/components/data-table/table-skeleton';
import { DoctorProfile } from '@/features/doctors/components/doctor-profile';
import { PatientsView } from '@/features/patients/components/patients-view';

export const metadata: Metadata = { title: 'Doctor' };

async function DoctorDetail({ params }: Pick<PageProps<'/doctors/[id]'>, 'params'>) {
  const { id } = await params;
  return (
    <div className="space-y-8">
      <DoctorProfile id={id} />
      <PatientsView doctorId={id} />
    </div>
  );
}

export default function DoctorPage({ params }: PageProps<'/doctors/[id]'>) {
  return (
    // `params` is request-time data: it has to resolve inside a Suspense boundary.
    <Suspense fallback={<TableSkeleton label="Loading doctor" />}>
      <DoctorDetail params={params} />
    </Suspense>
  );
}
