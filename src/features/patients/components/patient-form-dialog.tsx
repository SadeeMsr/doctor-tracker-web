'use client';

import { Dialog } from '@/components/ui/dialog';

import type { Patient } from '../types';

import { PatientForm } from './patient-form';

interface PatientFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Present when editing. */
  patient?: Patient;
  /** The doctor a new patient is added under. */
  doctorId?: string;
}

export function PatientFormDialog({
  open,
  onOpenChange,
  patient,
  doctorId,
}: PatientFormDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={patient ? 'Edit patient' : 'Add a patient'}
      description={
        patient ? `Update ${patient.name}'s record.` : 'They join this doctor’s patient list.'
      }
    >
      <PatientForm
        key={patient?.id}
        patient={patient}
        doctorId={doctorId}
        onDone={() => onOpenChange(false)}
      />
    </Dialog>
  );
}
