'use client';

import { ScrollArea as BaseScrollArea } from '@base-ui/react/scroll-area';
import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

/* Content fades out at whichever edge has more to scroll, so overflow is visible without a
   permanent scrollbar. The CSS variables come from Base UI's ScrollArea. */
const edgeFade = [
  '[mask-image:linear-gradient(to_bottom,transparent_0,black_min(1.5rem,var(--scroll-area-overflow-y-start)),black_calc(100%-min(1.5rem,var(--scroll-area-overflow-y-end,1.5rem))),transparent_100%)]',
  '[mask-repeat:no-repeat]',
].join(' ');

const scrollbarClass = [
  // Inset from the top and bottom so it clears rounded corners, and from the right edge.
  'pointer-events-none my-3.5 mr-1 flex w-1 justify-center rounded-full opacity-0',
  'transition-opacity duration-300',
  'data-hovering:pointer-events-auto data-hovering:opacity-100',
  'data-scrolling:pointer-events-auto data-scrolling:opacity-100 data-scrolling:duration-0',
].join(' ');

interface ScrollAreaProps {
  /** Sizing for the root, e.g. `max-h-80` or `flex-1`. */
  className?: string;
  /** Padding for the scrolled content. */
  contentClassName?: string;
  children: ReactNode;
}

/**
 * Scroll container with a slim overlay scrollbar that only shows while hovering or scrolling,
 * identical in every browser.
 * @example <ScrollArea className="max-h-80" contentClassName="p-2">{items}</ScrollArea>
 */
export function ScrollArea({ className, contentClassName, children }: ScrollAreaProps) {
  return (
    <BaseScrollArea.Root
      className={cn('group/scroll-area relative flex min-h-0 flex-col', className)}
    >
      <BaseScrollArea.Viewport
        className={cn(
          'min-h-0 overscroll-contain outline-none focus-visible:outline-2 focus-visible:-outline-offset-2',
          edgeFade,
        )}
      >
        <BaseScrollArea.Content className={contentClassName}>{children}</BaseScrollArea.Content>
      </BaseScrollArea.Viewport>
      <BaseScrollArea.Scrollbar className={scrollbarClass}>
        <BaseScrollArea.Thumb className="w-full rounded-full bg-brand-ink/25 hover:bg-brand-ink/45" />
      </BaseScrollArea.Scrollbar>
    </BaseScrollArea.Root>
  );
}
