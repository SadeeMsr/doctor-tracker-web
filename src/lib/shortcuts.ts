/**
 * Keyboard shortcuts: one registry for both the key handling and the help panel, so they can't
 * drift apart. A combo is `key`, `modifier+key` (`mod` = ⌘ on Apple, Ctrl elsewhere) or a
 * sequence of two strokes separated by a space (`g d`: press G, then D).
 */
export const SHORTCUTS = {
  help: '?',
  goDashboard: 'g d',
  goDoctors: 'g o',
  goPatients: 'g p',
  search: '/',
  toggleTheme: 'shift+t',
  create: 'n',
  previousPage: '[',
  nextPage: ']',
  clearFilters: 'shift+x',
  save: 'mod+enter',
  saveAndAddAnother: 'mod+shift+enter',
  close: 'escape',
} as const;

export type ShortcutCombo = (typeof SHORTCUTS)[keyof typeof SHORTCUTS];

export const SHORTCUT_GROUPS: readonly {
  title: string;
  items: readonly { combo: ShortcutCombo; label: string }[];
}[] = [
  {
    title: 'Anywhere',
    items: [
      { combo: SHORTCUTS.help, label: 'Show keyboard shortcuts' },
      { combo: SHORTCUTS.goDashboard, label: 'Go to the dashboard' },
      { combo: SHORTCUTS.goDoctors, label: 'Go to doctors' },
      { combo: SHORTCUTS.goPatients, label: 'Go to patients' },
      { combo: SHORTCUTS.search, label: 'Search the current list' },
      { combo: SHORTCUTS.toggleTheme, label: 'Toggle dark mode' },
    ],
  },
  {
    title: 'Lists',
    items: [
      { combo: SHORTCUTS.create, label: 'Add a doctor or patient' },
      { combo: SHORTCUTS.previousPage, label: 'Previous page' },
      { combo: SHORTCUTS.nextPage, label: 'Next page' },
      { combo: SHORTCUTS.clearFilters, label: 'Clear all filters' },
    ],
  },
  {
    title: 'Forms',
    items: [
      { combo: SHORTCUTS.save, label: 'Save' },
      { combo: SHORTCUTS.saveAndAddAnother, label: 'Save & add another' },
      { combo: SHORTCUTS.close, label: 'Close without saving' },
    ],
  },
];

interface Stroke {
  key: string;
  mod: boolean;
  shift: boolean;
}

function parseStroke(stroke: string): Stroke {
  const parts = stroke.toLowerCase().split('+');
  return {
    key: parts.at(-1) ?? '',
    mod: parts.includes('mod'),
    shift: parts.includes('shift'),
  };
}

/** The strokes of a combo: one, or two for a sequence. */
export function strokesOf(combo: string): string[] {
  return combo.split(' ');
}

/** Single-character shortcuts (no ⌘/Ctrl) can be switched off: WCAG 2.1.4. */
export function isCharacterShortcut(combo: string): boolean {
  return !combo.includes('mod+') && combo !== SHORTCUTS.close;
}

export function matchesStroke(event: KeyboardEvent, stroke: string): boolean {
  const expected = parseStroke(stroke);
  if (expected.mod !== (event.metaKey || event.ctrlKey) || event.altKey) return false;
  const key = event.key.toLowerCase();
  // Symbols such as `?` already need Shift on most layouts: compare the character produced.
  if (key.length === 1 && !/[a-z0-9]/.test(key)) return key === expected.key;
  return key === expected.key && expected.shift === event.shiftKey;
}

const LABELS: Record<string, { mac: string; other: string }> = {
  mod: { mac: '⌘', other: 'Ctrl' },
  shift: { mac: '⇧', other: 'Shift' },
  enter: { mac: '↵', other: 'Enter' },
  escape: { mac: 'Esc', other: 'Esc' },
};

/** Display labels for each stroke's keys: `mod+enter` → [['⌘', '↵']] on a Mac. */
export function comboLabels(combo: string, isMac: boolean): string[][] {
  return strokesOf(combo).map((stroke) =>
    stroke.split('+').map((part) => {
      const label = LABELS[part];
      if (label) return isMac ? label.mac : label.other;
      return part.length === 1 ? part.toUpperCase() : part;
    }),
  );
}

/** For `aria-keyshortcuts` and tooltips: `mod+shift+enter` → `Control+Shift+Enter`. */
export function ariaKeyShortcut(combo: string): string {
  return strokesOf(combo)
    .map((stroke) =>
      stroke
        .split('+')
        .map(
          (part) =>
            ({ mod: 'Control', shift: 'Shift', enter: 'Enter', escape: 'Escape' })[part] ??
            part.toUpperCase(),
        )
        .join('+'),
    )
    .join(' ');
}
