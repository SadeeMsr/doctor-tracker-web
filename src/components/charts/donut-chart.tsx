'use client';

import { Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

import { formatNumber } from '@/lib/format';

import { ChartTooltip } from './chart-tooltip';

export interface DonutSegment {
  name: string;
  value: number;
  /** A CSS colour, normally a design token: `var(--status-critical)`. */
  fill: string;
}

interface DonutChartProps {
  segments: DonutSegment[];
  /** Printed in the hole, under the total. */
  totalLabel: string;
  unit: string;
}

/**
 * Donut with the total in the middle. Show a legend next to it: colour alone is not a label.
 * @example <DonutChart segments={segments} totalLabel="patients" unit="patients" />
 */
export function DonutChart({ segments, totalLabel, unit }: DonutChartProps) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);

  return (
    <div className="relative size-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip
            content={(props) => (
              <ChartTooltip {...props} label={String(props.payload[0]?.name ?? '')} unit={unit} />
            )}
          />
          <Pie
            data={segments}
            dataKey="value"
            nameKey="name"
            innerRadius="68%"
            outerRadius="100%"
            paddingAngle={2}
            cornerRadius={6}
            stroke="none"
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 grid place-content-center text-center">
        <p className="text-3xl font-semibold tracking-tight tabular-nums">{formatNumber(total)}</p>
        <p className="text-xs text-muted-foreground">{totalLabel}</p>
      </div>
    </div>
  );
}
