import { formatNumber } from '@/lib/format';

interface ChartTooltipProps {
  active?: boolean;
  label?: string | number;
  payload?: readonly { value?: unknown }[];
  /** What the number counts, e.g. "admissions". */
  unit: string;
}

/** Tooltip body shared by the Recharts wrappers. */
export function ChartTooltip({ active, label, payload, unit }: ChartTooltipProps) {
  const value = payload?.[0]?.value;
  if (!active || typeof value !== 'number') return null;

  return (
    <div className="rounded-xl bg-brand px-3 py-2 text-brand-foreground shadow-lg">
      <p className="text-xs text-brand-muted">{label}</p>
      <p className="text-sm font-semibold tabular-nums">
        {formatNumber(value)} {unit}
      </p>
    </div>
  );
}
