import { Fieldset as BaseFieldset } from '@base-ui/react/fieldset';
import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

interface FieldsetProps {
  legend: string;
  className?: string;
  children: ReactNode;
}

/**
 * A labelled group of form fields on a two-column grid (one column on phones).
 * @example <Fieldset legend="Contact"><Field …/><Field …/></Fieldset>
 */
export function Fieldset({ legend, className, children }: FieldsetProps) {
  return (
    <BaseFieldset.Root className={cn('grid gap-x-5 gap-y-2 sm:grid-cols-2', className)}>
      <BaseFieldset.Legend className="mb-4 flex items-center gap-3 font-mono text-[0.68rem] tracking-[0.18em] text-muted-foreground uppercase after:h-px after:flex-1 after:bg-border sm:col-span-2">
        {legend}
      </BaseFieldset.Legend>
      {children}
    </BaseFieldset.Root>
  );
}
