import { AlertTriangle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/cn';

interface ErrorStateProps {
  title?: string;
  description: string;
  /** Request id or digest the user can quote to support; matches a server log line. */
  reference?: string;
  onRetry?: () => void;
  className?: string;
}

/**
 * Inline replacement for content that failed to load.
 * @example <ErrorState description={getErrorMessage(error)} reference={getErrorReference(error)} onRetry={refetch} />
 */
export function ErrorState({
  title = 'Something went wrong',
  description,
  reference,
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        'mx-auto flex max-w-md flex-col items-center gap-3 px-4 py-16 text-center',
        className,
      )}
    >
      <span className="grid size-12 place-items-center rounded-full bg-danger/10 text-danger">
        <AlertTriangle className="size-6" aria-hidden />
      </span>
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      <p className="text-sm text-muted-foreground">{description}</p>
      {reference && (
        <p className="font-mono text-xs text-muted-foreground">Reference: {reference}</p>
      )}
      {onRetry && (
        <Button variant="secondary" onClick={onRetry} className="mt-2">
          Try again
        </Button>
      )}
    </div>
  );
}
