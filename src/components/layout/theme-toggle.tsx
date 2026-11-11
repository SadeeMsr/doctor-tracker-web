'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { buttonStyles } from '@/components/ui/button';
import { cn } from '@/lib/cn';
import { ariaKeyShortcut, SHORTCUTS } from '@/lib/shortcuts';

/**
 * Switches between the light and dark theme; the choice is remembered. Until the user picks,
 * the app follows the system setting. Both icons are rendered and CSS shows the right one, so
 * the server and client markup match before the theme is known.
 * @example <ThemeToggle className="absolute top-4 right-4" />
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      aria-label="Toggle dark mode"
      title="Toggle dark mode (Shift+T)"
      aria-keyshortcuts={ariaKeyShortcut(SHORTCUTS.toggleTheme)}
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className={cn(buttonStyles({ variant: 'secondary', size: 'icon' }), className)}
    >
      <Moon className="dark:hidden" aria-hidden />
      <Sun className="hidden text-accent dark:block" aria-hidden />
    </button>
  );
}
