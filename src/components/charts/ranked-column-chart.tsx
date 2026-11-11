'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  type XAxisTickContentProps,
} from 'recharts';

import { initials } from '@/lib/format';

import { ChartTooltip } from './chart-tooltip';
import { scaleColor } from './color-scale';

export interface RankedItem {
  id: string;
  label: string;
  value: number;
}

interface RankedColumnChartProps {
  /** Largest first. */
  items: RankedItem[];
  /** What the values count, e.g. "patients"; shown in the tooltip. */
  unit: string;
  onSelect?: (id: string) => void;
}

/** X-axis tick: an initials badge in the column's own colour. */
function InitialsTick({ x, y, payload, index, visibleTicksCount }: XAxisTickContentProps) {
  const { fill, ink } = scaleColor(index, visibleTicksCount);
  return (
    <g transform={`translate(${String(x)},${String(Number(y) + 16)})`}>
      <circle r={15} fill={fill} />
      <text dy="0.35em" textAnchor="middle" fill={ink} fontSize={11} fontWeight={600}>
        {initials(String(payload.value))}
      </text>
    </g>
  );
}

/**
 * Columns for a ranked list, shaded hunter green → lime, with initials under each column.
 * @example <RankedColumnChart items={[{ id: '1', label: 'Ayesha Rahman', value: 22 }]} unit="patients" />
 */
export function RankedColumnChart({ items, unit, onSelect }: RankedColumnChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={items}
        margin={{ top: 28, right: 4, bottom: 4, left: 4 }}
        barCategoryGap="22%"
      >
        <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 6" />
        <XAxis
          dataKey="label"
          interval={0}
          tickLine={false}
          axisLine={false}
          height={40}
          tick={InitialsTick}
        />
        <Tooltip
          cursor={{ fill: 'var(--subtle)', radius: 12 }}
          content={(props) => <ChartTooltip {...props} unit={unit} />}
        />
        <Bar
          dataKey="value"
          radius={[12, 12, 12, 12]}
          className={onSelect ? 'cursor-pointer' : undefined}
          onClick={(_, index) => {
            const item = items[index];
            if (item) onSelect?.(item.id);
          }}
        >
          {items.map((item, index) => (
            <Cell key={item.id} fill={scaleColor(index, items.length).fill} />
          ))}
          <LabelList
            dataKey="value"
            position="top"
            fill="var(--foreground)"
            fontSize={12}
            fontWeight={600}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
