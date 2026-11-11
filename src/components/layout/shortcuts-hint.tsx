'use client';

import { X } from 'lucide-react';

import { KeyCombo } from '@/components/ui/kbd';
import { useShortcutSettings } from '@/hooks/use-shortcut-settings';
import { cn } from '@/lib/cn';
import { SHORTCUTS } from '@/lib/shortcuts';

/**
 * First-visit introduction to the shortcuts: "Press ? for keyboard shortcuts". Gone for good once
 * dismissed or once the help panel has been opened. Show it on desktop only: phones have no keys.
 * @example <ShortcutsHint className="flex" />
 */
export function ShortcutsHint({ className }: { className?: string }) {
  const { setHelpOpen, isHintDismissed, dismissHint, areCharacterKeysOn } = useShortcutSettings();

  if (isHintDismissed || !areCharacterKeysOn) return null;

  return (
    <div
      className={cn(
        'animate-rise items-center gap-1 rounded-full bg-surface py-1 pr-1 pl-3 text-sm shadow-sm ring-1 ring-border',
        className,
      )}
    >
      <button
        type="button"
        onClick={() => setHelpOpen(true)}
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
      >
        Press <KeyCombo combo={SHORTCUTS.help} /> for keyboard shortcuts
      </button>
      <button
        type="button"
        onClick={dismissHint}
        aria-label="Dismiss the shortcuts tip"
        className="grid size-7 place-items-center rounded-full text-muted-foreground hover:bg-subtle hover:text-foreground"
      >
        <X className="size-3.5" aria-hidden />
      </button>
    </div>
  );
}
