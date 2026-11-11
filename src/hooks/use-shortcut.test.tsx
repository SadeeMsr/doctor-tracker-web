import { fireEvent, render, renderHook, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useShortcut } from '@/hooks/use-shortcut';
import { ShortcutSettingsContext, type ShortcutSettings } from '@/hooks/use-shortcut-settings';

const press = (key: string, init: KeyboardEventInit = {}, target: Element = document.body) =>
  fireEvent.keyDown(target, { key, ...init });

function withSettings(overrides: Partial<ShortcutSettings>) {
  const value: ShortcutSettings = {
    areCharacterKeysOn: true,
    setCharacterKeysOn: () => undefined,
    isHelpOpen: false,
    setHelpOpen: () => undefined,
    isHintDismissed: true,
    dismissHint: () => undefined,
    ...overrides,
  };
  return function SettingsWrapper({ children }: { children: ReactNode }) {
    return <ShortcutSettingsContext value={value}>{children}</ShortcutSettingsContext>;
  };
}

describe('useShortcut', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('runs the handler when its key is pressed', () => {
    const handler = vi.fn();
    renderHook(() => useShortcut('n', handler));

    press('n');

    expect(handler).toHaveBeenCalledOnce();
  });

  it('stays out of the way while the user types in a field', () => {
    const handler = vi.fn();
    renderHook(() => useShortcut('n', handler));
    render(<input aria-label="Name" />);

    press('n', {}, screen.getByLabelText('Name'));

    expect(handler).not.toHaveBeenCalled();
  });

  it('lets ⌘/Ctrl+Enter submit from inside a field when allowed', () => {
    const handler = vi.fn();
    renderHook(() => useShortcut('mod+enter', handler, { allowInInput: true }));
    render(<textarea aria-label="Diagnosis" />);

    press('Enter', { ctrlKey: true }, screen.getByLabelText('Diagnosis'));

    expect(handler).toHaveBeenCalledOnce();
  });

  it('pauses page shortcuts while a dialog is open', () => {
    const handler = vi.fn();
    renderHook(() => useShortcut('n', handler));
    render(<div role="dialog" aria-label="Add patient" />);

    press('n');

    expect(handler).not.toHaveBeenCalled();
  });

  it('handles two-key sequences, but only in quick succession', () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    const handler = vi.fn();
    renderHook(() => useShortcut('g d', handler));

    press('g');
    press('d');
    press('g');
    vi.setSystemTime(Date.now() + 1500);
    press('d');

    expect(handler).toHaveBeenCalledOnce();
  });

  it('respects the switch for single-key shortcuts, but keeps ⌘/Ctrl combos', () => {
    const letter = vi.fn();
    const combo = vi.fn();
    const wrapper = withSettings({ areCharacterKeysOn: false });
    renderHook(() => useShortcut('n', letter), { wrapper });
    renderHook(() => useShortcut('mod+enter', combo, { allowInInput: true }), { wrapper });

    press('n');
    press('Enter', { metaKey: true });

    expect(letter).not.toHaveBeenCalled();
    expect(combo).toHaveBeenCalledOnce();
  });

  it('does nothing when disabled (e.g. no next page)', () => {
    const handler = vi.fn();
    renderHook(() => useShortcut(']', handler, { enabled: false }));

    press(']');

    expect(handler).not.toHaveBeenCalled();
  });
});
