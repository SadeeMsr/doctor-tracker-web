'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from 'next-themes';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import type { ReactNode } from 'react';
import { Toaster } from 'sonner';

import { getQueryClient } from '@/lib/query-client';

export function Providers({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <QueryClientProvider client={queryClient}>
        <NuqsAdapter>{children}</NuqsAdapter>
        <Toaster richColors closeButton position="top-right" />
        <ReactQueryDevtools buttonPosition="bottom-left" />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
