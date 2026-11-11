import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ariaKeyShortcut, SHORTCUTS } from '@/lib/shortcuts';

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
    <Button
      variant="secondary"
      size="sm"
      onClick={onClear}
      title="Clear all filters (Shift+X)"
      aria-keyshortcuts={ariaKeyShortcut(SHORTCUTS.clearFilters)}
      className="h-10 text-danger"
    >
      <X aria-hidden />
      {/* Explicit spaces keep the accessible name "Clear all 3 filters". */}
      Clear all{' '}
      <span className="grid size-5 place-items-center rounded-full bg-danger/12 text-xs tabular-nums">
        {count}
      </span>{' '}
      <span className="sr-only">filters</span>
    </Button>
  );
}
