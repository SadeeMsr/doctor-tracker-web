import { api } from '@/lib/api-client';
import { ignoreNotFound, retryWhileInProgress } from '@/lib/idempotent';
import type { Paginated, Single } from '@/lib/types';

import { DOCTOR_OPTIONS_LIMIT } from './constants';
import type {
  DoctorOption,
  Patient,
  PatientChanges,
  PatientInput,
  PatientListParams,
} from './types';

/** A list is either every patient or one doctor's patients. */
const listPath = (doctorId: string | null) =>
  doctorId ? `/doctors/${doctorId}/patients` : '/patients';

export const patientsApi = {
  list: (doctorId: string | null, params: PatientListParams, signal: AbortSignal) =>
    api.get<Paginated<Patient>>(listPath(doctorId), params, { signal }),
  create: (doctorId: string, input: PatientInput, idempotencyKey: string) =>
    retryWhileInProgress(() =>
      api.post<Single<Patient>>(`/doctors/${doctorId}/patients`, input, { idempotencyKey }),
    ),
  update: (id: string, changes: PatientChanges) =>
    api.patch<Single<Patient>>(`/patients/${id}`, changes),
  /** From a doctor's list, the delete is scoped to that doctor. */
  remove: (id: string, doctorId: string | null) =>
    ignoreNotFound(
      api.delete(doctorId ? `/doctors/${doctorId}/patients/${id}` : `/patients/${id}`),
    ),
  /** Doctors to reassign a patient to, by name. */
  doctorOptions: async (signal: AbortSignal): Promise<DoctorOption[]> => {
    const page = await api.get<Paginated<{ id: string; name: string; specialization: string }>>(
      '/doctors',
      { limit: DOCTOR_OPTIONS_LIMIT, sortBy: 'name', sortOrder: 'asc' },
      { signal },
    );
    return page.data.map((doctor) => ({
      value: doctor.id,
      label: `${doctor.name} · ${doctor.specialization}`,
    }));
  },
};
