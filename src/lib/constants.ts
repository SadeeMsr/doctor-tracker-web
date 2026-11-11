export const API_BASE_PATH = '/api/v1';

/** Must match the cookie names set by the API. */
export const AUTH_COOKIES = {
  access: 'dt_access',
  refresh: 'dt_refresh',
} as const;

/** Rows per page on every list. */
export const PAGE_SIZE = 10;

export const SEARCH_DEBOUNCE_MS = 300;

/**
 * URL parameter that opens the Add patient dialog for a doctor (`?addPatient=<doctorId>`). The
 * doctors list sets it and the patients feature reads it, so neither imports the other.
 */
export const ADD_PATIENT_PARAM = 'addPatient';
