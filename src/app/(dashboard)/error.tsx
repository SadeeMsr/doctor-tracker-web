'use client';

import { useEffect } from 'react';

import { ErrorState } from '@/components/feedback/error-state';
import { getErrorMessage, getErrorReference } from '@/lib/errors';

interface DashboardErrorProps {
  error: unknown;
  retry: () => void;
}

/** Catches render errors in dashboard pages; the sidebar shell stays usable. */
export default function DashboardError({ error, retry }: DashboardErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorState
      description={getErrorMessage(error)}
      reference={getErrorReference(error)}
      onRetry={retry}
    />
  );
}
