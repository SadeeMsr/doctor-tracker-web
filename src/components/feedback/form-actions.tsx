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

/** Sticks to the bottom of the dialog's scroll area; fields fade out as they scroll under it. */
const stickyFooter = [
  'sticky bottom-0 z-10 bg-surface pt-4 pb-2',
  'before:pointer-events-none before:absolute before:inset-x-0 before:bottom-full before:h-6',
  'before:bg-linear-to-t before:from-surface before:to-transparent',
];

/**
 * Foot of a dialog form: the form-level error, then Cancel and a submit that can't double-fire.
 * Stays visible while a long form scrolls.
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
    <div className={cn('space-y-4', stickyFooter, className)}>
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
