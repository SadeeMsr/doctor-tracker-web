import type { ReactNode } from 'react';

import { Card } from '@/components/ui/card';
import { cn } from '@/lib/cn';

interface StatCardProps {
  label: string;
  value: string;
  icon: ReactNode;
  /** One short line of context under the number. */
  hint?: string;
  className?: string;
}

/**
 * One headline number.
 * @example <StatCard label="Total doctors" value="48" icon={<Stethoscope />} hint="Across 9 hospitals" />
 */
export function StatCard({ label, value, icon, hint, className }: StatCardProps) {
  return (
    <Card className={cn('flex flex-col justify-between gap-8 p-5', className)}>
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-medium text-muted-foreground">{label}</h3>
        <span className="grid size-9 place-items-center rounded-full bg-canvas-soft text-brand-ink [&_svg]:size-4">
          {icon}
        </span>
      </div>
      <div className="space-y-1">
        <p className="text-4xl font-semibold tracking-[-0.03em] tabular-nums">{value}</p>
        {hint && <p className="truncate text-xs text-muted-foreground">{hint}</p>}
      </div>
    </Card>
  );
}
