export const API_BASE_PATH = '/api/v1';

/** Must match the cookie names set by the API. */
export const AUTH_COOKIES = {
  access: 'dt_access',
  refresh: 'dt_refresh',
} as const;

/** Rows per page on every list. */
export const PAGE_SIZE = 10;

export const SEARCH_DEBOUNCE_MS = 300;
