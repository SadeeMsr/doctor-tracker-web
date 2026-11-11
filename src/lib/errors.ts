import { isApiError } from './api-client';

const FALLBACK_ERROR_MESSAGE = 'Something went wrong. Please try again.';

/**
 * User-facing copy for error codes whose API message isn't meant for end users, or that come
 * from the client itself. Other codes (including 401 "Invalid email or password" and 403) use
 * the API's `message`, which is written for users and more specific than any generic copy.
 * When the API adds a code, add its message here in the same change.
 */
const MESSAGES: Readonly<Record<string, string>> = {
  NETWORK_ERROR: "You're offline or the server is unreachable. Check your connection and retry.",
  UNEXPECTED_RESPONSE: 'The server sent an unexpected response. Please try again.',
  INTERNAL_ERROR: 'Something went wrong on our side. Please try again.',
  TOO_MANY_REQUESTS: 'Too many attempts. Wait a moment and try again.',
  IDEMPOTENCY_IN_PROGRESS: 'Your previous request is still being processed.',
  IDEMPOTENCY_KEY_REUSED: 'This form was already submitted with different values. Reopen it.',
};

/** The one place that turns any thrown value into text safe to show a user. */
export function getErrorMessage(error: unknown): string {
  if (!isApiError(error)) return FALLBACK_ERROR_MESSAGE;
  return MESSAGES[error.code] ?? (error.message || FALLBACK_ERROR_MESSAGE);
}

/**
 * An id the user can quote in a support request: the API `requestId`, or Next's `digest` for
 * server-render errors. Both match a server log line.
 */
export function getErrorReference(error: unknown): string | undefined {
  if (isApiError(error)) return error.requestId;
  if (error instanceof Error && 'digest' in error && typeof error.digest === 'string') {
    return error.digest;
  }
  return undefined;
}

/** Errors that must never produce a toast: the 401 flow redirects to login on its own. */
export function isSilentError(error: unknown): boolean {
  return isApiError(error) && error.status === 401;
}
