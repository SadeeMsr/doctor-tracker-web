import type { ComponentProps } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

/**
 * Pill buttons. Variants via `tv()` (styled-components ergonomics, zero runtime CSS-in-JS).
 * @example <Button variant="brand" size="lg">Save</Button>
 */
export const buttonStyles = tv({
  base: [
    'group/button relative inline-flex shrink-0 items-center justify-center gap-2 rounded-full',
    'font-medium whitespace-nowrap select-none',
    'transition-[background-color,color,box-shadow,transform] duration-200 ease-out',
    'active:scale-[0.98] disabled:pointer-events-none disabled:opacity-55',
    '[&_svg]:size-4 [&_svg]:shrink-0',
  ],
  variants: {
    variant: {
      brand: 'bg-brand text-brand-foreground shadow-sm hover:bg-brand-strong',
      accent: 'bg-accent text-accent-foreground hover:brightness-95',
      secondary: 'bg-surface text-foreground shadow-sm ring-1 ring-border hover:bg-subtle',
      ghost: 'text-foreground hover:bg-subtle',
      danger: 'bg-danger text-danger-foreground shadow-sm hover:brightness-110',
    },
    size: {
      sm: 'h-9 px-4 text-sm',
      md: 'h-11 px-5 text-sm',
      lg: 'h-13 px-6 text-[0.95rem]',
      icon: 'size-10',
    },
  },
  defaultVariants: { variant: 'brand', size: 'md' },
});

export type ButtonProps = ComponentProps<'button'> & VariantProps<typeof buttonStyles>;

export function Button({ className, variant, size, type = 'button', ...props }: ButtonProps) {
  return <button type={type} className={buttonStyles({ variant, size, className })} {...props} />;
}
