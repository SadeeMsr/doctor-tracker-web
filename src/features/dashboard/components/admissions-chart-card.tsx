'use client';

import { ChartCard } from '@/components/charts/chart-card';
import { Segmented } from '@/components/ui/segmented';

import { bucketLabel, INTERVAL_META, INTERVAL_OPTIONS } from '../intervals';
import type { DashboardSummary, Interval } from '../types';

import { LazyTrendAreaChart } from './lazy-charts';

interface AdmissionsChartCardProps {
  summary: DashboardSummary;
  onIntervalChange: (interval: Interval) => void;
  className?: string;
}

/** Date-based statistics: admissions per day, week or month. */
export function AdmissionsChartCard({
  summary,
  onIntervalChange,
  className,
}: AdmissionsChartCardProps) {
  const { interval } = summary;
  const data = summary.admissionsOverTime.map((bucket) => ({
    label: bucketLabel(bucket.periodStart, interval),
    value: bucket.count,
  }));

  return (
    <ChartCard
      className={className}
      title="Admissions over time"
      description={`New patients ${INTERVAL_META[interval].per}, ${INTERVAL_META[interval].window}`}
      action={
        <Segmented
          aria-label="Chart interval"
          value={interval}
          onValueChange={onIntervalChange}
          options={INTERVAL_OPTIONS}
        />
      }
    >
      <div className="h-72">
        <LazyTrendAreaChart data={data} unit="admissions" />
      </div>
    </ChartCard>
  );
}
