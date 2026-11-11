'use client';

import { useState, type ReactNode } from 'react';

import { ShortcutSettingsContext } from '@/hooks/use-shortcut-settings';
import { useStoredFlag } from '@/hooks/use-stored-flag';

/**
 * App-wide shortcut settings: whether single-key shortcuts are on (remembered per browser, so
 * screen reader and voice control users can turn them off), the help panel's open state, and the
 * first-visit tip, which retires once the panel has been opened.
 * @example <ShortcutsProvider>{children}</ShortcutsProvider>
 */
export function ShortcutsProvider({ children }: { children: ReactNode }) {
  const [areCharacterKeysOn, setCharacterKeysOn] = useStoredFlag('dt-character-shortcuts', true);
  const [isHintDismissed, dismissHint] = useStoredFlag('dt-shortcuts-hint-dismissed', false);
  const [isHelpOpen, setOpen] = useState(false);

  const setHelpOpen = (open: boolean) => {
    if (open) dismissHint(true);
    setOpen(open);
  };

  return (
    <ShortcutSettingsContext
      value={{
        areCharacterKeysOn,
        setCharacterKeysOn,
        isHelpOpen,
        setHelpOpen,
        isHintDismissed,
        dismissHint: () => dismissHint(true),
      }}
    >
      {children}
    </ShortcutSettingsContext>
  );
}
