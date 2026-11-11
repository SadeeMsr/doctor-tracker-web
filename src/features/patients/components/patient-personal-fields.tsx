import { Controller } from 'react-hook-form';

import { Field, fieldErrorId } from '@/components/ui/field';
import { Fieldset } from '@/components/ui/fieldset';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { toDateInput } from '@/lib/format';

import { GENDER_OPTIONS } from '../constants';

import type { PatientFieldProps } from './patient-field-props';

export function PatientPersonalFields({ control, register, errors }: PatientFieldProps) {
  return (
    <>
      <Fieldset legend="Personal">
        <Field
          htmlFor="name"
          label="Full name"
          error={errors.name?.message}
          className="sm:col-span-2"
        >
          <Input
            id="name"
            placeholder="Karim Uddin"
            autoComplete="off"
            autoFocus
            aria-invalid={Boolean(errors.name)}
            aria-describedby={fieldErrorId('name')}
            {...register('name')}
          />
        </Field>
        <Field htmlFor="dateOfBirth" label="Date of birth" error={errors.dateOfBirth?.message}>
          <Input
            id="dateOfBirth"
            type="date"
            min="1900-01-01"
            max={toDateInput(new Date())}
            aria-invalid={Boolean(errors.dateOfBirth)}
            aria-describedby={fieldErrorId('dateOfBirth')}
            {...register('dateOfBirth')}
          />
        </Field>
        <Field htmlFor="gender" label="Gender" error={errors.gender?.message}>
          <Controller
            control={control}
            name="gender"
            render={({ field }) => (
              <Select
                id="gender"
                placeholder="Choose one"
                options={GENDER_OPTIONS}
                value={field.value ?? null}
                onValueChange={field.onChange}
                onBlur={field.onBlur}
                aria-invalid={Boolean(errors.gender)}
                aria-describedby={fieldErrorId('gender')}
              />
            )}
          />
        </Field>
      </Fieldset>
      <Fieldset legend="Contact">
        <Field htmlFor="phone" label="Phone" error={errors.phone?.message}>
          <Input
            id="phone"
            type="tel"
            inputMode="tel"
            placeholder="+880 1711 000000"
            autoComplete="off"
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={fieldErrorId('phone')}
            {...register('phone')}
          />
        </Field>
        <Field htmlFor="email" label="Email (optional)" error={errors.email?.message}>
          <Input
            id="email"
            type="email"
            inputMode="email"
            placeholder="patient@example.com"
            autoComplete="off"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={fieldErrorId('email')}
            {...register('email')}
          />
        </Field>
      </Fieldset>
    </>
  );
}
