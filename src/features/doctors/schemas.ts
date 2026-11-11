import { z } from 'zod';

import { SPECIALIZATIONS } from './constants';

/** Mirrors the API's `createDoctorBody`: same limits and the same phone pattern. */
export const doctorSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Enter the doctor’s full name')
    .max(120, 'Keep it under 120 characters'),
  specialization: z.enum(SPECIALIZATIONS, 'Choose a specialization'),
  hospital: z
    .string()
    .trim()
    .min(2, 'Enter the hospital name')
    .max(160, 'Keep it under 160 characters'),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9][0-9\s\-()]{6,19}$/, 'Enter a valid phone number'),
  email: z
    .string()
    .trim()
    .min(1, 'Enter an email address')
    .max(254)
    .pipe(z.email('Enter a valid email address')),
});

export type DoctorValues = z.infer<typeof doctorSchema>;

export const DOCTOR_FIELDS = ['name', 'specialization', 'hospital', 'phone', 'email'] as const;
