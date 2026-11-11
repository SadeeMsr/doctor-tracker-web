'use client';

import { Plus } from 'lucide-react';
import { parseAsBoolean, useQueryState } from 'nuqs';

import { PageHeader } from '@/components/feedback/page-header';
import { Button } from '@/components/ui/button';
import { useDisclosure } from '@/hooks/use-disclosure';

import { useDoctorFilters } from '../hooks/use-doctor-filters';
import type { Doctor } from '../types';

import { DeleteDoctorDialog } from './delete-doctor-dialog';
import { DoctorFormDialog } from './doctor-form-dialog';
import { DoctorsResults } from './doctors-results';
import { DoctorsToolbar } from './doctors-toolbar';

/** The doctors page: header, filters, results and the dialogs they open. */
export function DoctorsView() {
  const state = useDoctorFilters();
  // In the URL, so "Add doctor" can be linked to from anywhere (e.g. the dashboard).
  const [isCreating, setIsCreating] = useQueryState('new', parseAsBoolean.withDefault(false));
  const editing = useDisclosure<Doctor>();
  const deleting = useDisclosure<Doctor>();
  const openCreate = () => void setIsCreating(true);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Directory"
        title="Doctors"
        description="Everyone on the roster. Open a doctor to see and manage their patients."
        actions={
          <Button onClick={openCreate}>
            <Plus aria-hidden />
            Add doctor
          </Button>
        }
      />
      <DoctorsToolbar state={state} />
      <DoctorsResults
        state={state}
        onCreate={openCreate}
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
