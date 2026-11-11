'use client';

import { Controller, type Control } from 'react-hook-form';

import { Field, fieldErrorId } from '@/components/ui/field';
import { Select } from '@/components/ui/select';

import { useDoctorOptions } from '../queries';
import type { PatientValues } from '../schemas';

interface PatientDoctorFieldProps {
  control: Control<PatientValues>;
  error?: string;
}

/** Moves the patient to another doctor. */
export function PatientDoctorField({ control, error }: PatientDoctorFieldProps) {
  const doctors = useDoctorOptions();

  return (
    <Field htmlFor="doctorId" label="Doctor" error={error} className="sm:col-span-2">
      <Controller
        control={control}
        name="doctorId"
        render={({ field }) => (
          <Select
            id="doctorId"
            placeholder={doctors.isPending ? 'Loading doctors…' : 'Choose a doctor'}
            disabled={!doctors.data}
            options={doctors.data ?? []}
            value={doctors.data ? field.value : null}
            onValueChange={field.onChange}
            onBlur={field.onBlur}
            aria-invalid={Boolean(error)}
            aria-describedby={fieldErrorId('doctorId')}
          />
        )}
      />
    </Field>
  );
}
