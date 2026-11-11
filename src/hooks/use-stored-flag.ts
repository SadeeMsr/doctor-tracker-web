'use client';

import { useSyncExternalStore } from 'react';

const CHANGE_EVENT = 'dt-stored-flag-change';

function read(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    // Storage blocked (private mode, policy): behave as if nothing was stored.
    return null;
  }
}

function subscribe(onChange: () => void) {
  // `storage` covers other tabs; the custom event covers this one.
  window.addEventListener('storage', onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener('storage', onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

/**
 * A per-browser on/off preference in localStorage (a convenience, never anything sensitive).
 * The server and the first client render use `fallback`, so hydration always matches.
 * @example const [isDismissed, setDismissed] = useStoredFlag('dt-tip-dismissed', false);
 */
export function useStoredFlag(key: string, fallback: boolean): [boolean, (value: boolean) => void] {
  const stored = useSyncExternalStore(
    subscribe,
    () => read(key),
    () => null,
  );
  const value = stored === null ? fallback : stored === 'true';

  const setValue = (next: boolean) => {
    try {
      window.localStorage.setItem(key, String(next));
    } catch {
      // Not persisted when storage is blocked; nothing else to do.
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  };

  return [value, setValue];
}
