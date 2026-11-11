import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

interface FieldProps {
  /** Must match the control's `id`. */
  htmlFor: string;
  label: string;
  error?: string;
  /** Rendered next to the label, e.g. a "Forgot password?" link. */
  aside?: ReactNode;
  className?: string;
  children: ReactNode;
}

export const fieldErrorId = (id: string) => `${id}-error`;

/**
 * Label + control + error, accessibly linked. The control sets
 * `aria-describedby={fieldErrorId(id)}` and `aria-invalid`.
 */
export function Field({ htmlFor, label, error, aside, className, children }: FieldProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-baseline justify-between">
        <label htmlFor={htmlFor} className="text-[0.82rem] font-medium text-foreground">
          {label}
        </label>
        {aside}
      </div>
      {children}
      <p
        id={fieldErrorId(htmlFor)}
        role={error ? 'alert' : undefined}
        className={cn('min-h-4 pt-0.5 text-xs leading-4 text-danger', !error && 'invisible')}
      >
        {error ?? ' '}
      </p>
    </div>
  );
}
