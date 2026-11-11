'use client';

import { Popover as BasePopover } from '@base-ui/react/popover';
import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

import { popupSurface } from './surface';

/**
 * Floating panel anchored to its trigger.
 * @example <Popover><PopoverTrigger>Dates</PopoverTrigger><PopoverContent>…</PopoverContent></Popover>
 */
export const Popover = BasePopover.Root;
export const PopoverTrigger = BasePopover.Trigger;

interface PopoverContentProps {
  align?: 'start' | 'center' | 'end';
  className?: string;
  children: ReactNode;
}

export function PopoverContent({ align = 'start', className, children }: PopoverContentProps) {
  return (
    <BasePopover.Portal>
      <BasePopover.Positioner sideOffset={8} align={align} className="z-[60]">
        <BasePopover.Popup className={cn(popupSurface, 'p-4', className)}>
          {children}
        </BasePopover.Popup>
      </BasePopover.Positioner>
    </BasePopover.Portal>
  );
}
