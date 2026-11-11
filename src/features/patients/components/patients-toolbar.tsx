'use client';

import { Activity, ArrowDownUp, UserRound } from 'lucide-react';

import { ClearFiltersButton } from '@/components/filters/clear-filters-button';
import { DateRangeFilter } from '@/components/filters/date-range-filter';
import { FacetFilter } from '@/components/filters/facet-filter';
import { SearchInput } from '@/components/filters/search-input';
import { useShortcut } from '@/hooks/use-shortcut';
import { SHORTCUTS } from '@/lib/shortcuts';

import { CONDITION_OPTIONS, GENDER_OPTIONS, PATIENT_SORT_OPTIONS } from '../constants';
import type { PatientFilterState } from '../hooks/use-patient-filters';

/** Search, filters and sort for a patient list; all of it lives in the URL. */
export function PatientsToolbar({ state }: { state: PatientFilterState }) {
  const { filters, update, setSearch, reset, activeCount } = state;
  useShortcut(SHORTCUTS.clearFilters, reset, { enabled: activeCount > 0 });

  return (
    <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
      <SearchInput
        label="Search by name"
        value={filters.q}
        onChange={setSearch}
        className="xl:w-80"
      />
      <div className="flex flex-wrap items-center gap-2">
        <FacetFilter
          label="Condition"
          icon={<Activity aria-hidden />}
          isMultiple
          options={CONDITION_OPTIONS}
          selected={filters.condition}
          onChange={(condition) => update({ condition })}
        />
        <FacetFilter
          label="Gender"
          icon={<UserRound aria-hidden />}
          allLabel="Any gender"
          options={GENDER_OPTIONS}
          selected={filters.gender ? [filters.gender] : []}
          onChange={([gender]) => update({ gender: gender ?? null })}
        />
        <DateRangeFilter
          label="Admission date"
          from={filters.from}
          to={filters.to}
          onChange={(range) => update(range)}
        />
        <FacetFilter
          label="Sort"
          icon={<ArrowDownUp aria-hidden />}
          options={PATIENT_SORT_OPTIONS}
          selected={[filters.sort]}
          onChange={([sort]) => update({ sort: sort ?? 'recent' })}
        />
        <ClearFiltersButton count={activeCount} onClear={reset} />
      </div>
    </div>
  );
}
