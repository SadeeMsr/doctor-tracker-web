'use client';

import { ArrowDownUp, Building2, Stethoscope, X } from 'lucide-react';

import { DateRangeFilter } from '@/components/filters/date-range-filter';
import { FacetFilter } from '@/components/filters/facet-filter';
import { SearchInput } from '@/components/filters/search-input';
import { Button } from '@/components/ui/button';

import { DOCTOR_SORT_OPTIONS, SPECIALIZATION_OPTIONS } from '../constants';
import type { DoctorFilterState } from '../hooks/use-doctor-filters';
import { useHospitals } from '../queries';

/** Search, filters and sort for the doctor list; all of it lives in the URL. */
export function DoctorsToolbar({ state }: { state: DoctorFilterState }) {
  const { filters, update, setSearch, reset, hasFilters } = state;
  const hospitals = useHospitals();
  const hospitalOptions = (hospitals.data ?? []).map((name) => ({ value: name, label: name }));

  return (
    <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
      <SearchInput
        label="Search by name or email"
        value={filters.q}
        onChange={setSearch}
        className="bg-surface ring-border xl:w-80"
      />
      <div className="flex flex-wrap items-center gap-2">
        <FacetFilter
          label="Specialization"
          icon={<Stethoscope aria-hidden />}
          allLabel="All specializations"
          options={SPECIALIZATION_OPTIONS}
          selected={filters.specialization ? [filters.specialization] : []}
          onChange={([specialization]) => update({ specialization: specialization ?? null })}
        />
        <FacetFilter
          label="Hospital"
          icon={<Building2 aria-hidden />}
          allLabel="All hospitals"
          options={hospitalOptions}
          selected={filters.hospital ? [filters.hospital] : []}
          onChange={([hospital]) => update({ hospital: hospital ?? '' })}
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
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={reset}>
            <X aria-hidden />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
