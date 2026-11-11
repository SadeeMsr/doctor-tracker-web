import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { removeFromLists, restoreLists } from '@/lib/optimistic';
import { QUERY_ROOTS } from '@/lib/query-keys';

import { patientsApi } from './api';
import type { Patient, PatientChanges, PatientInput, PatientListParams } from './types';

export const patientKeys = {
  all: QUERY_ROOTS.patients,
  lists: () => [...patientKeys.all, 'list'] as const,
  list: (doctorId: string | null, params: PatientListParams) =>
    [...patientKeys.lists(), doctorId, params] as const,
  // Under the doctors root, so adding or renaming a doctor refreshes the picker.
  doctorOptions: () => [...QUERY_ROOTS.doctors, 'options'] as const,
};

export function usePatients(doctorId: string | null, params: PatientListParams) {
  return useQuery({
    queryKey: patientKeys.list(doctorId, params),
    queryFn: ({ signal }) => patientsApi.list(doctorId, params, signal),
    placeholderData: keepPreviousData,
  });
}

export function useDoctorOptions() {
  return useQuery({
    queryKey: patientKeys.doctorOptions(),
    queryFn: ({ signal }) => patientsApi.doctorOptions(signal),
    staleTime: 5 * 60_000,
  });
}

/** A patient change also moves doctor caseloads and every dashboard number. */
function useInvalidatePatients() {
  const queryClient = useQueryClient();
  return () =>
    Promise.all(
      Object.values(QUERY_ROOTS).map((queryKey) => queryClient.invalidateQueries({ queryKey })),
    );
}

interface CreateVariables {
  doctorId: string;
  input: PatientInput;
  idempotencyKey: string;
}

export function useCreatePatient() {
  const invalidate = useInvalidatePatients();
  return useMutation({
    mutationFn: ({ doctorId, input, idempotencyKey }: CreateVariables) =>
      patientsApi.create(doctorId, input, idempotencyKey),
    meta: { errorHandledLocally: true },
    onSuccess: ({ data }) => {
      toast.success(`${data.name} was added`);
      return invalidate();
    },
  });
}

export function useUpdatePatient() {
  const invalidate = useInvalidatePatients();
  return useMutation({
    mutationFn: ({ id, changes }: { id: string; changes: PatientChanges }) =>
      patientsApi.update(id, changes),
    meta: { errorHandledLocally: true },
    onSuccess: ({ data }) => {
      toast.success(`${data.name} was updated`);
      return invalidate();
    },
  });
}

/** Optimistic: the row disappears at once and comes back if the API refuses. */
export function useDeletePatient(doctorId: string | null) {
  const queryClient = useQueryClient();
  const invalidate = useInvalidatePatients();
  return useMutation({
    mutationKey: [...patientKeys.all, 'delete'],
    mutationFn: (patient: Patient) => patientsApi.remove(patient.id, doctorId),
    onMutate: (patient) => removeFromLists<Patient>(queryClient, patientKeys.lists(), patient.id),
    onError: (_error, _patient, snapshot) => {
      if (snapshot) restoreLists(queryClient, snapshot);
    },
    onSuccess: (_data, patient) => {
      toast.success(`${patient.name} was removed`);
    },
    onSettled: () => invalidate(),
  });
}
