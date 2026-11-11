import type { ComponentProps } from 'react';

import { cn } from '@/lib/cn';

/**
 * Loading placeholder; size it with classes to match the content it stands in for.
 * @example <Skeleton className="h-4 w-32" />
 */
export function Skeleton({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div aria-hidden className={cn('animate-pulse rounded-xl bg-subtle', className)} {...props} />
  );
}
