'use client';

import { ArrowDownUp, Building2, Stethoscope } from 'lucide-react';

import { ClearFiltersButton } from '@/components/filters/clear-filters-button';
import { DateRangeFilter } from '@/components/filters/date-range-filter';
import { FacetFilter } from '@/components/filters/facet-filter';
import { SearchInput } from '@/components/filters/search-input';
import { useShortcut } from '@/hooks/use-shortcut';
import { SHORTCUTS } from '@/lib/shortcuts';

import { DOCTOR_SORT_OPTIONS, SPECIALIZATION_OPTIONS } from '../constants';
import type { DoctorFilterState } from '../hooks/use-doctor-filters';
import { useHospitals } from '../queries';

/** Search, filters and sort for the doctor list; all of it lives in the URL. */
export function DoctorsToolbar({ state }: { state: DoctorFilterState }) {
  const { filters, update, setSearch, reset, activeCount } = state;
  useShortcut(SHORTCUTS.clearFilters, reset, { enabled: activeCount > 0 });
  const hospitals = useHospitals();
  const hospitalOptions = (hospitals.data ?? []).map((name) => ({ value: name, label: name }));

  return (
    <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
      <SearchInput
        label="Search by name or email"
        value={filters.q}
        onChange={setSearch}
        className="xl:w-80"
      />
      <div className="flex flex-wrap items-center gap-2">
        <FacetFilter
          label="Specialization"
          icon={<Stethoscope aria-hidden />}
          isMultiple
          options={SPECIALIZATION_OPTIONS}
          selected={filters.specialization}
          onChange={(specialization) => update({ specialization })}
        />
        <FacetFilter
          label="Hospital"
          icon={<Building2 aria-hidden />}
          isMultiple
          options={hospitalOptions}
          selected={filters.hospital}
          onChange={(hospital) => update({ hospital })}
        />
        <DateRangeFilter
          label="Date added"
          from={filters.from}
          to={filters.to}
          onChange={(range) => update(range)}
        />
        <FacetFilter
          label="Sort"
          icon={<ArrowDownUp aria-hidden />}
          options={DOCTOR_SORT_OPTIONS}
          selected={[filters.sort]}
          onChange={([sort]) => update({ sort: sort ?? 'newest' })}
        />
        <ClearFiltersButton count={activeCount} onClear={reset} />
      </div>
    </div>
  );
}
