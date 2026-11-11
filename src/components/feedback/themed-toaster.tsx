'use client';

import { useTheme } from 'next-themes';
import { Toaster } from 'sonner';

/**
 * Sonner toaster that follows the app theme instead of the OS setting.
 * @example <ThemedToaster />
 */
export function ThemedToaster() {
  const { resolvedTheme } = useTheme();

  return (
    <Toaster
      theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
      richColors
      closeButton
      position="top-right"
    />
  );
}
