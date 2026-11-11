'use client';

import { useSyncExternalStore } from 'react';

const subscribe = () => () => undefined;
const isMacClient = () => /Mac|iPhone|iPad/.test(navigator.userAgent);
// The server can't know the platform: render "Ctrl" there, then React swaps in ⌘ after hydrating.
const isMacServer = () => false;

/**
 * Whether ⌘ (rather than Ctrl) is the shortcut modifier on this device.
 * @example const isMac = useIsMac();
 */
export function useIsMac(): boolean {
  return useSyncExternalStore(subscribe, isMacClient, isMacServer);
}
