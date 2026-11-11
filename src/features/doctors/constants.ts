/** Must match the API's `SPECIALIZATIONS`. */
export const SPECIALIZATIONS = [
  'Cardiology',
  'Dermatology',
  'Endocrinology',
  'Gastroenterology',
  'General Medicine',
  'Gynecology',
  'Neurology',
  'Oncology',
  'Ophthalmology',
  'Orthopedics',
  'Pediatrics',
  'Psychiatry',
  'Pulmonology',
  'Radiology',
  'Surgery',
  'Urology',
] as const;

export const SPECIALIZATION_OPTIONS = SPECIALIZATIONS.map((value) => ({ value, label: value }));

export const DOCTOR_SORTS = ['newest', 'oldest', 'name-asc', 'name-desc'] as const;
export type DoctorSort = (typeof DOCTOR_SORTS)[number];

export const DOCTOR_SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'name-asc', label: 'Name A–Z' },
  { value: 'name-desc', label: 'Name Z–A' },
] as const satisfies readonly { value: DoctorSort; label: string }[];

export const DOCTOR_SORT_PARAMS = {
  newest: { sortBy: 'createdAt', sortOrder: 'desc' },
  oldest: { sortBy: 'createdAt', sortOrder: 'asc' },
  'name-asc': { sortBy: 'name', sortOrder: 'asc' },
  'name-desc': { sortBy: 'name', sortOrder: 'desc' },
} as const satisfies Record<DoctorSort, { sortBy: string; sortOrder: 'asc' | 'desc' }>;
