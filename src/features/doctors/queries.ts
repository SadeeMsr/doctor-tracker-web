import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { removeFromLists, restoreLists } from '@/lib/optimistic';
import { QUERY_ROOTS } from '@/lib/query-keys';

import { doctorsApi } from './api';
import type { Doctor, DoctorInput, DoctorListParams } from './types';

export const doctorKeys = {
  all: QUERY_ROOTS.doctors,
  lists: () => [...doctorKeys.all, 'list'] as const,
  list: (params: DoctorListParams) => [...doctorKeys.lists(), params] as const,
  detail: (id: string) => [...doctorKeys.all, 'detail', id] as const,
  hospitals: () => [...doctorKeys.all, 'hospitals'] as const,
};

export function useDoctors(params: DoctorListParams) {
  return useQuery({
    queryKey: doctorKeys.list(params),
    queryFn: ({ signal }) => doctorsApi.list(params, signal),
    placeholderData: keepPreviousData,
  });
}

export function useDoctor(id: string) {
  return useQuery({
    queryKey: doctorKeys.detail(id),
    queryFn: async ({ signal }) => (await doctorsApi.get(id, signal)).data,
  });
}

export function useHospitals() {
  return useQuery({
    queryKey: doctorKeys.hospitals(),
    queryFn: async ({ signal }) => (await doctorsApi.hospitals(signal)).data,
    staleTime: 5 * 60_000,
  });
}

/** Doctor counts feed the dashboard, so both roots go stale together. */
function useInvalidateDoctors() {
  const queryClient = useQueryClient();
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: doctorKeys.all }),
      queryClient.invalidateQueries({ queryKey: QUERY_ROOTS.dashboard }),
    ]);
}

export function useCreateDoctor() {
  const invalidate = useInvalidateDoctors();
  return useMutation({
    mutationFn: ({ input, idempotencyKey }: { input: DoctorInput; idempotencyKey: string }) =>
      doctorsApi.create(input, idempotencyKey),
    meta: { errorHandledLocally: true },
    onSuccess: ({ data }) => {
      toast.success(`${data.name} was added`);
      return invalidate();
    },
  });
}

export function useUpdateDoctor() {
  const invalidate = useInvalidateDoctors();
  return useMutation({
    mutationFn: ({ id, changes }: { id: string; changes: Partial<DoctorInput> }) =>
      doctorsApi.update(id, changes),
    meta: { errorHandledLocally: true },
    onSuccess: ({ data }) => {
      toast.success(`${data.name} was updated`);
      return invalidate();
    },
  });
}

export function useDeleteDoctor() {
  const queryClient = useQueryClient();
  const invalidate = useInvalidateDoctors();
  return useMutation({
    mutationKey: [...doctorKeys.all, 'delete'],
    mutationFn: (doctor: Doctor) => doctorsApi.remove(doctor.id),
    onMutate: (doctor) => removeFromLists<Doctor>(queryClient, doctorKeys.lists(), doctor.id),
    // The global handler toasts the reason (e.g. the doctor still has patients).
    onError: (_error, _doctor, snapshot) => {
      if (snapshot) restoreLists(queryClient, snapshot);
    },
    onSuccess: (_data, doctor) => {
      toast.success(`${doctor.name} was removed`);
    },
    onSettled: () => invalidate(),
  });
}
