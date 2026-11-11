'use client';

import { format, parseISO, startOfYear, subDays } from 'date-fns';
import { CalendarDays } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toDateInput } from '@/lib/format';

import { filterTriggerStyles } from './filter-trigger';

export interface DateRange {
  /** `YYYY-MM-DD`, or `''` for an open end. */
  from: string;
  to: string;
}

interface DateRangeFilterProps extends DateRange {
  label: string;
  onChange: (range: DateRange) => void;
}

const PRESETS = [
  { label: 'Last 7 days', from: (today: Date) => subDays(today, 6) },
  { label: 'Last 30 days', from: (today: Date) => subDays(today, 29) },
  { label: 'Last 90 days', from: (today: Date) => subDays(today, 89) },
  { label: 'This year', from: (today: Date) => startOfYear(today) },
] as const;

const short = (value: string) => format(parseISO(value), 'd MMM');

function summary({ label, from, to }: Omit<DateRangeFilterProps, 'onChange'>) {
  if (from && to) return `${short(from)} – ${short(to)}`;
  if (from) return `From ${short(from)}`;
  if (to) return `Until ${short(to)}`;
  return label;
}

function Presets({ onChange }: Pick<DateRangeFilterProps, 'onChange'>) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {PRESETS.map((preset) => (
        <Button
          key={preset.label}
          variant="secondary"
          size="sm"
          className="h-8 px-3"
          onClick={() => {
            const today = new Date();
            onChange({ from: toDateInput(preset.from(today)), to: toDateInput(today) });
          }}
        >
          {preset.label}
        </Button>
      ))}
    </div>
  );
}

/**
 * A filter pill for a from/to date range, with quick presets.
 * @example <DateRangeFilter label="Admitted" from={filters.from} to={filters.to} onChange={setRange} />
 */
export function DateRangeFilter({ label, from, to, onChange }: DateRangeFilterProps) {
  const today = toDateInput(new Date());

  return (
    <Popover>
      <PopoverTrigger className={filterTriggerStyles({ isActive: Boolean(from || to) })}>
        <CalendarDays aria-hidden />
        {summary({ label, from, to })}
      </PopoverTrigger>
      <PopoverContent className="w-72 space-y-4">
        <Presets onChange={onChange} />
        <label className="block space-y-1.5 text-xs font-medium text-muted-foreground">
          From
          <Input
            type="date"
            value={from}
            max={to || today}
            onChange={(event) => onChange({ from: event.target.value, to })}
          />
        </label>
        <label className="block space-y-1.5 text-xs font-medium text-muted-foreground">
          To
          <Input
            type="date"
            value={to}
            min={from}
            max={today}
            onChange={(event) => onChange({ from, to: event.target.value })}
          />
        </label>
        <Button
          variant="ghost"
          size="sm"
          className="w-full"
          disabled={!from && !to}
          onClick={() => onChange({ from: '', to: '' })}
        >
          Clear dates
        </Button>
      </PopoverContent>
    </Popover>
  );
}
