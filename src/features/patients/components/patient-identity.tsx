import { Avatar } from '@/components/ui/avatar';

import { GENDER_LABELS } from '../constants';
import type { Patient } from '../types';

/** Avatar, name, and age and gender underneath. */
export function PatientIdentity({ patient }: { patient: Patient }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <Avatar name={patient.name} />
      <div className="min-w-0">
        <p className="truncate font-medium">{patient.name}</p>
        <p className="truncate text-xs text-muted-foreground">
          {patient.age} yrs · {GENDER_LABELS[patient.gender]}
        </p>
      </div>
    </div>
  );
}
