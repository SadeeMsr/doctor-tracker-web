import type { ComponentProps } from 'react';

import { cn } from '@/lib/cn';

/**
 * Multi-line input styled like `Input`.
 * @example <Textarea id="diagnosis" rows={3} aria-invalid={!!error} />
 */
export function Textarea({ className, ...props }: ComponentProps<'textarea'>) {
  return (
    <textarea
      className={cn(
        'block w-full resize-none rounded-2xl bg-surface px-4 py-3 text-[0.95rem] text-foreground',
        'shadow-xs ring-1 ring-border transition-[box-shadow] duration-200 outline-none',
        'placeholder:text-muted-foreground/70 hover:ring-brand-ink/30 focus:shadow-focus focus:ring-brand-ink',
        'aria-invalid:ring-danger aria-invalid:focus:shadow-focus-danger',
        className,
      )}
      {...props}
    />
  );
}
