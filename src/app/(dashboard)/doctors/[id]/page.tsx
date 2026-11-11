import type { Metadata } from 'next';
import { Suspense } from 'react';

import { DoctorProfile } from '@/features/doctors/components/doctor-profile';
import { DoctorProfileSkeleton } from '@/features/doctors/components/doctor-profile-skeleton';
import { PatientsSectionSkeleton } from '@/features/patients/components/patients-section-skeleton';
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

/** Same layout as the loading states inside, so there's one skeleton, never two in a row. */
function DoctorDetailFallback() {
  return (
    <div className="space-y-8">
      <DoctorProfileSkeleton />
      <PatientsSectionSkeleton />
    </div>
  );
}

export default function DoctorPage({ params }: PageProps<'/doctors/[id]'>) {
  return (
    // `params` is request-time data: it has to resolve inside a Suspense boundary.
    <Suspense fallback={<DoctorDetailFallback />}>
      <DoctorDetail params={params} />
    </Suspense>
  );
}
