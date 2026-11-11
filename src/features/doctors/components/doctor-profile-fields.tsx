'use client';

import { Controller, type Control, type FieldErrors, type UseFormRegister } from 'react-hook-form';

import { Field, fieldErrorId } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

import { SPECIALIZATION_OPTIONS } from '../constants';
import { useHospitals } from '../queries';
import type { DoctorValues } from '../schemas';

const HOSPITAL_LIST_ID = 'known-hospitals';

interface DoctorProfileFieldsProps {
  control: Control<DoctorValues>;
  register: UseFormRegister<DoctorValues>;
  errors: FieldErrors<DoctorValues>;
}

export function DoctorProfileFields({ control, register, errors }: DoctorProfileFieldsProps) {
  const hospitals = useHospitals();

  return (
    <>
      <Field
        htmlFor="name"
        label="Full name"
        error={errors.name?.message}
        className="sm:col-span-2"
      >
        <Input
          id="name"
          placeholder="Ayesha Rahman"
          autoComplete="off"
          autoFocus
          aria-invalid={Boolean(errors.name)}
          aria-describedby={fieldErrorId('name')}
          {...register('name')}
        />
      </Field>
      <Field htmlFor="specialization" label="Specialization" error={errors.specialization?.message}>
        <Controller
          control={control}
          name="specialization"
          render={({ field }) => (
            <Select
              id="specialization"
              placeholder="Choose one"
              options={SPECIALIZATION_OPTIONS}
              value={field.value ?? null}
              onValueChange={field.onChange}
              onBlur={field.onBlur}
              aria-invalid={Boolean(errors.specialization)}
              aria-describedby={fieldErrorId('specialization')}
            />
          )}
        />
      </Field>
      <Field htmlFor="hospital" label="Hospital" error={errors.hospital?.message}>
        {/* Suggest existing names so one hospital doesn't end up spelled three ways. */}
        <Input
          id="hospital"
          placeholder="Square Hospital"
          list={HOSPITAL_LIST_ID}
          aria-invalid={Boolean(errors.hospital)}
          aria-describedby={fieldErrorId('hospital')}
          {...register('hospital')}
        />
      </Field>
      <datalist id={HOSPITAL_LIST_ID}>
        {hospitals.data?.map((name) => (
          <option key={name} value={name} />
        ))}
      </datalist>
    </>
  );
}
