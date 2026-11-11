import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  /** The next step, e.g. an "Add" or "Clear filters" button. */
  action?: ReactNode;
  className?: string;
}

/**
 * Shown where a list or chart has nothing to display yet.
 * @example <EmptyState icon={<Users />} title="No patients yet" description="…" action={<Button>Add</Button>} />
 */
export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-3 rounded-3xl border border-dashed border-brand/20 px-6 py-14 text-center',
        className,
      )}
    >
      <span className="grid size-14 place-items-center rounded-2xl bg-accent text-accent-foreground [&_svg]:size-6">
        {icon}
      </span>
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
