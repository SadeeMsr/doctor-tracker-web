import { Controller } from 'react-hook-form';

import { Field, fieldErrorId } from '@/components/ui/field';
import { Fieldset } from '@/components/ui/fieldset';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toDateInput } from '@/lib/format';

import { CONDITION_OPTIONS } from '../constants';

import type { PatientFieldProps } from './patient-field-props';

export function PatientClinicalFields({ control, register, errors }: PatientFieldProps) {
  return (
    <Fieldset legend="Clinical">
      <Field htmlFor="condition" label="Condition" error={errors.condition?.message}>
        <Controller
          control={control}
          name="condition"
          render={({ field }) => (
            <Select
              id="condition"
              options={CONDITION_OPTIONS}
              value={field.value ?? null}
              onValueChange={field.onChange}
              onBlur={field.onBlur}
              aria-invalid={Boolean(errors.condition)}
              aria-describedby={fieldErrorId('condition')}
            />
          )}
        />
      </Field>
      <Field htmlFor="admittedAt" label="Admitted on" error={errors.admittedAt?.message}>
        <Input
          id="admittedAt"
          type="date"
          max={toDateInput(new Date())}
          aria-invalid={Boolean(errors.admittedAt)}
          aria-describedby={fieldErrorId('admittedAt')}
          {...register('admittedAt')}
        />
      </Field>
      <Field
        htmlFor="diagnosis"
        label="Diagnosis"
        error={errors.diagnosis?.message}
        className="sm:col-span-2"
      >
        <Textarea
          id="diagnosis"
          rows={3}
          placeholder="Type 2 diabetes with mild hypertension"
          aria-invalid={Boolean(errors.diagnosis)}
          aria-describedby={fieldErrorId('diagnosis')}
          {...register('diagnosis')}
        />
      </Field>
    </Fieldset>
  );
}
