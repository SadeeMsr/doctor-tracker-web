'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { applyApiErrors } from '@/lib/form-errors';

import { useCreateDoctor, useUpdateDoctor } from '../queries';
import { DOCTOR_FIELDS, doctorSchema, type DoctorValues } from '../schemas';
import type { Doctor, DoctorInput } from '../types';

interface UseDoctorFormOptions {
  /** Present when editing; absent when creating. */
  doctor?: Doctor;
  onDone: () => void;
}

/** Create/edit behaviour for the doctor form, so the component only renders. */
export function useDoctorForm({ doctor, onDone }: UseDoctorFormOptions) {
  const create = useCreateDoctor();
  const update = useUpdateDoctor();
  // One key per form session: a resubmit after a timeout can't create a second doctor.
  const [idempotencyKey] = useState(() => crypto.randomUUID());

  const form = useForm<DoctorValues>({
    resolver: zodResolver(doctorSchema),
    defaultValues: {
      name: doctor?.name ?? '',
      specialization: doctor?.specialization,
      hospital: doctor?.hospital ?? '',
      phone: doctor?.phone ?? '',
      email: doctor?.email ?? '',
    },
    mode: 'onTouched',
  });
  // Read during render: React Hook Form only tracks the form state a render has asked for.
  const { dirtyFields } = form.formState;

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      if (doctor) {
        // PATCH carries only what changed, as final values.
        const changes: Partial<DoctorInput> = Object.fromEntries(
          DOCTOR_FIELDS.filter((field) => dirtyFields[field]).map((field) => [
            field,
            values[field],
          ]),
        );
        if (Object.keys(changes).length > 0) await update.mutateAsync({ id: doctor.id, changes });
      } else {
        await create.mutateAsync({ input: values, idempotencyKey });
      }
      onDone();
    } catch (error) {
      applyApiErrors(error, form.setError, DOCTOR_FIELDS);
    }
  });

  return { form, onSubmit, isPending: create.isPending || update.isPending };
}
