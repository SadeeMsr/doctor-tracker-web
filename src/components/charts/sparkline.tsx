import { cn } from '@/lib/cn';

const WIDTH = 100;
const HEIGHT = 32;

/**
 * Tiny trend line; decorative, so pair it with the number it illustrates.
 * @example <Sparkline values={[3, 5, 4, 9]} className="h-12 text-accent" />
 */
export function Sparkline({ values, className }: { values: number[]; className?: string }) {
  if (values.length < 2) return null;
  const max = Math.max(...values, 1);
  const step = WIDTH / (values.length - 1);
  const points = values
    .map(
      (value, index) =>
        `${String(index * step)},${String(HEIGHT - (value / max) * (HEIGHT - 4) - 2)}`,
    )
    .join(' ');

  return (
    <svg
      viewBox={`0 0 ${String(WIDTH)} ${String(HEIGHT)}`}
      preserveAspectRatio="none"
      className={cn('w-full', className)}
      aria-hidden
    >
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
