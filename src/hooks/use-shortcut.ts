'use client';

import { useEffect, useRef } from 'react';

import { useShortcutSettings } from '@/hooks/use-shortcut-settings';
import { isCharacterShortcut, matchesStroke, strokesOf } from '@/lib/shortcuts';

/** How long the second key of a sequence (`g` then `d`) may follow the first. */
const SEQUENCE_WINDOW_MS = 1000;

// Shared by every listener, so pressing `g` arms all the `g …` sequences at once.
let armed: { stroke: string; at: number } | null = null;

function isTyping(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  if (target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement) return true;
  return (
    target instanceof HTMLInputElement &&
    !['checkbox', 'radio', 'button', 'submit', 'reset'].includes(target.type)
  );
}

/** A dialog or menu is open: page shortcuts must not act on what's underneath it. */
function isOverlayOpen(): boolean {
  return document.querySelector('[role="dialog"], [role="menu"], [role="listbox"]') !== null;
}

interface ShortcutOptions {
  /** Defaults to true. */
  enabled?: boolean;
  /** Also fire while typing in a field (for ⌘/Ctrl+Enter in forms). */
  allowInInput?: boolean;
  /** `page` shortcuts pause while a dialog or menu is open. Defaults to `page`. */
  scope?: 'page' | 'any';
}

function matches(event: KeyboardEvent, combo: string): boolean {
  const [first = '', second] = strokesOf(combo);
  if (second === undefined) return matchesStroke(event, first);
  if (matchesStroke(event, first)) {
    armed = { stroke: first, at: Date.now() };
    return false;
  }
  const isArmed = armed?.stroke === first && Date.now() - armed.at < SEQUENCE_WINDOW_MS;
  if (!isArmed || !matchesStroke(event, second)) return false;
  armed = null;
  return true;
}

/**
 * Runs `handler` when the combo is pressed. Ignored while typing (unless `allowInInput`), while
 * a dialog is open (for `page` scope), and for single-character combos the user switched off.
 * @example useShortcut(SHORTCUTS.create, openCreate);
 */
export function useShortcut(combo: string, handler: () => void, options: ShortcutOptions = {}) {
  const { enabled = true, allowInInput = false, scope = 'page' } = options;
  const { areCharacterKeysOn } = useShortcutSettings();
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  });

  useEffect(() => {
    if (!enabled || (isCharacterShortcut(combo) && !areCharacterKeysOn)) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.isComposing || event.repeat) return;
      if (!allowInInput && isTyping(event.target)) return;
      if (scope === 'page' && isOverlayOpen()) return;
      if (!matches(event, combo)) return;
      event.preventDefault();
      handlerRef.current();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [combo, enabled, allowInInput, scope, areCharacterKeysOn]);
}
