'use client';

import { FormActions } from '@/components/feedback/form-actions';

import { usePatientForm } from '../hooks/use-patient-form';
import type { Patient } from '../types';

import { PatientClinicalFields } from './patient-clinical-fields';
import { PatientDoctorField } from './patient-doctor-field';
import { PatientPersonalFields } from './patient-personal-fields';

interface PatientFormProps {
  patient?: Patient;
  doctorId?: string;
  onDone: () => void;
}

export function PatientForm({ patient, doctorId, onDone }: PatientFormProps) {
  const { form, onSubmit, isPending } = usePatientForm({ patient, doctorId, onDone });
  const { errors } = form.formState;
  const fields = { control: form.control, register: form.register, errors };

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      aria-busy={isPending}
      className="grid gap-x-4 sm:grid-cols-2"
    >
      <PatientPersonalFields {...fields} />
      <PatientClinicalFields {...fields} />
      {/* Reassigning is an edit; a new patient already belongs to the doctor being viewed. */}
      {patient && <PatientDoctorField control={form.control} error={errors.doctorId?.message} />}
      <FormActions
        className="sm:col-span-2"
        error={errors.root?.message}
        isPending={isPending}
        submitLabel={patient ? 'Save changes' : 'Add patient'}
        onCancel={onDone}
      />
    </form>
  );
}
