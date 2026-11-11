'use client';

import { Menu as BaseMenu } from '@base-ui/react/menu';
import { Check } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';

import { cn } from '@/lib/cn';

import { popupItem, popupSurface } from './surface';

/**
 * Dropdown menu. Style the trigger with `buttonStyles()`.
 * @example <Menu><MenuTrigger>Open</MenuTrigger><MenuContent><MenuItem>Edit</MenuItem></MenuContent></Menu>
 */
export const Menu = BaseMenu.Root;
export const MenuTrigger = BaseMenu.Trigger;
export const MenuRadioGroup = BaseMenu.RadioGroup;

interface MenuContentProps {
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  children: ReactNode;
}

export function MenuContent({ align = 'end', side, className, children }: MenuContentProps) {
  return (
    <BaseMenu.Portal>
      <BaseMenu.Positioner sideOffset={8} align={align} side={side} className="z-[60]">
        <BaseMenu.Popup
          className={cn(
            popupSurface,
            'max-h-80 min-w-44 scrollbar-subtle overflow-y-auto',
            className,
          )}
        >
          {children}
        </BaseMenu.Popup>
      </BaseMenu.Positioner>
    </BaseMenu.Portal>
  );
}

type MenuItemProps = ComponentProps<typeof BaseMenu.Item> & { tone?: 'default' | 'danger' };

export function MenuItem({ className, tone = 'default', ...props }: MenuItemProps) {
  return (
    <BaseMenu.Item
      className={cn(popupItem, tone === 'danger' && 'text-danger', className)}
      {...props}
    />
  );
}

const indicatorClass = 'ml-auto grid size-4 place-items-center text-brand';

/** Stays open on click, so several options can be ticked in one visit. */
export function MenuCheckboxItem({
  className,
  children,
  ...props
}: ComponentProps<typeof BaseMenu.CheckboxItem>) {
  return (
    <BaseMenu.CheckboxItem closeOnClick={false} className={cn(popupItem, className)} {...props}>
      {children}
      <BaseMenu.CheckboxItemIndicator className={indicatorClass}>
        <Check aria-hidden />
      </BaseMenu.CheckboxItemIndicator>
    </BaseMenu.CheckboxItem>
  );
}

export function MenuRadioItem({
  className,
  children,
  ...props
}: ComponentProps<typeof BaseMenu.RadioItem>) {
  return (
    <BaseMenu.RadioItem className={cn(popupItem, className)} {...props}>
      {children}
      <BaseMenu.RadioItemIndicator className={indicatorClass}>
        <Check aria-hidden />
      </BaseMenu.RadioItemIndicator>
    </BaseMenu.RadioItem>
  );
}

export function MenuSeparator() {
  return <BaseMenu.Separator className="mx-2 my-1.5 h-px bg-border" />;
}

/** Non-interactive heading inside a menu. */
export function MenuHeading({ children }: { children: ReactNode }) {
  return <div className="px-3 pt-2 pb-1.5 text-xs text-muted-foreground">{children}</div>;
}
