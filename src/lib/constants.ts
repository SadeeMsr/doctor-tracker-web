export const API_BASE_PATH = '/api/v1';

/** Must match the cookie names set by the API. */
export const AUTH_COOKIES = {
  access: 'dt_access',
  refresh: 'dt_refresh',
} as const;
