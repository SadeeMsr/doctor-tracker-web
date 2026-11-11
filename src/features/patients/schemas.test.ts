import { describe, expect, it } from 'vitest';

import { toDateInput } from '@/lib/format';

import { patientSchema, toPatientChanges, toPatientInput, type PatientValues } from './schemas';

const valid: PatientValues = {
  name: 'Karim Uddin',
  dateOfBirth: '1980-05-04',
  gender: 'male',
  phone: '+880 1711 000000',
  email: '',
  condition: 'stable',
  diagnosis: 'Hypertension, controlled',
  admittedAt: '2026-11-01',
  doctorId: 'd1',
};

const tomorrow = () => toDateInput(new Date(Date.now() + 86_400_000));
const errorsFor = (input: object) =>
  patientSchema.safeParse(input).error?.issues.map((issue) => issue.path.join('.')) ?? [];

describe('patientSchema', () => {
  it('accepts a complete patient, with the email optional', () => {
    expect(errorsFor(valid)).toEqual([]);
  });

  it('refuses dates in the future', () => {
    expect(errorsFor({ ...valid, dateOfBirth: tomorrow() })).toEqual(['dateOfBirth']);
    expect(errorsFor({ ...valid, admittedAt: tomorrow() })).toEqual(['admittedAt']);
  });

  it('only accepts known conditions', () => {
    expect(errorsFor({ ...valid, condition: 'sleepy' })).toEqual(['condition']);
  });
});

describe('request shaping', () => {
  it('turns form values into the API body: ISO dates and a null email', () => {
    const input = toPatientInput(valid);

    expect(input.email).toBeNull();
    expect(input.dateOfBirth).toMatch(/^1980-05-04T/);
  });

  it('sends only the fields the user changed, so PATCH stays idempotent', () => {
    const changes = toPatientChanges(
      { ...valid, condition: 'critical', doctorId: 'd2' },
      { condition: true, doctorId: true },
    );

    expect(changes).toEqual({ condition: 'critical', doctorId: 'd2' });
  });
});
