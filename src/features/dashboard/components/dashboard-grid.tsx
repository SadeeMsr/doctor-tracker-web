import { cn } from '@/lib/cn';

import type { DashboardSummary, Interval } from '../types';

import { AdmissionsChartCard } from './admissions-chart-card';
import { AdmissionsHero } from './admissions-hero';
import { ConditionsCard } from './conditions-card';
import { CaseloadCard, SpecializationsCard } from './ranking-cards';
import { StatTiles } from './stat-tiles';

interface DashboardGridProps {
  summary: DashboardSummary;
  onIntervalChange: (interval: Interval) => void;
  /** Dims the cards while another interval loads. */
  isStale: boolean;
}

/** The bento layout: headline and totals, then trends, then rankings. */
export function DashboardGrid({ summary, onIntervalChange, isStale }: DashboardGridProps) {
  return (
    <div className={cn('grid gap-4 transition-opacity xl:grid-cols-12', isStale && 'opacity-60')}>
      <AdmissionsHero summary={summary} className="xl:col-span-6" />
      <StatTiles summary={summary} className="xl:col-span-6" />
      <AdmissionsChartCard
        summary={summary}
        onIntervalChange={onIntervalChange}
        className="xl:col-span-8"
      />
      <ConditionsCard summary={summary} className="xl:col-span-4" />
      <CaseloadCard summary={summary} className="xl:col-span-5" />
      <SpecializationsCard summary={summary} className="xl:col-span-7" />
    </div>
  );
}
