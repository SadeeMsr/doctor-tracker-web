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
        'block w-full resize-none rounded-2xl bg-canvas-soft px-4 py-3 text-[0.95rem] text-foreground',
        'ring-1 ring-transparent transition-[box-shadow,background-color] duration-200 outline-none',
        'placeholder:text-muted-foreground/70 focus:bg-surface focus:ring-2 focus:ring-brand',
        'aria-invalid:ring-2 aria-invalid:ring-danger',
        className,
      )}
      {...props}
    />
  );
}
