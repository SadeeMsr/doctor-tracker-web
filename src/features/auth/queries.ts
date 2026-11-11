import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { authApi } from './api';
import type { LoginInput } from './types';

export const authKeys = {
  all: ['auth'] as const,
  me: () => [...authKeys.all, 'me'] as const,
};

export function useMe() {
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: async () => (await authApi.me()).data,
    staleTime: 5 * 60_000,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: LoginInput) => authApi.login(input),
    // The form shows errors next to the fields; no global toast.
    meta: { errorHandledLocally: true },
    onSuccess: ({ data }) => {
      queryClient.setQueryData(authKeys.me(), data);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => authApi.logout(),
    // Signed out either way from the user's point of view: drop every cached record.
    onSettled: () => {
      queryClient.clear();
    },
  });
}
