import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Sign in' };

export default function LoginPage() {
  return (
    <main className="grid min-h-dvh place-items-center p-4">
      <div className="w-full max-w-sm space-y-1 rounded-xl border bg-surface p-8 shadow-sm">
        <h1 className="text-xl font-semibold tracking-tight">Sign in</h1>
        <p className="text-sm text-muted-foreground">Login form goes here.</p>
      </div>
    </main>
  );
}
