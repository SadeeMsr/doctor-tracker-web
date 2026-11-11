import Link from 'next/link';

import { buttonStyles } from '@/components/ui/button';

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center p-4 text-center">
      <div className="space-y-4">
        <p className="text-sm font-medium text-brand">404</p>
        <h1 className="text-2xl font-semibold tracking-tight">Page not found</h1>
        <Link href="/" className={buttonStyles({ variant: 'secondary' })}>
          Back to dashboard
        </Link>
      </div>
    </main>
  );
}
