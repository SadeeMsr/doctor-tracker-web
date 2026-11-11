'use client';

import { UserPlus } from 'lucide-react';

import { Avatar } from '@/components/ui/avatar';
import { Dialog, DialogIcon } from '@/components/ui/dialog';
import { useAddAnother } from '@/hooks/use-add-another';

import type { PatientCarry } from '../hooks/use-patient-form';
import type { Patient } from '../types';

import { PatientForm } from './patient-form';

interface PatientFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Present when editing. */
  patient?: Patient;
  /** The doctor a new patient is added under. */
  doctorId?: string;
  /** That doctor's display name, when known, for the dialog's description. */
  doctorLabel?: string;
}

function description(patient?: Patient, doctorId?: string, doctorLabel?: string): string {
  if (patient) return `Update ${patient.name}'s record.`;
  if (doctorLabel) return `Joins the patient list of ${doctorLabel}.`;
  return doctorId
    ? 'They join this doctor’s patient list.'
    : 'Fill in their record and choose their doctor.';
}

export function PatientFormDialog({
  open,
  onOpenChange,
  patient,
  doctorId,
  doctorLabel,
}: PatientFormDialogProps) {
  const session = useAddAnother<PatientCarry>();
  const handleOpenChange = (next: boolean) => {
    if (!next) session.end();
    onOpenChange(next);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
      title={patient ? 'Edit patient' : 'Add a patient'}
      media={
        patient ? (
          <Avatar name={patient.name} tone="lime" className="size-12 text-base" />
        ) : (
          <DialogIcon>
            <UserPlus aria-hidden />
          </DialogIcon>
        )
      }
      description={description(patient, doctorId, doctorLabel)}
    >
      {/* A new key per saved patient remounts the form: clean values, errors and focus. */}
      <PatientForm
        key={`${patient?.id ?? doctorId ?? 'new'}-${String(session.addedCount)}`}
        patient={patient}
        doctorId={doctorId}
        carry={session.carry}
        addedCount={session.addedCount}
        onDone={() => handleOpenChange(false)}
        onSavedAndNext={session.startNext}
      />
    </Dialog>
  );
}
