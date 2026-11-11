import { Pencil, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';

import type { Patient } from '../types';

interface PatientRowActionsProps {
  patient: Patient;
  onEdit: (patient: Patient) => void;
  onDelete: (patient: Patient) => void;
}

/** Edit and delete sit on the row itself: one click each, no menu to open first. */
export function PatientRowActions({ patient, onEdit, onDelete }: PatientRowActionsProps) {
  return (
    <div className="flex justify-end gap-1">
      <Button
        variant="ghost"
        size="icon"
        aria-label={`Edit ${patient.name}`}
        onClick={() => onEdit(patient)}
      >
        <Pencil aria-hidden />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        aria-label={`Delete ${patient.name}`}
        className="text-danger hover:bg-danger/10"
        onClick={() => onDelete(patient)}
      >
        <Trash2 aria-hidden />
      </Button>
    </div>
  );
}
