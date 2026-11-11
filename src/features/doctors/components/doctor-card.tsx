import { Building2 } from 'lucide-react';
import type { ReactNode } from 'react';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

import type { Doctor } from '../types';

import { DoctorIdentity } from './doctor-identity';
import { DoctorPatientsLink } from './doctor-patients-link';

/** A doctor as a stacked card: the phone layout of a table row. */
interface DoctorCardProps {
  doctor: Doctor;
  actions: ReactNode;
  onAddPatient: (doctor: Doctor) => void;
}

export function DoctorCard({ doctor, actions, onAddPatient }: DoctorCardProps) {
  return (
    <Card className="space-y-4 p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <DoctorIdentity doctor={doctor} secondary={doctor.email} />
        </div>
        <div className="shrink-0">{actions}</div>
      </div>
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <Badge tone="accent">{doctor.specialization}</Badge>
        <span className="inline-flex items-center gap-1.5">
          <Building2 className="size-3.5" aria-hidden />
          {doctor.hospital}
        </span>
      </div>
      <DoctorPatientsLink
        doctor={doctor}
        onAddPatient={onAddPatient}
        className="w-full justify-between"
      />
    </Card>
  );
}
