import type { ReactNode } from 'react';

interface PageHeaderProps {
  /** Small label above the title, e.g. the section name. */
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
}

/**
 * The top of every page: eyebrow, title, description, then the primary action.
 * @example <PageHeader eyebrow="Directory" title="Doctors" description="…" actions={<Button>Add</Button>} />
 */
export function PageHeader({ eyebrow, title, description, actions }: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0 space-y-2">
        <p className="font-mono text-[0.7rem] tracking-[0.2em] text-muted-foreground uppercase">
          {eyebrow}
        </p>
        <h1 className="text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">{title}</h1>
        <p className="max-w-xl text-[0.95rem] text-muted-foreground">{description}</p>
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}
