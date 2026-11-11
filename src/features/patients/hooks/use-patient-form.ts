'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { applyApiErrors } from '@/lib/form-errors';
import { toDateInput } from '@/lib/format';

import { useCreatePatient, useUpdatePatient } from '../queries';
import {
  PATIENT_FIELDS,
  patientSchema,
  toPatientChanges,
  toPatientInput,
  type PatientValues,
} from '../schemas';
import type { Patient } from '../types';

/** Values kept from one new patient to the next in "Save & add another". */
export type PatientCarry = Pick<PatientValues, 'doctorId' | 'admittedAt'>;

interface UsePatientFormOptions {
  /** Present when editing. */
  patient?: Patient;
  /** The doctor a new patient is added under. */
  doctorId?: string;
  /** Doctor and admission date carried over from the previous patient. */
  carry?: PatientCarry;
  onDone: () => void;
  /** "Save & add another": the dialog remounts the form with these values kept. */
  onSavedAndNext?: (carry: PatientCarry) => void;
}

function defaultValues(patient?: Patient, doctorId?: string): Partial<PatientValues> {
  return {
    name: patient?.name ?? '',
    dateOfBirth: patient ? toDateInput(patient.dateOfBirth) : '',
    gender: patient?.gender,
    phone: patient?.phone ?? '',
    email: patient?.email ?? '',
    condition: patient?.condition ?? 'stable',
    diagnosis: patient?.diagnosis ?? '',
    admittedAt: toDateInput(patient?.admittedAt ?? new Date()),
    doctorId: patient?.doctor?.id ?? doctorId ?? '',
  };
}

/** Create/edit behaviour for the patient form, so the component only renders. */
export function usePatientForm(options: UsePatientFormOptions) {
  const { patient, doctorId, carry, onDone, onSavedAndNext } = options;
  const create = useCreatePatient();
  const update = useUpdatePatient();
  // One key per form mount, and the form remounts for each new patient: patients have no
  // unique field, so this is what stops a retried submit from creating a duplicate.
  const [idempotencyKey] = useState(() => crypto.randomUUID());

  const form = useForm<PatientValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: { ...defaultValues(patient, doctorId), ...carry },
    mode: 'onTouched',
  });
  // Read during render: React Hook Form only tracks the form state a render has asked for.
  const { dirtyFields } = form.formState;

  const save = async (values: PatientValues, addAnother: boolean) => {
    try {
      if (patient) {
        const changes = toPatientChanges(values, dirtyFields);
        if (Object.keys(changes).length > 0) await update.mutateAsync({ id: patient.id, changes });
      } else {
        await create.mutateAsync({
          doctorId: values.doctorId,
          input: toPatientInput(values),
          idempotencyKey,
        });
      }
      if (addAnother && onSavedAndNext) {
        onSavedAndNext({ doctorId: values.doctorId, admittedAt: values.admittedAt });
      } else {
        onDone();
      }
    } catch (error) {
      applyApiErrors(error, form.setError, PATIENT_FIELDS);
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit((values) => save(values, false)),
    onSubmitAnother: form.handleSubmit((values) => save(values, true)),
    isPending: create.isPending || update.isPending,
  };
}
