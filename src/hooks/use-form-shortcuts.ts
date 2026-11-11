'use client';

import { SHORTCUTS } from '@/lib/shortcuts';

import { useShortcut } from './use-shortcut';

interface FormShortcutOptions {
  onSubmit: () => unknown;
  /** "Save & add another", when the form offers it. */
  onSubmitAnother?: () => unknown;
  /** No repeat submits while a save is in flight. */
  isPending: boolean;
}

/**
 * ⌘/Ctrl+Enter saves and ⌘/Ctrl+Shift+Enter saves and starts the next record, even while typing
 * in a field. Use inside a dialog form: the dialog unmounts its content when closed, so these
 * only listen while the form is on screen.
 * @example useFormShortcuts({ onSubmit, onSubmitAnother, isPending });
 */
export function useFormShortcuts({ onSubmit, onSubmitAnother, isPending }: FormShortcutOptions) {
  const options = { allowInInput: true, scope: 'any', enabled: !isPending } as const;

  useShortcut(SHORTCUTS.save, () => void onSubmit(), options);
  useShortcut(SHORTCUTS.saveAndAddAnother, () => void onSubmitAnother?.(), {
    ...options,
    enabled: !isPending && onSubmitAnother !== undefined,
  });
}
