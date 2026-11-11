import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, type RenderOptions } from '@testing-library/react';
import { NuqsTestingAdapter, type UrlUpdateEvent } from 'nuqs/adapters/testing';
import type { ReactElement, ReactNode } from 'react';

interface ProviderOptions {
  /** Initial URL query, e.g. `?specialization=Cardiology`. */
  searchParams?: string;
  /** Called with every URL change the component makes (filters, pagination…). */
  onUrlUpdate?: (event: UrlUpdateEvent) => void;
}

/**
 * Renders with the app's data providers: a fresh TanStack Query client (no retries, so failures
 * show at once) and nuqs URL state backed by memory instead of the browser.
 * @example const { user } = renderWithProviders(<DoctorForm … />);
 */
export function renderWithProviders(
  ui: ReactElement,
  { searchParams = '', onUrlUpdate, ...options }: ProviderOptions & RenderOptions = {},
) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  function Providers({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <NuqsTestingAdapter searchParams={searchParams} onUrlUpdate={onUrlUpdate}>
          {children}
        </NuqsTestingAdapter>
      </QueryClientProvider>
    );
  }

  return { queryClient, ...render(ui, { wrapper: Providers, ...options }) };
}
