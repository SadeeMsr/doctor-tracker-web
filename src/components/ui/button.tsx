import type { ComponentProps } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

/**
 * Variant-driven styling (styled-components ergonomics, zero runtime CSS-in-JS).
 * Other primitives follow the same pattern.
 */
export const buttonStyles = tv({
  base: [
    'inline-flex shrink-0 items-center justify-center gap-2 rounded-md font-medium whitespace-nowrap',
    'transition-colors select-none disabled:pointer-events-none disabled:opacity-50',
    '[&_svg]:size-4 [&_svg]:shrink-0',
  ],
  variants: {
    variant: {
      primary: 'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90',
      secondary: 'border bg-surface text-surface-foreground shadow-sm hover:bg-muted',
      ghost: 'text-foreground hover:bg-muted',
      danger: 'bg-danger text-danger-foreground shadow-sm hover:bg-danger/90',
    },
    size: {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 text-sm',
      lg: 'h-11 px-6 text-base',
      icon: 'size-9',
    },
  },
  defaultVariants: { variant: 'primary', size: 'md' },
});

export type ButtonProps = ComponentProps<'button'> & VariantProps<typeof buttonStyles>;

export function Button({ className, variant, size, type = 'button', ...props }: ButtonProps) {
  return <button type={type} className={buttonStyles({ variant, size, className })} {...props} />;
}
