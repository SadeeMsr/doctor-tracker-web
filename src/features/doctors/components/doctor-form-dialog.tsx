'use client';

import { Stethoscope } from 'lucide-react';

import { Avatar } from '@/components/ui/avatar';
import { Dialog, DialogIcon } from '@/components/ui/dialog';
import { useAddAnother } from '@/hooks/use-add-another';

import type { DoctorCarry } from '../hooks/use-doctor-form';
import type { Doctor } from '../types';

import { DoctorForm } from './doctor-form';

interface DoctorFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Present when editing; absent when creating. */
  doctor?: Doctor;
}

export function DoctorFormDialog({ open, onOpenChange, doctor }: DoctorFormDialogProps) {
  const session = useAddAnother<DoctorCarry>();
  const handleOpenChange = (next: boolean) => {
    if (!next) session.end();
    onOpenChange(next);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
      title={doctor ? 'Edit doctor' : 'Add a doctor'}
      media={
        doctor ? (
          <Avatar name={doctor.name} tone="lime" className="size-12 text-base" />
        ) : (
          <DialogIcon>
            <Stethoscope aria-hidden />
          </DialogIcon>
        )
      }
      description={
        doctor ? `Update ${doctor.name}'s details.` : 'They can be assigned patients right away.'
      }
    >
      {/* A new key per saved doctor remounts the form: clean values, errors and focus. */}
      <DoctorForm
        key={`${doctor?.id ?? 'new'}-${String(session.addedCount)}`}
        doctor={doctor}
        carry={session.carry}
        addedCount={session.addedCount}
        onDone={() => handleOpenChange(false)}
        onSavedAndNext={session.startNext}
      />
    </Dialog>
  );
}
