'use client';

import { ChartCard } from '@/components/charts/chart-card';
import { CONDITION_META } from '@/lib/conditions';
import { formatNumber } from '@/lib/format';

import type { DashboardSummary } from '../types';

import { LazyDonutChart } from './lazy-charts';

type ConditionCount = DashboardSummary['conditions'][number];

function Legend({ conditions, total }: { conditions: ConditionCount[]; total: number }) {
  return (
    <ul className="space-y-2.5 text-sm">
      {conditions.map(({ condition, count }) => (
        <li key={condition} className="flex items-center gap-2.5">
          {/* The swatch colour is data (it must match the chart), hence the inline style. */}
          <span
            className="size-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: CONDITION_META[condition].color }}
            aria-hidden
          />
          <span className="flex-1 truncate">{CONDITION_META[condition].label}</span>
          <span className="font-semibold tabular-nums">{formatNumber(count)}</span>
          <span className="w-10 text-right text-xs text-muted-foreground tabular-nums">
            {total === 0 ? 0 : Math.round((count / total) * 100)}%
          </span>
        </li>
      ))}
    </ul>
  );
}

/** How the current patients split by condition. */
export function ConditionsCard({
  summary,
  className,
}: {
  summary: DashboardSummary;
  className?: string;
}) {
  const total = summary.totals.patients;
  const segments = summary.conditions.map(({ condition, count }) => ({
    name: CONDITION_META[condition].label,
    value: count,
    fill: CONDITION_META[condition].color,
  }));

  return (
    <ChartCard
      className={className}
      title="Patient conditions"
      description="Everyone in care, by status"
    >
      <div className="mx-auto size-44">
        <LazyDonutChart segments={segments} totalLabel="patients" unit="patients" />
      </div>
      <Legend conditions={summary.conditions} total={total} />
    </ChartCard>
  );
}
