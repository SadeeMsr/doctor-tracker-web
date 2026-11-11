import { CircleAlert, CircleCheck } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';

interface FormActionsProps {
  /** Form-level error (not tied to a field); shown above the buttons. */
  error?: string;
  /** A short success status, e.g. "3 added so far"; announced politely. */
  note?: string;
  isPending: boolean;
  submitLabel: string;
  onCancel: () => void;
  /** Optional second way to submit, e.g. "Save & add another". */
  secondaryLabel?: string;
  onSecondary?: () => void;
}

/**
 * Footer of a dialog form: the form-level error or status, then Cancel, an optional secondary
 * submit and a submit that can't double-fire. Render it inside the `<form>`, after `DialogBody`.
 * @example <FormActions error={errors.root?.message} isPending={isPending} submitLabel="Save" onCancel={close} />
 */
export function FormActions({
  error,
  note,
  isPending,
  submitLabel,
  onCancel,
  secondaryLabel,
  onSecondary,
}: FormActionsProps) {
  return (
    <DialogFooter>
      {error && (
        <p
          role="alert"
          className="flex items-start gap-3 rounded-2xl bg-danger/8 px-4 py-3 text-sm text-danger ring-1 ring-danger/20"
        >
          <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
          {error}
        </p>
      )}
      {note && !error && (
        <p
          aria-live="polite"
          className="flex items-center gap-2 text-sm text-muted-foreground [&_svg]:text-status-stable"
        >
          <CircleCheck className="size-4 shrink-0" aria-hidden />
          {note}
        </p>
      )}
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">
        <Button variant="ghost" onClick={onCancel} disabled={isPending}>
          {note ? 'Done' : 'Cancel'}
        </Button>
        {secondaryLabel && onSecondary && (
          <Button variant="secondary" onClick={onSecondary} disabled={isPending}>
            {secondaryLabel}
          </Button>
        )}
        <Button type="submit" disabled={isPending} className="sm:min-w-36">
          {isPending && <Spinner label="Saving" />}
          {submitLabel}
        </Button>
      </div>
    </DialogFooter>
  );
}
