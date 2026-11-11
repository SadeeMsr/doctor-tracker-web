import type { ReactNode } from 'react';

import { Card } from '@/components/ui/card';
import { cn } from '@/lib/cn';

interface ChartCardProps {
  title: string;
  description: string;
  /** Controls for this chart, e.g. an interval switch. */
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}

/**
 * Titled panel around a chart.
 * @example <ChartCard title="Admissions" description="Per month">…</ChartCard>
 */
export function ChartCard({ title, description, action, className, children }: ChartCardProps) {
  return (
    <Card className={cn('flex flex-col gap-5 p-5 sm:p-6', className)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {action}
      </div>
      {children}
    </Card>
  );
}
