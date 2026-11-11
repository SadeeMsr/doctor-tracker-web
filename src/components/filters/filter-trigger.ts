import { tv } from 'tailwind-variants';

/** The pill every filter opens from; filled once the filter is narrowing the list. */
export const filterTriggerStyles = tv({
  base: [
    'inline-flex h-10 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-medium whitespace-nowrap',
    'transition-colors duration-200 [&_svg]:size-4 [&_svg]:shrink-0',
  ],
  variants: {
    isActive: {
      true: 'bg-brand text-brand-foreground',
      false: 'bg-surface text-foreground ring-1 ring-border hover:bg-subtle',
    },
  },
  defaultVariants: { isActive: false },
});
