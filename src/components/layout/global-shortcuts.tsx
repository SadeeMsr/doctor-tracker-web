'use client';

import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';

import { useShortcut } from '@/hooks/use-shortcut';
import { useShortcutSettings } from '@/hooks/use-shortcut-settings';
import { SHORTCUTS } from '@/lib/shortcuts';

/** Focuses the current page's search box, whichever list it belongs to. */
function focusSearch() {
  document.querySelector<HTMLInputElement>('main input[type="search"]')?.focus();
}

/** App-wide shortcuts: help, navigation, search and theme. Renders nothing. */
export function GlobalShortcuts() {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const { setHelpOpen } = useShortcutSettings();

  useShortcut(SHORTCUTS.help, () => setHelpOpen(true));
  useShortcut(SHORTCUTS.goDashboard, () => router.push('/'));
  useShortcut(SHORTCUTS.goDoctors, () => router.push('/doctors'));
  useShortcut(SHORTCUTS.goPatients, () => router.push('/patients'));
  useShortcut(SHORTCUTS.search, focusSearch);
  useShortcut(SHORTCUTS.toggleTheme, () => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark'));

  return null;
}
