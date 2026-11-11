'use client';

import { Plus } from 'lucide-react';
import { parseAsBoolean, useQueryState } from 'nuqs';

import { Button } from '@/components/ui/button';
import { useDisclosure } from '@/hooks/use-disclosure';

import { usePatientFilters } from '../hooks/use-patient-filters';
import type { Patient } from '../types';

import { DeletePatientDialog } from './delete-patient-dialog';
import { PatientFormDialog } from './patient-form-dialog';
import { PatientsResults } from './patients-results';
import { PatientsToolbar } from './patients-toolbar';

interface PatientsViewProps {
  /** Set on a doctor's page: lists only their patients, and new patients join this doctor. */
  doctorId?: string;
}

/** A patient list with its filters and dialogs: the patients page, or one doctor's patients. */
export function PatientsView({ doctorId }: PatientsViewProps) {
  const state = usePatientFilters();
  // In the URL, so a page header (or any other page) can link straight to the add form.
  const [isCreating, setIsCreating] = useQueryState('new', parseAsBoolean.withDefault(false));
  const editing = useDisclosure<Patient>();
  const deleting = useDisclosure<Patient>();
  const addButton = (
    <Button onClick={() => void setIsCreating(true)}>
      <Plus aria-hidden />
      Add patient
    </Button>
  );

  return (
    <section className="space-y-5" aria-label="Patients">
      {doctorId && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-semibold tracking-tight">Patients</h2>
          {addButton}
        </div>
      )}
      <PatientsToolbar state={state} />
      <PatientsResults
        doctorId={doctorId ?? null}
        state={state}
        emptyDescription={
          doctorId
            ? 'This doctor has no patients yet. Add the first one.'
            : 'Add the first patient and choose the doctor caring for them.'
        }
        emptyAction={addButton}
        onEdit={editing.show}
        onDelete={deleting.show}
      />
      <PatientFormDialog
        open={isCreating}
        onOpenChange={(open) => void setIsCreating(open || null)}
        doctorId={doctorId}
      />
      <PatientFormDialog
        open={editing.isOpen}
        onOpenChange={editing.hide}
        patient={editing.item ?? undefined}
      />
      <DeletePatientDialog
        open={deleting.isOpen}
        onClose={deleting.hide}
        patient={deleting.item}
        doctorId={doctorId ?? null}
      />
    </section>
  );
}
