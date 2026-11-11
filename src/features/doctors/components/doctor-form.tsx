'use client';

import { FormActions } from '@/components/feedback/form-actions';
import { DialogBody } from '@/components/ui/dialog';
import { Fieldset } from '@/components/ui/fieldset';

import { useDoctorForm } from '../hooks/use-doctor-form';
import type { Doctor } from '../types';

import { DoctorContactFields } from './doctor-contact-fields';
import { DoctorProfileFields } from './doctor-profile-fields';

export function DoctorForm({ doctor, onDone }: { doctor?: Doctor; onDone: () => void }) {
  const { form, onSubmit, isPending } = useDoctorForm({ doctor, onDone });
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
        isPending={isPending}
        submitLabel={doctor ? 'Save changes' : 'Add doctor'}
        onCancel={onDone}
      />
    </form>
  );
}
