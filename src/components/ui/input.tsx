import type { ComponentProps, ReactNode } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

export const inputStyles = tv({
  slots: {
    wrapper: [
      // --input-bg is shared with the input, so autofill can be repainted in the same colour.
      'group/input relative flex items-center rounded-2xl bg-(--input-bg) [--input-bg:var(--surface)]',
      'shadow-xs ring-1 ring-border transition-[box-shadow] duration-200 hover:ring-brand-ink/30',
      'focus-within:shadow-focus focus-within:ring-brand-ink',
      'has-[input[aria-invalid=true]]:ring-danger',
      'has-[input[aria-invalid=true]]:focus-within:shadow-focus-danger',
    ],
    icon: [
      'pointer-events-none absolute left-4 text-muted-foreground transition-colors',
      'group-focus-within/input:text-brand-ink [&_svg]:size-[1.1rem]',
    ],
    input: [
      'peer h-full w-full rounded-[inherit] bg-transparent text-[0.95rem] text-foreground outline-none',
      // Browsers paint autofilled fields with their own colours; cover that with ours.
      'autofill:shadow-[inset_0_0_0_100px_var(--input-bg)] autofill:[-webkit-text-fill-color:var(--foreground)]',
      'autofill:[caret-color:var(--foreground)]',
      'placeholder:text-muted-foreground/70 disabled:cursor-not-allowed disabled:opacity-60',
    ],
    trailing: 'absolute right-2 flex items-center',
  },
  variants: {
    size: {
      md: { wrapper: 'h-11', input: 'px-4' },
      lg: { wrapper: 'h-14', input: 'px-5' },
    },
    hasIcon: { true: { input: 'pl-11' } },
    hasTrailing: { true: { input: 'pr-12' } },
  },
  defaultVariants: { size: 'md' },
});

type InputProps = Omit<ComponentProps<'input'>, 'size'> &
  Pick<VariantProps<typeof inputStyles>, 'size'> & {
    icon?: ReactNode;
    /** e.g. a show/hide password toggle. */
    trailing?: ReactNode;
    /** Classes for the `<input>` itself (`className` styles the wrapper). */
    inputClassName?: string;
  };

/**
 * Text input with optional leading icon and trailing slot.
 * @example <Input icon={<Mail />} type="email" aria-invalid={!!error} />
 */
export function Input({ className, inputClassName, size, icon, trailing, ...props }: InputProps) {
  const styles = inputStyles({ size, hasIcon: Boolean(icon), hasTrailing: Boolean(trailing) });
  return (
    <div className={styles.wrapper({ className })}>
      {icon && <span className={styles.icon()}>{icon}</span>}
      <input className={styles.input({ className: inputClassName })} {...props} />
      {trailing && <span className={styles.trailing()}>{trailing}</span>}
    </div>
  );
}
