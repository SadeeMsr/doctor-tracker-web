'use client';

import { parseAsBoolean, parseAsString, useQueryState } from 'nuqs';

import { useDisclosure } from '@/hooks/use-disclosure';
import { useShortcut } from '@/hooks/use-shortcut';
import { ADD_PATIENT_PARAM } from '@/lib/constants';
import { SHORTCUTS } from '@/lib/shortcuts';

import { useDoctorFilters } from '../hooks/use-doctor-filters';
import type { Doctor } from '../types';

import { DeleteDoctorDialog } from './delete-doctor-dialog';
import { DoctorFormDialog } from './doctor-form-dialog';
import { DoctorsResults } from './doctors-results';
import { DoctorsToolbar } from './doctors-toolbar';

/** The doctors list: filters, results and the dialogs they open. The page renders the header. */
export function DoctorsView() {
  const state = useDoctorFilters();
  // In the URL, so "Add doctor" can be linked to from anywhere (e.g. the dashboard).
  const [isCreating, setIsCreating] = useQueryState('new', parseAsBoolean.withDefault(false));
  const editing = useDisclosure<Doctor>();
  const deleting = useDisclosure<Doctor>();
  const openCreate = () => void setIsCreating(true);
  useShortcut(SHORTCUTS.create, openCreate);
  // The patients feature, mounted next to this view by the page, opens its form from the URL.
  const [, setAddPatientFor] = useQueryState(ADD_PATIENT_PARAM, parseAsString);

  return (
    <div className="space-y-6">
      <DoctorsToolbar state={state} />
      <DoctorsResults
        state={state}
        onCreate={openCreate}
        onAddPatient={(doctor) => void setAddPatientFor(doctor.id)}
        onEdit={editing.show}
        onDelete={deleting.show}
      />
      <DoctorFormDialog
        open={isCreating}
        onOpenChange={(open) => void setIsCreating(open || null)}
      />
      <DoctorFormDialog
        open={editing.isOpen}
        onOpenChange={editing.hide}
        doctor={editing.item ?? undefined}
      />
      <DeleteDoctorDialog open={deleting.isOpen} onClose={deleting.hide} doctor={deleting.item} />
    </div>
  );
}
