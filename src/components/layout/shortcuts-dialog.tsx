'use client';

import { Keyboard } from 'lucide-react';

import { Dialog, DialogBody, DialogIcon } from '@/components/ui/dialog';
import { KeyCombo } from '@/components/ui/kbd';
import { useShortcutSettings } from '@/hooks/use-shortcut-settings';
import { SHORTCUT_GROUPS } from '@/lib/shortcuts';

function CharacterKeysToggle() {
  const { areCharacterKeysOn, setCharacterKeysOn } = useShortcutSettings();

  return (
    <label className="flex items-start gap-3 rounded-2xl bg-canvas-soft p-4 text-sm ring-1 ring-border">
      <input
        type="checkbox"
        checked={areCharacterKeysOn}
        onChange={(event) => setCharacterKeysOn(event.target.checked)}
        className="mt-0.5 size-4 shrink-0 accent-brand-ink"
      />
      <span>
        <span className="block font-medium">Single-key shortcuts</span>
        <span className="text-muted-foreground">
          Turn off if they clash with a screen reader or voice control. ⌘/Ctrl shortcuts keep
          working.
        </span>
      </span>
    </label>
  );
}

/** Every shortcut, grouped, from the same registry the key handling uses. Opened with `?`. */
export function ShortcutsDialog() {
  const { isHelpOpen, setHelpOpen } = useShortcutSettings();

  return (
    <Dialog
      open={isHelpOpen}
      onOpenChange={setHelpOpen}
      size="sm"
      title="Keyboard shortcuts"
      description="Work faster, without the mouse."
      media={
        <DialogIcon>
          <Keyboard aria-hidden />
        </DialogIcon>
      }
    >
      <DialogBody className="space-y-6">
        {SHORTCUT_GROUPS.map((group) => (
          <section key={group.title} aria-labelledby={`shortcuts-${group.title}`}>
            <h3
              id={`shortcuts-${group.title}`}
              className="mb-2 font-mono text-[0.7rem] tracking-[0.2em] text-muted-foreground uppercase"
            >
              {group.title}
            </h3>
            <dl className="divide-y divide-border">
              {group.items.map((item) => (
                <div key={item.combo} className="flex items-center justify-between gap-4 py-2.5">
                  <dt className="text-sm">{item.label}</dt>
                  <dd>
                    <KeyCombo combo={item.combo} />
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
        <CharacterKeysToggle />
      </DialogBody>
    </Dialog>
  );
}
