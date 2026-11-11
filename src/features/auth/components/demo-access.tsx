'use client';

import { Sparkles } from 'lucide-react';

const DEMO_EMAIL = process.env.NEXT_PUBLIC_DEMO_EMAIL;
const DEMO_PASSWORD = process.env.NEXT_PUBLIC_DEMO_PASSWORD;

/**
 * One-click demo credentials for reviewers. Renders nothing unless both demo env vars are set,
 * so a real deployment simply leaves them out.
 */
export function DemoAccess({ onFill }: { onFill: (email: string, password: string) => void }) {
  if (!DEMO_EMAIL || !DEMO_PASSWORD) return null;

  return (
    <button
      type="button"
      onClick={() => onFill(DEMO_EMAIL, DEMO_PASSWORD)}
      className="group flex w-full items-center gap-3 rounded-2xl border border-dashed border-brand-ink/25 px-4 py-3 text-left transition-colors hover:border-brand-ink/50 hover:bg-canvas-soft"
    >
      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-accent text-accent-foreground">
        <Sparkles className="size-4" aria-hidden />
      </span>
      <span className="min-w-0 text-sm">
        <span className="block font-medium text-foreground">Use the demo account</span>
        <span className="block truncate text-muted-foreground">{DEMO_EMAIL}</span>
      </span>
    </button>
  );
}
