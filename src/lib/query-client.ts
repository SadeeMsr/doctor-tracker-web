import { isServer, QueryClient } from '@tanstack/react-query';

import { ApiError } from './api-client';

function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        refetchOnWindowFocus: false,
        // Retrying a 4xx never helps; retry network/5xx errors twice.
        retry: (failureCount, error) =>
          !(error instanceof ApiError && error.status < 500) && failureCount < 2,
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
