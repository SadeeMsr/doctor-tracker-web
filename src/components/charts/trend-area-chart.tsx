'use client';

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { ChartTooltip } from './chart-tooltip';

export interface TrendPoint {
  label: string;
  value: number;
}

interface TrendAreaChartProps {
  data: TrendPoint[];
  /** What the values count, e.g. "admissions"; shown in the tooltip. */
  unit: string;
}

const TICK = { fill: 'var(--muted-foreground)', fontSize: 12 };

/**
 * Area chart of one series over time.
 * @example <TrendAreaChart data={[{ label: 'Jan', value: 12 }]} unit="admissions" />
 */
export function TrendAreaChart({ data, unit }: TrendAreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
        <defs>
          <linearGradient id="trend-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.7} />
            <stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 6" />
        <XAxis dataKey="label" tick={TICK} tickLine={false} axisLine={false} minTickGap={24} />
        <YAxis tick={TICK} tickLine={false} axisLine={false} allowDecimals={false} width={48} />
        <Tooltip
          cursor={{ stroke: 'var(--chart-1)', strokeDasharray: '4 4' }}
          content={(props) => <ChartTooltip {...props} unit={unit} />}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke="var(--chart-1)"
          strokeWidth={2.5}
          fill="url(#trend-fill)"
          activeDot={{ r: 5, fill: 'var(--chart-2)', stroke: 'var(--chart-1)', strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
