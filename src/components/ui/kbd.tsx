import { Fragment } from 'react';

import { useIsMac } from '@/hooks/use-is-mac';
import { cn } from '@/lib/cn';
import { comboLabels } from '@/lib/shortcuts';

const keyClass =
  'inline-flex h-6 min-w-6 items-center justify-center rounded-md bg-canvas-soft px-1.5 font-mono text-[0.7rem] font-medium text-foreground ring-1 ring-border';

/**
 * The keys of a shortcut, as key caps: `mod+enter` shows ⌘ ↵ on a Mac and Ctrl Enter elsewhere;
 * a sequence (`g d`) shows "G then D".
 * @example <KeyCombo combo="mod+enter" />
 */
export function KeyCombo({ combo, className }: { combo: string; className?: string }) {
  const isMac = useIsMac();
  const strokes = comboLabels(combo, isMac);

  return (
    <span className={cn('inline-flex items-center gap-1', className)}>
      {strokes.map((keys, index) => (
        <Fragment key={keys.join('+')}>
          {index > 0 && <span className="px-0.5 text-xs text-muted-foreground">then</span>}
          {keys.map((key) => (
            <kbd key={key} className={keyClass}>
              {key}
            </kbd>
          ))}
        </Fragment>
      ))}
    </span>
  );
}
