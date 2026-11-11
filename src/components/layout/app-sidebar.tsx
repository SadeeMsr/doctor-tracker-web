import Link from 'next/link';
import { Suspense, type ReactNode } from 'react';

import { BrandMark } from './brand-mark';
import { MainNav } from './main-nav';

/**
 * Desktop navigation: a floating green rail, the same material as the login hero.
 * `footer` holds the account menu.
 */
export function AppSidebar({ footer }: { footer: ReactNode }) {
  return (
    <aside className="fixed inset-y-3 left-3 isolate hidden w-64 flex-col overflow-hidden rounded-[1.75rem] bg-brand p-4 lg:flex">
      <div className="absolute inset-0 -z-10 ecg-grid" aria-hidden />
      <div className="absolute inset-0 -z-10 grain opacity-[0.18] mix-blend-overlay" aria-hidden />

      <Link href="/" className="rounded-xl px-2 py-3" aria-label="Doctor Tracker home">
        <BrandMark tone="onBrand" />
      </Link>
      <nav aria-label="Main" className="mt-8 flex flex-1 flex-col gap-1.5">
        {/* usePathname suspends while a dynamic route prerenders. */}
        <Suspense>
          <MainNav layout="rail" />
        </Suspense>
      </nav>
      {footer}
    </aside>
  );
}
