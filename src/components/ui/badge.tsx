import type { ComponentProps } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

/**
 * Small status label. The dot repeats the tone, but the text always carries the meaning.
 * @example <Badge tone="critical" hasDot>Critical</Badge>
 */
export const badgeStyles = tv({
  base: 'inline-flex h-6 items-center gap-1.5 rounded-full px-2.5 text-xs font-medium whitespace-nowrap',
  variants: {
    tone: {
      neutral: 'bg-subtle text-foreground',
      brand: 'bg-brand text-brand-foreground',
      accent: 'bg-accent text-accent-foreground',
      outline: 'text-foreground ring-1 ring-border',
      critical: 'bg-status-critical/12 text-status-critical',
      observation: 'bg-status-observation/15 text-foreground',
      stable: 'bg-status-stable/12 text-status-stable',
      recovering: 'bg-status-recovering/12 text-status-recovering',
      discharged: 'bg-status-discharged/15 text-muted-foreground',
    },
  },
  defaultVariants: { tone: 'neutral' },
});

const dotStyles = tv({
  base: 'size-1.5 rounded-full',
  variants: {
    tone: {
      neutral: 'bg-muted-foreground',
      brand: 'bg-accent',
      accent: 'bg-brand',
      outline: 'bg-muted-foreground',
      critical: 'bg-status-critical',
      observation: 'bg-status-observation',
      stable: 'bg-status-stable',
      recovering: 'bg-status-recovering',
      discharged: 'bg-status-discharged',
    },
  },
  defaultVariants: { tone: 'neutral' },
});

type BadgeProps = ComponentProps<'span'> & VariantProps<typeof badgeStyles> & { hasDot?: boolean };

export function Badge({ className, tone, hasDot, children, ...props }: BadgeProps) {
  return (
    <span className={badgeStyles({ tone, className })} {...props}>
      {hasDot && <span className={dotStyles({ tone })} aria-hidden />}
      {children}
    </span>
  );
}
