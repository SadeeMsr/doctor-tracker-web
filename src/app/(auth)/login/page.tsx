import type { Metadata } from 'next';
import { Suspense } from 'react';

import { LoginForm } from '@/features/auth/components/login-form';
import { PulseHero } from '@/features/auth/components/pulse-hero';

export const metadata: Metadata = { title: 'Sign in' };

/** Same footprint as the form, so nothing jumps when it hydrates. */
function FormPlaceholder() {
  return <div className="h-[30rem] w-full max-w-[26rem]" aria-hidden />;
}

export default function LoginPage() {
  return (
    // Polar Snow page with the green hero inset; no outer frame.
    <main className="grid min-h-dvh grid-rows-[auto_1fr] gap-2 bg-surface p-2 sm:p-3 lg:grid-cols-[1.08fr_1fr] lg:grid-rows-1">
      <PulseHero />
      <section className="flex items-center justify-center px-4 py-10 sm:px-10 sm:py-12">
        {/* useSearchParams (for ?next=) must sit inside Suspense so the rest prerenders. */}
        <Suspense fallback={<FormPlaceholder />}>
          <LoginForm />
        </Suspense>
      </section>
    </main>
  );
}
