import type { ComponentProps } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

/**
 * Content panel on the canvas.
 * @example <Card tone="brand" className="p-6">…</Card>
 */
export const cardStyles = tv({
  base: 'rounded-3xl',
  variants: {
    tone: {
      surface: 'bg-surface text-surface-foreground ring-1 ring-border',
      brand: 'bg-brand text-brand-foreground',
      accent: 'bg-accent text-accent-foreground',
    },
  },
  defaultVariants: { tone: 'surface' },
});

type CardProps = ComponentProps<'div'> & VariantProps<typeof cardStyles>;

export function Card({ className, tone, ...props }: CardProps) {
  return <div className={cardStyles({ tone, className })} {...props} />;
}
