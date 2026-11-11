'use client';

import { Controller } from 'react-hook-form';

import { FormActions } from '@/components/feedback/form-actions';
import { Field, fieldErrorId } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

import { SPECIALIZATION_OPTIONS } from '../constants';
import { useDoctorForm } from '../hooks/use-doctor-form';
import { useHospitals } from '../queries';
import type { Doctor } from '../types';

import { DoctorContactFields } from './doctor-contact-fields';

const HOSPITAL_LIST_ID = 'known-hospitals';

export function DoctorForm({ doctor, onDone }: { doctor?: Doctor; onDone: () => void }) {
  const { form, onSubmit, isPending } = useDoctorForm({ doctor, onDone });
  const { errors } = form.formState;
  const hospitals = useHospitals();

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      aria-busy={isPending}
      className="grid gap-x-4 sm:grid-cols-2"
    >
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
          {...form.register('name')}
        />
      </Field>
      <Field htmlFor="specialization" label="Specialization" error={errors.specialization?.message}>
        <Controller
          control={form.control}
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
          {...form.register('hospital')}
        />
      </Field>
      <datalist id={HOSPITAL_LIST_ID}>
        {hospitals.data?.map((name) => (
          <option key={name} value={name} />
        ))}
      </datalist>
      <DoctorContactFields register={form.register} errors={errors} />
      <FormActions
        className="sm:col-span-2"
        error={errors.root?.message}
        isPending={isPending}
        submitLabel={doctor ? 'Save changes' : 'Add doctor'}
        onCancel={onDone}
      />
    </form>
  );
}
