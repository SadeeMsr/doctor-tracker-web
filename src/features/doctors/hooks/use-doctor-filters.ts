'use client';

import {
  debounce,
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
  useQueryStates,
} from 'nuqs';

import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { PAGE_SIZE, SEARCH_DEBOUNCE_MS } from '@/lib/constants';
import { isDateInput } from '@/lib/format';

import { DOCTOR_SORT_PARAMS, DOCTOR_SORTS, SPECIALIZATIONS } from '../constants';
import type { DoctorListParams } from '../types';

const parsers = {
  q: parseAsString.withDefault(''),
  specialization: parseAsArrayOf(parseAsStringLiteral(SPECIALIZATIONS)).withDefault([]),
  // `|` separates hospitals in the URL: names may contain commas.
  hospital: parseAsArrayOf(parseAsString, '|').withDefault([]),
  from: parseAsString.withDefault(''),
  to: parseAsString.withDefault(''),
  sort: parseAsStringLiteral(DOCTOR_SORTS).withDefault('newest'),
  page: parseAsInteger.withDefault(1),
};

type Filters = ReturnType<typeof useQueryStates<typeof parsers>>[0];

/** Doctor list state lives in the URL: shareable, and the back button undoes a filter. */
export function useDoctorFilters() {
  const [filters, setFilters] = useQueryStates(parsers);
  const search = useDebouncedValue(filters.q.trim(), SEARCH_DEBOUNCE_MS);

  // Search, each ticked option and the date range each count as one active filter.
  const activeCount =
    (filters.q ? 1 : 0) +
    filters.specialization.length +
    filters.hospital.length +
    (filters.from || filters.to ? 1 : 0);

  const params: DoctorListParams = {
    page: Math.max(1, filters.page),
    limit: PAGE_SIZE,
    search: search || undefined,
    specialization: filters.specialization.length ? filters.specialization : undefined,
    hospital: filters.hospital.length ? filters.hospital : undefined,
    from: isDateInput(filters.from) ? filters.from : undefined,
    to: isDateInput(filters.to) ? filters.to : undefined,
    ...DOCTOR_SORT_PARAMS[filters.sort],
  };

  return {
    filters,
    params,
    activeCount,
    hasFilters: activeCount > 0,
    /** Any filter change returns to the first page. */
    update: (patch: Partial<Omit<Filters, 'page' | 'q'>>) => void setFilters({ ...patch, page: 1 }),
    setSearch: (q: string) =>
      void setFilters({ q, page: 1 }, { limitUrlUpdates: debounce(SEARCH_DEBOUNCE_MS) }),
    setPage: (page: number) => void setFilters({ page }),
    reset: () => void setFilters(null),
  };
}

export type DoctorFilterState = ReturnType<typeof useDoctorFilters>;
