import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface ClearFiltersButtonProps {
  /** How many filters are active; the button hides at zero. */
  count: number;
  onClear: () => void;
}

/**
 * Resets every filter at once, and says how many are on.
 * @example <ClearFiltersButton count={state.activeCount} onClear={state.reset} />
 */
export function ClearFiltersButton({ count, onClear }: ClearFiltersButtonProps) {
  if (count === 0) return null;

  return (
    <Button variant="secondary" size="sm" onClick={onClear} className="h-10 text-danger">
      <X aria-hidden />
      Clear all
      <span className="grid size-5 place-items-center rounded-full bg-danger/12 text-xs tabular-nums">
        {count}
      </span>
      <span className="sr-only"> filters</span>
    </Button>
  );
}
