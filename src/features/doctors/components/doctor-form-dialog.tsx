'use client';

import { Dialog } from '@/components/ui/dialog';

import type { Doctor } from '../types';

import { DoctorForm } from './doctor-form';

interface DoctorFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Present when editing; absent when creating. */
  doctor?: Doctor;
}

export function DoctorFormDialog({ open, onOpenChange, doctor }: DoctorFormDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={doctor ? 'Edit doctor' : 'Add a doctor'}
      description={
        doctor ? `Update ${doctor.name}'s details.` : 'They can be assigned patients right away.'
      }
    >
      <DoctorForm key={doctor?.id} doctor={doctor} onDone={() => onOpenChange(false)} />
    </Dialog>
  );
}
