import { BrandMark } from '@/components/layout/brand-mark';

import { PulseLine } from './pulse-line';

const VITALS = ['Doctors', 'Patients', 'Insights'] as const;

function Headline() {
  return (
    <div className="space-y-5">
      <h2 className="text-[2.6rem] leading-[1.02] font-semibold tracking-[-0.03em] text-brand-foreground sm:text-6xl xl:text-7xl">
        Care, at a
        <br />
        <span className="relative inline-block text-accent italic">glance.</span>
      </h2>
      <p className="max-w-sm text-[0.95rem] leading-relaxed text-brand-muted">
        One calm place for your doctors, their patients, and the numbers that matter.
      </p>
    </div>
  );
}

function Vitals() {
  return (
    <ul className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-[0.7rem] tracking-[0.18em] text-brand-muted uppercase">
      {VITALS.map((vital) => (
        <li key={vital} className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-accent" aria-hidden />
          {vital}
        </li>
      ))}
    </ul>
  );
}

/**
 * Left panel of the login page: brand, statement, and the live ECG trace. On phones it shrinks
 * to a header band (brand, pulse, one line), so the form, which is the actual task, stays above
 * the fold.
 */
export function PulseHero() {
  return (
    <section className="relative isolate flex flex-col justify-between gap-4 overflow-hidden rounded-[1.75rem] bg-brand p-6 sm:p-10 lg:gap-0">
      <div className="absolute inset-0 -z-10 ecg-grid" aria-hidden />
      <div className="absolute inset-0 -z-10 grain opacity-[0.18] mix-blend-overlay" aria-hidden />
      <div
        className="absolute -top-40 -right-40 -z-10 size-[28rem] rounded-full bg-accent/10 blur-3xl"
        aria-hidden
      />

      <BrandMark tone="onBrand" />
      <div className="hidden lg:block">
        <Headline />
      </div>
      <div className="-mx-6 h-16 sm:-mx-10 lg:h-auto">
        <PulseLine />
      </div>
      <p className="text-2xl font-semibold tracking-[-0.02em] text-brand-foreground lg:hidden">
        Care, at a <span className="text-accent italic">glance.</span>
      </p>
      <div className="hidden lg:block">
        <Vitals />
      </div>
    </section>
  );
}
