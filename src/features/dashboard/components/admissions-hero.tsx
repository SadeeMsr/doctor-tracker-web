import { TrendingDown, TrendingUp } from 'lucide-react';

import { Sparkline } from '@/components/charts/sparkline';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/cn';
import { formatNumber } from '@/lib/format';

import { INTERVAL_META } from '../intervals';
import type { DashboardSummary } from '../types';

function ChangeBadge({ change }: { change: number | null }) {
  // Null: the previous window had no admissions, so there is no percentage to show.
  if (change === null) return <Badge tone="accent">New activity</Badge>;
  const Icon = change < 0 ? TrendingDown : TrendingUp;
  return (
    <Badge tone="accent">
      <Icon className="size-3.5" aria-hidden />
      {change > 0 && '+'}
      {change}% vs previous period
    </Badge>
  );
}

interface AdmissionsHeroProps {
  summary: DashboardSummary;
  className?: string;
}

/** The headline: admissions in the window, how that compares, and the shape of the trend. */
export function AdmissionsHero({ summary, className }: AdmissionsHeroProps) {
  const { totals, interval, admissionsOverTime } = summary;

  return (
    <Card tone="brand" className={cn('relative isolate overflow-hidden p-6', className)}>
      <div className="absolute inset-0 -z-10 ecg-grid" aria-hidden />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-mono text-[0.7rem] tracking-[0.2em] text-brand-muted uppercase">
          Admissions · {INTERVAL_META[interval].window}
        </h3>
        <ChangeBadge change={totals.admissionsChange} />
      </div>
      <p className="mt-5 text-6xl font-semibold tracking-[-0.04em] tabular-nums sm:text-7xl">
        {formatNumber(totals.admissions)}
      </p>
      <p className="mt-1 text-sm text-brand-muted">
        {formatNumber(totals.previousAdmissions)} in the period before
      </p>
      <Sparkline
        values={admissionsOverTime.map((bucket) => bucket.count)}
        className="mt-5 h-14 text-accent"
      />
    </Card>
  );
}
