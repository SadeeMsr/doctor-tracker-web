import { CircleAlert } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/cn';

interface FormActionsProps {
  /** Form-level error (not tied to a field); shown above the buttons. */
  error?: string;
  isPending: boolean;
  submitLabel: string;
  onCancel: () => void;
  className?: string;
}

/**
 * Foot of a dialog form: the form-level error, then Cancel and a submit that can't double-fire.
 * @example <FormActions error={errors.root?.message} isPending={isPending} submitLabel="Save" onCancel={close} />
 */
export function FormActions({
  error,
  isPending,
  submitLabel,
  onCancel,
  className,
}: FormActionsProps) {
  return (
    <div className={cn('space-y-4 pt-2', className)}>
      {error && (
        <p
          role="alert"
          className="flex items-start gap-3 rounded-2xl bg-danger/8 px-4 py-3 text-sm text-danger ring-1 ring-danger/20"
        >
          <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
          {error}
        </p>
      )}
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={onCancel} disabled={isPending}>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending && <Spinner label="Saving" />}
          {submitLabel}
        </Button>
      </div>
    </div>
  );
}
