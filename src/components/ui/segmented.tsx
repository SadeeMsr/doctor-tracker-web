'use client';

import { Toggle } from '@base-ui/react/toggle';
import { ToggleGroup } from '@base-ui/react/toggle-group';

import { cn } from '@/lib/cn';

interface SegmentedProps<TValue extends string> {
  value: TValue;
  onValueChange: (value: TValue) => void;
  options: readonly { value: TValue; label: string }[];
  'aria-label': string;
  className?: string;
}

const itemClass = [
  'h-8 rounded-full px-3.5 text-sm font-medium text-muted-foreground transition-colors',
  'hover:text-foreground data-pressed:bg-brand data-pressed:text-brand-foreground',
].join(' ');

/**
 * One-of-many switch; exactly one option is always pressed.
 * @example <Segmented aria-label="Interval" value={interval} onValueChange={setInterval} options={INTERVALS} />
 */
export function Segmented<TValue extends string>({
  value,
  onValueChange,
  options,
  className,
  ...props
}: SegmentedProps<TValue>) {
  return (
    <ToggleGroup
      {...props}
      value={[value]}
      onValueChange={(pressed) => {
        // Clicking the pressed option empties the group; ignore that so one stays selected.
        const next = options.find((option) => option.value === pressed[0]);
        if (next) onValueChange(next.value);
      }}
      className={cn('inline-flex gap-1 rounded-full bg-canvas-soft p-1', className)}
    >
      {options.map((option) => (
        <Toggle key={option.value} value={option.value} className={itemClass}>
          {option.label}
        </Toggle>
      ))}
    </ToggleGroup>
  );
}
