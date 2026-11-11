'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { ChartCard } from '@/components/charts/chart-card';

import type { DashboardSummary } from '../types';

import { LazyRankedColumnChart, LazyTreemapChart } from './lazy-charts';
import { toSpecializationTiles } from './specialization-tiles';

interface RankingCardProps {
  summary: DashboardSummary;
  className?: string;
}

/** Patients per doctor: the busiest caseloads; a column opens that doctor. */
export function CaseloadCard({ summary, className }: RankingCardProps) {
  const router = useRouter();
  const items = summary.topDoctors.map(({ doctor, patients }) => ({
    id: doctor.id,
    label: doctor.name,
    value: patients,
  }));

  return (
    <ChartCard
      className={className}
      title="Patients per doctor"
      description={`Top ${String(items.length)} caseloads · select a column to open`}
    >
      <div className="h-80">
        <LazyRankedColumnChart
          items={items}
          unit="patients"
          onSelect={(id) => router.push(`/doctors/${id}`)}
        />
      </div>
      {/* The same data as links, for screen readers and keyboard users. */}
      <ul className="sr-only">
        {summary.topDoctors.map(({ doctor, patients }) => (
          <li key={doctor.id}>
            <Link href={`/doctors/${doctor.id}`}>
              {doctor.name}, {doctor.specialization}: {patients} patients
            </Link>
          </li>
        ))}
      </ul>
    </ChartCard>
  );
}

/** Where the patients are, by specialization; a tile opens the doctors in it. */
export function SpecializationsCard({ summary, className }: RankingCardProps) {
  const router = useRouter();
  const tiles = toSpecializationTiles(summary.specializations);
  const openSpecialization = (specialization: string) =>
    router.push(`/doctors?specialization=${encodeURIComponent(specialization)}`);

  return (
    <ChartCard
      className={className}
      title="Patients by specialization"
      description="Tile size is each department’s share of patients"
    >
      <div className="h-80">
        <LazyTreemapChart items={tiles} unit="patients" onSelect={openSpecialization} />
      </div>
      <ul className="sr-only">
        {tiles.map((tile) => (
          <li key={tile.label}>
            {tile.label}: {tile.value} patients{tile.hint && `, ${tile.hint}`}
          </li>
        ))}
      </ul>
    </ChartCard>
  );
}
