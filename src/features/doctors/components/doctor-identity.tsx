import Link from 'next/link';

import { Avatar } from '@/components/ui/avatar';

import type { Doctor } from '../types';

/** Avatar, name (a link to the doctor's patients) and one secondary line. */
export function DoctorIdentity({ doctor, secondary }: { doctor: Doctor; secondary: string }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <Avatar name={doctor.name} />
      <div className="min-w-0">
        <Link
          href={`/doctors/${doctor.id}`}
          className="block truncate font-medium underline-offset-4 hover:underline"
        >
          {doctor.name}
        </Link>
        <p className="truncate text-xs text-muted-foreground">{secondary}</p>
      </div>
    </div>
  );
}
