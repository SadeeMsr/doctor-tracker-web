import { Pencil, Trash2, UserPlus } from 'lucide-react';

import { Button } from '@/components/ui/button';

import type { Doctor } from '../types';

interface DoctorRowActionsProps {
  doctor: Doctor;
  onAddPatient: (doctor: Doctor) => void;
  onEdit: (doctor: Doctor) => void;
  onDelete: (doctor: Doctor) => void;
}

/** Add a patient, edit and delete sit on the row itself: one click each, no menu first. */
export function DoctorRowActions({
  doctor,
  onAddPatient,
  onEdit,
  onDelete,
}: DoctorRowActionsProps) {
  return (
    <div className="flex justify-end gap-0.5">
      <Button
        variant="ghost"
        size="icon"
        aria-label={`Add a patient for ${doctor.name}`}
        title="Add patient"
        className="size-9"
        onClick={() => onAddPatient(doctor)}
      >
        <UserPlus aria-hidden />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        aria-label={`Edit ${doctor.name}`}
        title="Edit doctor"
        className="size-9"
        onClick={() => onEdit(doctor)}
      >
        <Pencil aria-hidden />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        aria-label={`Delete ${doctor.name}`}
        title="Delete doctor"
        className="size-9 text-danger hover:bg-danger/10"
        onClick={() => onDelete(doctor)}
      >
        <Trash2 aria-hidden />
      </Button>
    </div>
  );
}
