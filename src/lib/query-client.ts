import { isServer, MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { isApiError } from './api-client';
import { getErrorMessage, isSilentError } from './errors';

declare module '@tanstack/react-query' {
  interface Register {
    mutationMeta: {
      /** Set when the component shows the error itself (e.g. form field errors): no toast. */
      errorHandledLocally?: boolean;
    };
  }
}

function makeQueryClient(): QueryClient {
  return new QueryClient({
    queryCache: new QueryCache({
      // First-load failures are rendered inline by the component (ErrorState). Only toast when
      // stale data is still on screen and a background refetch failed, or the user would miss it.
      onError: (error, query) => {
        if (query.state.data !== undefined && !isSilentError(error)) {
          toast.error(getErrorMessage(error));
        }
      },
    }),
    mutationCache: new MutationCache({
      // The callback signature is TanStack's, not ours.
      // eslint-disable-next-line max-params
      onError: (error, _variables, _onMutateResult, mutation) => {
        if (mutation.meta?.errorHandledLocally || isSilentError(error)) return;
        toast.error(getErrorMessage(error));
      },
    }),
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        refetchOnWindowFocus: false,
        // Retrying a 4xx never helps; retry network/5xx errors twice.
        retry: (failureCount, error) =>
          !(isApiError(error) && error.status >= 400 && error.status < 500) && failureCount < 2,
      },
      mutations: {
        // Never retry automatically: a repeated POST could duplicate data.
        retry: 0,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

/** New client per server request; one shared client in the browser. */
export function getQueryClient(): QueryClient {
  if (isServer) return makeQueryClient();
  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
}
