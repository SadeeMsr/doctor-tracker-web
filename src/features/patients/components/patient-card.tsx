import type { ReactNode } from 'react';

import { Card } from '@/components/ui/card';
import { formatDate } from '@/lib/format';

import type { Patient } from '../types';

import { ConditionBadge } from './condition-badge';
import { PatientDoctorLink } from './patient-doctor-link';
import { PatientIdentity } from './patient-identity';

interface PatientCardProps {
  patient: Patient;
  /** Hidden on a doctor's own list, where it would repeat on every card. */
  showDoctor: boolean;
  actions: ReactNode;
}

/** A patient as a stacked card: the phone layout of a table row. */
export function PatientCard({ patient, showDoctor, actions }: PatientCardProps) {
  return (
    <Card className="space-y-3 p-4">
      <div className="flex items-start justify-between gap-2">
        <PatientIdentity patient={patient} />
        {actions}
      </div>
      <p className="line-clamp-2 text-sm text-muted-foreground">{patient.diagnosis}</p>
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
        <ConditionBadge condition={patient.condition} />
        Admitted {formatDate(patient.admittedAt)}
      </div>
      {showDoctor && (
        <div className="border-t pt-3 text-sm">
          <PatientDoctorLink doctor={patient.doctor} />
        </div>
      )}
    </Card>
  );
}
