'use client';

import { UserPlus } from 'lucide-react';

import { Avatar } from '@/components/ui/avatar';
import { Dialog, DialogIcon } from '@/components/ui/dialog';

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

function description(patient?: Patient, doctorId?: string): string {
  if (patient) return `Update ${patient.name}'s record.`;
  return doctorId
    ? 'They join this doctor’s patient list.'
    : 'Fill in their record and choose their doctor.';
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
      media={
        patient ? (
          <Avatar name={patient.name} tone="lime" className="size-12 text-base" />
        ) : (
          <DialogIcon>
            <UserPlus aria-hidden />
          </DialogIcon>
        )
      }
      description={description(patient, doctorId)}
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
