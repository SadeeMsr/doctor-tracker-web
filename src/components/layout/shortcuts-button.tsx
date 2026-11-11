'use client';

import { Keyboard } from 'lucide-react';

import { buttonStyles } from '@/components/ui/button';
import { useShortcutSettings } from '@/hooks/use-shortcut-settings';
import { cn } from '@/lib/cn';
import { ariaKeyShortcut, SHORTCUTS } from '@/lib/shortcuts';

/**
 * Always-visible way into the shortcuts panel, for people who never press `?`.
 * @example <ShortcutsButton />
 */
export function ShortcutsButton({ className }: { className?: string }) {
  const { setHelpOpen } = useShortcutSettings();

  return (
    <button
      type="button"
      aria-label="Keyboard shortcuts"
      title="Keyboard shortcuts (?)"
      aria-keyshortcuts={ariaKeyShortcut(SHORTCUTS.help)}
      onClick={() => setHelpOpen(true)}
      className={cn(buttonStyles({ variant: 'secondary', size: 'icon' }), className)}
    >
      <Keyboard aria-hidden />
    </button>
  );
}
