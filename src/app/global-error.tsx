'use client';

import { useEffect } from 'react';

import { getErrorReference } from '@/lib/errors';

import './globals.css';

interface GlobalErrorProps {
  error: unknown;
  retry: () => void;
}

/**
 * Last resort when the root layout itself fails. It replaces the whole document, so it renders
 * its own <html>/<body> and deliberately depends on nothing that might be what broke
 * (no providers, fonts or shared components).
 */
export default function GlobalError({ error, retry }: GlobalErrorProps) {
  const reference = getErrorReference(error);

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="grid min-h-dvh place-items-center bg-canvas p-4 font-sans text-foreground">
        <title>Something went wrong · Doctor Tracker</title>
        <main role="alert" className="max-w-md space-y-3 text-center">
          <h1 className="text-xl font-semibold tracking-tight">Doctor Tracker is unavailable</h1>
          <p className="text-sm text-muted-foreground">
            An unexpected error stopped the app from loading. Please try again.
          </p>
          {reference && (
            <p className="font-mono text-xs text-muted-foreground">Reference: {reference}</p>
          )}
          <button
            type="button"
            onClick={retry}
            className="mt-2 h-10 rounded-md bg-brand px-4 text-sm font-medium text-brand-foreground"
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
