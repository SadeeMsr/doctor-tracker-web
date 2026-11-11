'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { tv } from 'tailwind-variants';

import { NAV_ITEMS } from './nav-items';

const linkStyles = tv({
  base: 'flex items-center font-medium transition-colors duration-200 [&_svg]:size-[1.15rem] [&_svg]:shrink-0',
  variants: {
    layout: {
      rail: 'gap-3 rounded-full px-4 py-3 text-[0.95rem]',
      dock: 'h-12 flex-1 justify-center gap-2 rounded-full text-sm',
    },
    isActive: {
      true: 'bg-accent text-accent-foreground',
      false: 'text-brand-muted hover:bg-brand-foreground/8 hover:text-brand-foreground',
    },
  },
});

/** The three destinations; `rail` stacks them in the sidebar, `dock` lays them out as tabs. */
export function MainNav({ layout }: { layout: 'rail' | 'dock' }) {
  const pathname = usePathname();

  return NAV_ITEMS.map(({ href, label, icon: Icon }) => {
    const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
    return (
      <Link
        key={href}
        href={href}
        aria-current={isActive ? 'page' : undefined}
        className={linkStyles({ layout, isActive })}
      >
        <Icon aria-hidden />
        {label}
      </Link>
    );
  });
}
