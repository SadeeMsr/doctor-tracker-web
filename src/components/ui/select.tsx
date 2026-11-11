'use client';

import { Select as BaseSelect } from '@base-ui/react/select';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/cn';

import { popupItem, popupSurface } from './surface';

export interface SelectOption<TValue extends string = string> {
  value: TValue;
  label: string;
}

interface SelectProps<TValue extends string> {
  id?: string;
  value: TValue | null;
  onValueChange: (value: TValue) => void;
  onBlur?: () => void;
  options: readonly SelectOption<TValue>[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  'aria-invalid'?: boolean;
  'aria-describedby'?: string;
}

const triggerClass = [
  'flex h-11 w-full items-center justify-between gap-2 rounded-2xl bg-canvas-soft px-4 text-left',
  'text-[0.95rem] ring-1 ring-transparent transition-[box-shadow,background-color] duration-200',
  'focus-visible:bg-surface focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none',
  'data-popup-open:bg-surface data-popup-open:ring-2 data-popup-open:ring-brand',
  'aria-invalid:ring-2 aria-invalid:ring-danger data-disabled:opacity-60',
].join(' ');

function SelectPopup<TValue extends string>({ options }: Pick<SelectProps<TValue>, 'options'>) {
  return (
    <BaseSelect.Portal>
      <BaseSelect.Positioner sideOffset={6} alignItemWithTrigger={false} className="z-[60]">
        <BaseSelect.Popup className={cn(popupSurface, 'min-w-(--anchor-width)')}>
          <BaseSelect.List className="max-h-64 overflow-y-auto">
            {options.map((option) => (
              <BaseSelect.Item key={option.value} value={option.value} className={popupItem}>
                <BaseSelect.ItemText className="flex-1">{option.label}</BaseSelect.ItemText>
                <BaseSelect.ItemIndicator>
                  <Check className="text-brand" aria-hidden />
                </BaseSelect.ItemIndicator>
              </BaseSelect.Item>
            ))}
          </BaseSelect.List>
        </BaseSelect.Popup>
      </BaseSelect.Positioner>
    </BaseSelect.Portal>
  );
}

/**
 * Single-choice dropdown styled like `Input`.
 * @example <Select value={gender} onValueChange={setGender} options={GENDER_OPTIONS} />
 */
export function Select<TValue extends string>({
  value,
  onValueChange,
  options,
  placeholder,
  disabled,
  className,
  ...trigger
}: SelectProps<TValue>) {
  return (
    <BaseSelect.Root
      items={options}
      value={value}
      disabled={disabled}
      onValueChange={(next) => {
        if (next !== null) onValueChange(next);
      }}
    >
      <BaseSelect.Trigger className={cn(triggerClass, className)} {...trigger}>
        <BaseSelect.Value
          placeholder={placeholder}
          className="truncate data-placeholder:text-muted-foreground/70"
        />
        <BaseSelect.Icon className="text-muted-foreground">
          <ChevronsUpDown className="size-4" aria-hidden />
        </BaseSelect.Icon>
      </BaseSelect.Trigger>
      <SelectPopup options={options} />
    </BaseSelect.Root>
  );
}
