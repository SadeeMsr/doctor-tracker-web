import Link from 'next/link';
import { Suspense, type ReactNode } from 'react';

import { BrandMark } from './brand-mark';
import { MainNav } from './main-nav';

/** Phone top bar: brand on the left, the account menu on the right. */
export function MobileHeader({ actions }: { actions: ReactNode }) {
  return (
    <header className="flex items-center justify-between px-4 pt-4 lg:hidden">
      <Link href="/" aria-label="Doctor Tracker home">
        <BrandMark />
      </Link>
      {actions}
    </header>
  );
}

/** Phone navigation: a floating dock within thumb reach. */
export function MobileDock() {
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-3 bottom-3 z-30 flex gap-1 rounded-full bg-brand p-1.5 shadow-xl lg:hidden"
    >
      <Suspense>
        <MainNav layout="dock" />
      </Suspense>
    </nav>
  );
}
