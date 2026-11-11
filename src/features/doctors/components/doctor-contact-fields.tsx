import type { FieldErrors, UseFormRegister } from 'react-hook-form';

import { Field, fieldErrorId } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

import type { DoctorValues } from '../schemas';

interface DoctorContactFieldsProps {
  register: UseFormRegister<DoctorValues>;
  errors: FieldErrors<DoctorValues>;
}

export function DoctorContactFields({ register, errors }: DoctorContactFieldsProps) {
  return (
    <>
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
      <Field htmlFor="email" label="Email" error={errors.email?.message}>
        <Input
          id="email"
          type="email"
          inputMode="email"
          placeholder="doctor@hospital.com"
          autoComplete="off"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={fieldErrorId('email')}
          {...register('email')}
        />
      </Field>
    </>
  );
}
