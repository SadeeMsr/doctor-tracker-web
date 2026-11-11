import Link from 'next/link';

import { BarList } from '@/components/charts/bar-list';
import { ChartCard } from '@/components/charts/chart-card';

import type { DashboardSummary } from '../types';

interface RankingCardProps {
  summary: DashboardSummary;
  className?: string;
}

/** Patients per doctor: the busiest caseloads, each linked to the doctor. */
export function CaseloadCard({ summary, className }: RankingCardProps) {
  const items = summary.topDoctors.map(({ doctor, patients }) => ({
    id: doctor.id,
    label: doctor.name,
    hint: doctor.specialization,
    value: patients,
  }));

  return (
    <ChartCard
      className={className}
      title="Patients per doctor"
      description={`The ${String(items.length)} largest caseloads`}
    >
      <BarList
        items={items}
        renderLabel={(item) => (
          <Link href={`/doctors/${item.id}`} className="underline-offset-4 hover:underline">
            {item.label}
          </Link>
        )}
      />
    </ChartCard>
  );
}

/** Where the patients are, by medical specialization. */
export function SpecializationsCard({ summary, className }: RankingCardProps) {
  const items = [...summary.specializations]
    .sort((a, b) => b.patients - a.patients)
    .slice(0, 8)
    .map(({ specialization, doctors, patients }) => ({
      id: specialization,
      label: specialization,
      hint: `${String(doctors)} ${doctors === 1 ? 'doctor' : 'doctors'}`,
      value: patients,
    }));

  return (
    <ChartCard
      className={className}
      title="Patients by specialization"
      description="Demand across the top departments"
    >
      <BarList items={items} />
    </ChartCard>
  );
}
