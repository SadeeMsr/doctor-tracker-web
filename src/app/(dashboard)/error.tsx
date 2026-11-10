'use client';

import { Button } from '@/components/ui/button';

export default function DashboardError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div role="alert" className="mx-auto max-w-md space-y-4 py-16 text-center">
      <h2 className="text-lg font-semibold">Something went wrong</h2>
      <p className="text-sm text-muted-foreground">{error.message}</p>
      <Button variant="secondary" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
