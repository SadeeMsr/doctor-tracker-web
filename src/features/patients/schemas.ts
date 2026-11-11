import { z } from 'zod';

import { CONDITIONS } from '@/lib/conditions';
import { dateInputToIso, isDateInput, toDateInput } from '@/lib/format';

import { GENDERS } from './constants';
import type { PatientChanges, PatientInput } from './types';

const notInFuture = (value: string) => value <= toDateInput(new Date());

/** Mirrors the API's patient body rules: same limits, enums and phone pattern. */
export const patientSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Enter the patient’s full name')
    .max(120, 'Keep it under 120 characters'),
  dateOfBirth: z
    .string()
    .refine(isDateInput, 'Enter a date of birth')
    .refine(notInFuture, 'Date of birth cannot be in the future')
    .refine((value) => value >= '1900-01-01', 'Enter a valid date of birth'),
  gender: z.enum(GENDERS, 'Choose a gender'),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9][0-9\s\-()]{6,19}$/, 'Enter a valid phone number'),
  email: z.union([
    z.literal(''),
    z.string().trim().max(254).pipe(z.email('Enter a valid email address')),
  ]),
  condition: z.enum(CONDITIONS, 'Choose a condition'),
  diagnosis: z
    .string()
    .trim()
    .min(2, 'Describe the diagnosis')
    .max(500, 'Keep it under 500 characters'),
  admittedAt: z
    .string()
    .refine(isDateInput, 'Enter the admission date')
    .refine(notInFuture, 'Admission date cannot be in the future'),
  doctorId: z.string().min(1, 'Choose a doctor'),
});

export type PatientValues = z.infer<typeof patientSchema>;

export const PATIENT_FIELDS = [
  'name',
  'dateOfBirth',
  'gender',
  'phone',
  'email',
  'condition',
  'diagnosis',
  'admittedAt',
  'doctorId',
] as const;

/** Form values → request body: dates become instants, a blank email becomes "none". */
export function toPatientInput(values: PatientValues): PatientInput {
  return {
    name: values.name,
    dateOfBirth: dateInputToIso(values.dateOfBirth),
    gender: values.gender,
    phone: values.phone,
    email: values.email || null,
    condition: values.condition,
    diagnosis: values.diagnosis,
    admittedAt: dateInputToIso(values.admittedAt),
  };
}

/** Only the fields the user changed, as final values (PATCH stays idempotent). */
export function toPatientChanges(
  values: PatientValues,
  dirty: Partial<Record<keyof PatientValues, unknown>>,
): PatientChanges {
  const all: PatientChanges = { ...toPatientInput(values), doctorId: values.doctorId };
  return Object.fromEntries(
    PATIENT_FIELDS.filter((field) => dirty[field]).map((field) => [field, all[field]]),
  );
}
