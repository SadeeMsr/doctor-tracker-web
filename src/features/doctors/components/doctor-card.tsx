import { Building2, Users } from 'lucide-react';
import type { ReactNode } from 'react';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

import type { Doctor } from '../types';

import { DoctorIdentity } from './doctor-identity';

/** A doctor as a stacked card: the phone layout of a table row. */
export function DoctorCard({ doctor, actions }: { doctor: Doctor; actions: ReactNode }) {
  return (
    <Card className="space-y-4 p-4">
      <div className="flex items-start justify-between gap-2">
        <DoctorIdentity doctor={doctor} secondary={doctor.email} />
        {actions}
      </div>
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <Badge tone="accent">{doctor.specialization}</Badge>
        <span className="inline-flex items-center gap-1.5">
          <Building2 className="size-3.5" aria-hidden />
          {doctor.hospital}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Users className="size-3.5" aria-hidden />
          {doctor.patientCount} {doctor.patientCount === 1 ? 'patient' : 'patients'}
        </span>
      </div>
    </Card>
  );
}
