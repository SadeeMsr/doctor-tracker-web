import { describe, expect, it } from 'vitest';

import {
  ariaKeyShortcut,
  comboLabels,
  isCharacterShortcut,
  matchesStroke,
  SHORTCUT_GROUPS,
  SHORTCUTS,
} from '@/lib/shortcuts';

const key = (init: KeyboardEventInit) => new KeyboardEvent('keydown', init);

describe('matchesStroke', () => {
  it('matches a plain letter, case-insensitively, without modifiers', () => {
    expect(matchesStroke(key({ key: 'n' }), 'n')).toBe(true);
    expect(matchesStroke(key({ key: 'n', ctrlKey: true }), 'n')).toBe(false);
  });

  it('requires Shift for shift+letter combos', () => {
    expect(matchesStroke(key({ key: 'T', shiftKey: true }), 'shift+t')).toBe(true);
    expect(matchesStroke(key({ key: 't' }), 'shift+t')).toBe(false);
  });

  it('treats ⌘ and Ctrl alike as "mod"', () => {
    expect(matchesStroke(key({ key: 'Enter', metaKey: true }), 'mod+enter')).toBe(true);
    expect(matchesStroke(key({ key: 'Enter', ctrlKey: true }), 'mod+enter')).toBe(true);
    expect(matchesStroke(key({ key: 'Enter', ctrlKey: true, shiftKey: true }), 'mod+enter')).toBe(
      false,
    );
  });

  it('compares the produced character for symbols, so "?" works on any layout', () => {
    expect(matchesStroke(key({ key: '?', shiftKey: true }), '?')).toBe(true);
    expect(matchesStroke(key({ key: '/' }), '?')).toBe(false);
  });
});

describe('shortcut labels', () => {
  it('shows ⌘ on Apple keyboards and Ctrl elsewhere', () => {
    expect(comboLabels(SHORTCUTS.save, true)).toEqual([['⌘', '↵']]);
    expect(comboLabels(SHORTCUTS.save, false)).toEqual([['Ctrl', 'Enter']]);
  });

  it('splits a sequence into strokes', () => {
    expect(comboLabels(SHORTCUTS.goDoctors, false)).toEqual([['G'], ['O']]);
  });

  it('describes combos for aria-keyshortcuts', () => {
    expect(ariaKeyShortcut(SHORTCUTS.saveAndAddAnother)).toBe('Control+Shift+Enter');
  });
});

describe('shortcut registry', () => {
  it('flags single-character shortcuts, which users may switch off (WCAG 2.1.4)', () => {
    expect(isCharacterShortcut(SHORTCUTS.create)).toBe(true);
    expect(isCharacterShortcut(SHORTCUTS.save)).toBe(false);
    expect(isCharacterShortcut(SHORTCUTS.close)).toBe(false);
  });

  it('lists every shortcut exactly once in the help panel', () => {
    const listed = SHORTCUT_GROUPS.flatMap((group) => group.items.map((item) => item.combo));

    expect(new Set(listed).size).toBe(listed.length);
    expect(listed.sort()).toEqual(Object.values(SHORTCUTS).sort());
  });
});
