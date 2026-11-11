import { cn } from '@/lib/cn';

interface BrandMarkProps {
  /** `onBrand`: light wordmark for dark green surfaces. */
  tone?: 'default' | 'onBrand';
  className?: string;
}

/**
 * Logo: a lime tile with a pulse glyph, plus the wordmark.
 * @example <BrandMark tone="onBrand" />
 */
export function BrandMark({ tone = 'default', className }: BrandMarkProps) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <span className="grid size-9 place-items-center rounded-xl bg-accent text-accent-foreground">
        <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden>
          <path
            d="M2 12h4.5l2-5 3.5 10 2.5-7 1.5 2H22"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span
        className={cn(
          'text-[1.05rem] font-semibold tracking-tight',
          tone === 'onBrand' ? 'text-brand-foreground' : 'text-foreground',
        )}
      >
        Doctor<span className="font-light">Tracker</span>
      </span>
    </span>
  );
}
