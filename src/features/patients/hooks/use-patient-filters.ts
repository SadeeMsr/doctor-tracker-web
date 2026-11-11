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
import { CONDITIONS } from '@/lib/conditions';
import { PAGE_SIZE, SEARCH_DEBOUNCE_MS } from '@/lib/constants';
import { isDateInput } from '@/lib/format';

import { GENDERS, PATIENT_SORT_PARAMS, PATIENT_SORTS } from '../constants';
import type { PatientListParams } from '../types';

const parsers = {
  q: parseAsString.withDefault(''),
  condition: parseAsArrayOf(parseAsStringLiteral(CONDITIONS)).withDefault([]),
  gender: parseAsStringLiteral(GENDERS),
  from: parseAsString.withDefault(''),
  to: parseAsString.withDefault(''),
  sort: parseAsStringLiteral(PATIENT_SORTS).withDefault('recent'),
  page: parseAsInteger.withDefault(1),
};

type Filters = ReturnType<typeof useQueryStates<typeof parsers>>[0];

/** Patient list state lives in the URL: shareable, and the back button undoes a filter. */
export function usePatientFilters() {
  const [filters, setFilters] = useQueryStates(parsers);
  const search = useDebouncedValue(filters.q.trim(), SEARCH_DEBOUNCE_MS);

  // Search, each ticked option, gender and the date range each count as one active filter.
  const activeCount =
    (filters.q ? 1 : 0) +
    filters.condition.length +
    (filters.gender ? 1 : 0) +
    (filters.from || filters.to ? 1 : 0);

  const params: PatientListParams = {
    page: Math.max(1, filters.page),
    limit: PAGE_SIZE,
    search: search || undefined,
    condition: filters.condition.join(',') || undefined,
    gender: filters.gender ?? undefined,
    from: isDateInput(filters.from) ? filters.from : undefined,
    to: isDateInput(filters.to) ? filters.to : undefined,
    ...PATIENT_SORT_PARAMS[filters.sort],
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

export type PatientFilterState = ReturnType<typeof usePatientFilters>;
