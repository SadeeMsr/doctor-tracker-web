import { api } from '@/lib/api-client';
import { ignoreNotFound, retryWhileInProgress } from '@/lib/idempotent';
import type { Paginated, Single } from '@/lib/types';

import type { Doctor, DoctorInput, DoctorListParams } from './types';

export const doctorsApi = {
  list: (params: DoctorListParams, signal: AbortSignal) =>
    api.get<Paginated<Doctor>>('/doctors', params, { signal }),
  hospitals: (signal: AbortSignal) =>
    api.get<Single<string[]>>('/doctors/hospitals', undefined, { signal }),
  get: (id: string, signal: AbortSignal) =>
    api.get<Single<Doctor>>(`/doctors/${id}`, undefined, { signal }),
  create: (input: DoctorInput, idempotencyKey: string) =>
    retryWhileInProgress(() => api.post<Single<Doctor>>('/doctors', input, { idempotencyKey })),
  update: (id: string, changes: Partial<DoctorInput>) =>
    api.patch<Single<Doctor>>(`/doctors/${id}`, changes),
  remove: (id: string) => ignoreNotFound(api.delete(`/doctors/${id}`)),
};
