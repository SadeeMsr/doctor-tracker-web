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

interface UsePatientFormOptions {
  /** Present when editing. */
  patient?: Patient;
  /** The doctor a new patient is added under. */
  doctorId?: string;
  onDone: () => void;
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
export function usePatientForm({ patient, doctorId, onDone }: UsePatientFormOptions) {
  const create = useCreatePatient();
  const update = useUpdatePatient();
  // One key per form session: patients have no unique field, so this is the duplicate guard.
  const [idempotencyKey] = useState(() => crypto.randomUUID());

  const form = useForm<PatientValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: defaultValues(patient, doctorId),
    mode: 'onTouched',
  });
  // Read during render: React Hook Form only tracks the form state a render has asked for.
  const { dirtyFields } = form.formState;

  const onSubmit = form.handleSubmit(async (values) => {
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
      onDone();
    } catch (error) {
      applyApiErrors(error, form.setError, PATIENT_FIELDS);
    }
  });

  return { form, onSubmit, isPending: create.isPending || update.isPending };
}
