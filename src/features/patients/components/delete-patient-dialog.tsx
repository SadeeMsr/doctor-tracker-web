'use client';

import { ConfirmDialog } from '@/components/feedback/confirm-dialog';

import { useDeletePatient } from '../queries';
import type { Patient } from '../types';

interface DeletePatientDialogProps {
  open: boolean;
  onClose: () => void;
  patient: Patient | null;
  doctorId: string | null;
}

export function DeletePatientDialog({
  open,
  onClose,
  patient,
  doctorId,
}: DeletePatientDialogProps) {
  const remove = useDeletePatient(doctorId);
  if (!patient) return null;

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onClose}
      title={`Delete ${patient.name}?`}
      description="This permanently removes the patient's record. It cannot be undone."
      confirmLabel="Delete patient"
      isPending={remove.isPending}
      // Close straight away: the row is already gone optimistically, and a failure toasts.
      onConfirm={() => {
        remove.mutate(patient);
        onClose();
      }}
    />
  );
}
