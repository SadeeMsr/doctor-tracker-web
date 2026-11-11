import { CONDITION_META, CONDITIONS } from '@/lib/conditions';

/** Must match the API's `GENDERS`. */
export const GENDERS = ['female', 'male', 'other'] as const;
export type Gender = (typeof GENDERS)[number];

export const CONDITION_OPTIONS = CONDITIONS.map((value) => ({
  value,
  label: CONDITION_META[value].label,
}));

export const GENDER_LABELS = { female: 'Female', male: 'Male', other: 'Other' } as const;
export const GENDER_OPTIONS = GENDERS.map((value) => ({ value, label: GENDER_LABELS[value] }));

export const PATIENT_SORTS = ['recent', 'earliest', 'name-asc', 'name-desc'] as const;
export type PatientSort = (typeof PATIENT_SORTS)[number];

export const PATIENT_SORT_OPTIONS = [
  { value: 'recent', label: 'Recently admitted' },
  { value: 'earliest', label: 'Earliest admitted' },
  { value: 'name-asc', label: 'Name A–Z' },
  { value: 'name-desc', label: 'Name Z–A' },
] as const satisfies readonly { value: PatientSort; label: string }[];

export const PATIENT_SORT_PARAMS = {
  recent: { sortBy: 'admittedAt', sortOrder: 'desc' },
  earliest: { sortBy: 'admittedAt', sortOrder: 'asc' },
  'name-asc': { sortBy: 'name', sortOrder: 'asc' },
  'name-desc': { sortBy: 'name', sortOrder: 'desc' },
} as const satisfies Record<PatientSort, { sortBy: string; sortOrder: 'asc' | 'desc' }>;

/** The reassignment picker loads this many doctors (the API's page-size cap). */
export const DOCTOR_OPTIONS_LIMIT = 100;
