import { HeartPulse, Stethoscope, Users } from 'lucide-react';

import { StatCard } from '@/components/charts/stat-card';
import { cn } from '@/lib/cn';
import { formatNumber } from '@/lib/format';

import type { DashboardSummary } from '../types';

interface StatTilesProps {
  summary: DashboardSummary;
  className?: string;
}

/** The three roster totals next to the headline. */
export function StatTiles({ summary, className }: StatTilesProps) {
  const { doctors, patients, criticalPatients } = summary.totals;
  const perDoctor = doctors === 0 ? 0 : Math.round((patients / doctors) * 10) / 10;
  const criticalShare = patients === 0 ? 0 : Math.round((criticalPatients / patients) * 100);

  return (
    <div className={cn('grid grid-cols-2 gap-4 sm:grid-cols-3', className)}>
      <StatCard
        label="Total doctors"
        value={formatNumber(doctors)}
        icon={<Stethoscope aria-hidden />}
        hint={`${String(summary.specializations.length)} specializations`}
      />
      <StatCard
        label="Total patients"
        value={formatNumber(patients)}
        icon={<Users aria-hidden />}
        hint={`${String(perDoctor)} per doctor`}
      />
      <StatCard
        label="Critical now"
        value={formatNumber(criticalPatients)}
        icon={<HeartPulse aria-hidden />}
        hint={`${String(criticalShare)}% of patients`}
        className="max-sm:col-span-2"
      />
    </div>
  );
}
