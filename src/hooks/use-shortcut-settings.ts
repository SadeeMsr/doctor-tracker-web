'use client';

import { createContext, useContext } from 'react';

export interface ShortcutSettings {
  /** Single-character shortcuts (`n`, `/`, `g d`…); ⌘/Ctrl combos always work. */
  areCharacterKeysOn: boolean;
  setCharacterKeysOn: (on: boolean) => void;
  isHelpOpen: boolean;
  setHelpOpen: (open: boolean) => void;
  /** The first-visit "Press ? for shortcuts" tip has been closed or used. */
  isHintDismissed: boolean;
  dismissHint: () => void;
}

/**
 * Filled by `ShortcutsProvider`. Outside one (e.g. the login page) shortcuts still work, with no
 * help panel.
 */
export const ShortcutSettingsContext = createContext<ShortcutSettings>({
  areCharacterKeysOn: true,
  setCharacterKeysOn: () => undefined,
  isHelpOpen: false,
  setHelpOpen: () => undefined,
  isHintDismissed: true,
  dismissHint: () => undefined,
});

/**
 * App-wide shortcut settings.
 * @example const { setHelpOpen } = useShortcutSettings();
 */
export function useShortcutSettings(): ShortcutSettings {
  return useContext(ShortcutSettingsContext);
}
