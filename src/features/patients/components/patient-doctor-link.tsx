import Link from 'next/link';

import type { Patient } from '../types';

/** The treating doctor, linked to their page. */
export function PatientDoctorLink({ doctor }: { doctor: Patient['doctor'] }) {
  if (!doctor) return <span className="text-muted-foreground">Unassigned</span>;
  return (
    <Link
      href={`/doctors/${doctor.id}`}
      className="block min-w-0 underline-offset-4 hover:underline"
    >
      <span className="block truncate font-medium">{doctor.name}</span>
      <span className="block truncate text-xs text-muted-foreground">{doctor.specialization}</span>
    </Link>
  );
}
