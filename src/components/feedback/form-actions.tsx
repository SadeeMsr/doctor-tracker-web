import { CircleAlert } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';

interface FormActionsProps {
  /** Form-level error (not tied to a field); shown above the buttons. */
  error?: string;
  isPending: boolean;
  submitLabel: string;
  onCancel: () => void;
}

/**
 * Footer of a dialog form: the form-level error, then Cancel and a submit that can't
 * double-fire. Render it inside the `<form>`, after `DialogBody`.
 * @example <FormActions error={errors.root?.message} isPending={isPending} submitLabel="Save" onCancel={close} />
 */
export function FormActions({ error, isPending, submitLabel, onCancel }: FormActionsProps) {
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
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button variant="ghost" onClick={onCancel} disabled={isPending}>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending} className="sm:min-w-36">
          {isPending && <Spinner label="Saving" />}
          {submitLabel}
        </Button>
      </div>
    </DialogFooter>
  );
}
