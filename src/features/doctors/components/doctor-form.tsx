'use client';

import { FormActions } from '@/components/feedback/form-actions';
import { DialogBody } from '@/components/ui/dialog';
import { Fieldset } from '@/components/ui/fieldset';

import { useDoctorForm, type DoctorCarry } from '../hooks/use-doctor-form';
import type { Doctor } from '../types';

import { DoctorContactFields } from './doctor-contact-fields';
import { DoctorProfileFields } from './doctor-profile-fields';

function addedSoFar(count: number): string {
  return `${String(count)} ${count === 1 ? 'doctor' : 'doctors'} added so far. Ready for the next one.`;
}

interface DoctorFormProps {
  doctor?: Doctor;
  /** Kept from the previous doctor in "Save & add another". */
  carry?: DoctorCarry;
  /** Doctors saved so far in this dialog visit. */
  addedCount: number;
  onDone: () => void;
  onSavedAndNext: (carry: DoctorCarry) => void;
}

export function DoctorForm({ addedCount, ...options }: DoctorFormProps) {
  const { doctor, onDone } = options;
  const { form, onSubmit, onSubmitAnother, isPending } = useDoctorForm(options);
  const { errors } = form.formState;

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      aria-busy={isPending}
      className="flex min-h-0 flex-1 flex-col"
    >
      <DialogBody>
        <Fieldset legend="Profile">
          <DoctorProfileFields control={form.control} register={form.register} errors={errors} />
        </Fieldset>
        <Fieldset legend="Contact">
          <DoctorContactFields register={form.register} errors={errors} />
        </Fieldset>
      </DialogBody>
      <FormActions
        error={errors.root?.message}
        note={addedCount > 0 ? addedSoFar(addedCount) : undefined}
        isPending={isPending}
        submitLabel={doctor ? 'Save changes' : 'Add doctor'}
        onCancel={onDone}
        {...(!doctor && { secondaryLabel: 'Save & add another', onSecondary: onSubmitAnother })}
      />
    </form>
  );
}
