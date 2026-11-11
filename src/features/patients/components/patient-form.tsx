'use client';

import { FormActions } from '@/components/feedback/form-actions';
import { DialogBody } from '@/components/ui/dialog';

import { usePatientForm, type PatientCarry } from '../hooks/use-patient-form';
import type { Patient } from '../types';

import { PatientClinicalFields } from './patient-clinical-fields';
import { PatientDoctorField } from './patient-doctor-field';
import { PatientPersonalFields } from './patient-personal-fields';

interface PatientFormProps {
  patient?: Patient;
  doctorId?: string;
  /** Kept from the previous patient in "Save & add another". */
  carry?: PatientCarry;
  /** Patients saved so far in this dialog visit. */
  addedCount: number;
  onDone: () => void;
  onSavedAndNext: (carry: PatientCarry) => void;
}

function addedSoFar(count: number): string {
  return `${String(count)} ${count === 1 ? 'patient' : 'patients'} added so far. Ready for the next one.`;
}

export function PatientForm({ addedCount, ...options }: PatientFormProps) {
  const { patient, doctorId } = options;
  const { form, onSubmit, onSubmitAnother, isPending } = usePatientForm(options);
  const { errors } = form.formState;
  const fields = { control: form.control, register: form.register, errors };

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      aria-busy={isPending}
      className="flex min-h-0 flex-1 flex-col"
    >
      <DialogBody>
        <PatientPersonalFields {...fields} />
        <PatientClinicalFields {...fields} />
        {/* Hidden only when adding from a doctor's page: the patient joins that doctor. */}
        {(patient || !doctorId) && (
          <PatientDoctorField control={form.control} error={errors.doctorId?.message} />
        )}
      </DialogBody>
      <FormActions
        error={errors.root?.message}
        note={addedCount > 0 ? addedSoFar(addedCount) : undefined}
        isPending={isPending}
        submitLabel={patient ? 'Save changes' : 'Add patient'}
        onCancel={options.onDone}
        {...(!patient && { secondaryLabel: 'Save & add another', onSecondary: onSubmitAnother })}
      />
    </form>
  );
}
