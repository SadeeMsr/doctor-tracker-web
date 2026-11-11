import { tv, type VariantProps } from 'tailwind-variants';

import { initials } from '@/lib/format';

const TONES = ['lime', 'green', 'sage', 'gold', 'sand'] as const;

const avatarStyles = tv({
  base: 'grid shrink-0 place-items-center rounded-full font-semibold select-none',
  variants: {
    tone: {
      lime: 'bg-accent text-accent-foreground',
      green: 'bg-brand text-brand-foreground',
      sage: 'bg-chart-3 text-brand-foreground',
      gold: 'bg-chart-4 text-foreground',
      sand: 'bg-chart-5 text-foreground',
    },
    size: { sm: 'size-8 text-xs', md: 'size-10 text-sm', lg: 'size-16 text-xl' },
  },
  defaultVariants: { size: 'md' },
});

/** The same name always gets the same colour, so people stay recognisable across pages. */
function toneFor(name: string) {
  let hash = 0;
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) % 997;
  return TONES[hash % TONES.length] ?? 'lime';
}

interface AvatarProps extends Pick<VariantProps<typeof avatarStyles>, 'size'> {
  name: string;
  /** Overrides the colour picked from the name. */
  tone?: (typeof TONES)[number];
  className?: string;
}

/**
 * Initials avatar; decorative, since the name is always printed next to it.
 * @example <Avatar name="Ayesha Rahman" size="sm" />
 */
export function Avatar({ name, size, tone, className }: AvatarProps) {
  return (
    <span aria-hidden className={avatarStyles({ tone: tone ?? toneFor(name), size, className })}>
      {initials(name)}
    </span>
  );
}
