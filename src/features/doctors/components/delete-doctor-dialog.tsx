'use client';

import Link from 'next/link';

import { ConfirmDialog } from '@/components/feedback/confirm-dialog';

import { useDeleteDoctor } from '../queries';
import type { Doctor } from '../types';

interface DeleteDoctorDialogProps {
  open: boolean;
  onClose: () => void;
  doctor: Doctor | null;
}

/** The API refuses to delete a doctor who still has patients; say so before they try. */
function PatientsBlocker({ doctor, onClose }: { doctor: Doctor; onClose: () => void }) {
  return (
    <p className="mt-3 rounded-2xl bg-canvas-soft p-4 text-sm">
      Move or remove their patients first.{' '}
      <Link
        href={`/doctors/${doctor.id}`}
        onClick={onClose}
        className="font-medium text-brand underline underline-offset-4"
      >
        View patients
      </Link>
    </p>
  );
}

export function DeleteDoctorDialog({ open, onClose, doctor }: DeleteDoctorDialogProps) {
  const remove = useDeleteDoctor();
  if (!doctor) return null;
  const hasPatients = doctor.patientCount > 0;

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onClose}
      title={`Delete ${doctor.name}?`}
      description={
        hasPatients
          ? `${doctor.name} still has ${String(doctor.patientCount)} patient(s), so they can't be deleted yet.`
          : 'This removes the doctor from the roster. It cannot be undone.'
      }
      confirmLabel="Delete doctor"
      isPending={remove.isPending}
      blocker={hasPatients ? <PatientsBlocker doctor={doctor} onClose={onClose} /> : undefined}
      // Close straight away: the row is already gone optimistically, and a failure toasts.
      onConfirm={() => {
        remove.mutate(doctor);
        onClose();
      }}
    />
  );
}
