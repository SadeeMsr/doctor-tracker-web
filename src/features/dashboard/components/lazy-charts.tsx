'use client';

import dynamic from 'next/dynamic';

import { Skeleton } from '@/components/ui/skeleton';

const loading = () => <Skeleton className="size-full" />;

/** Recharts is heavy and browser-only: load it after the page shell, never on the server. */
export const LazyTrendAreaChart = dynamic(
  () => import('@/components/charts/trend-area-chart').then((module) => module.TrendAreaChart),
  { ssr: false, loading },
);

export const LazyDonutChart = dynamic(
  () => import('@/components/charts/donut-chart').then((module) => module.DonutChart),
  { ssr: false, loading },
);
