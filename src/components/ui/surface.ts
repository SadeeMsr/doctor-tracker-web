/** Shared look of floating layers (menus, selects, popovers), so they read as one family. */
export const popupSurface = [
  'z-[60] rounded-2xl bg-surface p-1.5 text-foreground shadow-xl ring-1 ring-border outline-none',
  'origin-(--transform-origin) transition-[opacity,scale] duration-150 ease-out',
  'data-starting-style:scale-95 data-starting-style:opacity-0',
  'data-ending-style:scale-95 data-ending-style:opacity-0',
].join(' ');

export const popupItem = [
  'flex cursor-default items-center gap-2.5 rounded-xl px-3 py-2 text-sm outline-none select-none',
  'data-highlighted:bg-subtle data-disabled:pointer-events-none data-disabled:opacity-50',
  '[&_svg]:size-4 [&_svg]:shrink-0',
].join(' ');
