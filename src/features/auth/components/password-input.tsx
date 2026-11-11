'use client';

import { Eye, EyeOff, LockKeyhole } from 'lucide-react';
import { useState, type ComponentProps } from 'react';

import { Input } from '@/components/ui/input';

/** Password input with a show/hide toggle that keeps focus in the field. */
export function PasswordInput(
  props: Omit<ComponentProps<typeof Input>, 'type' | 'icon' | 'trailing'>,
) {
  const [visible, setVisible] = useState(false);
  const Icon = visible ? EyeOff : Eye;

  return (
    <Input
      {...props}
      type={visible ? 'text' : 'password'}
      icon={<LockKeyhole />}
      // Revealed passwords read better in a monospace face with a slashed zero: equal widths,
      // and 0/O and 1/l/I can't be confused.
      inputClassName={
        visible ? 'font-mono tracking-[0.02em] [font-variant-numeric:slashed-zero]' : undefined
      }
      trailing={
        <button
          type="button"
          onClick={() => setVisible((value) => !value)}
          onMouseDown={(event) => event.preventDefault()}
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
          className="grid size-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-subtle hover:text-foreground"
        >
          <Icon className="size-[1.1rem]" />
        </button>
      }
    />
  );
}
