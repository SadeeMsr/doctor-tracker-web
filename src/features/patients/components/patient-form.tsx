'use client';

import { FormActions } from '@/components/feedback/form-actions';
import { DialogBody } from '@/components/ui/dialog';

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
        isPending={isPending}
        submitLabel={patient ? 'Save changes' : 'Add patient'}
        onCancel={onDone}
      />
    </form>
  );
}
