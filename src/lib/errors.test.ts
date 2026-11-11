import { describe, expect, it } from 'vitest';

import { ApiError } from '@/lib/api-client';
import { getErrorMessage, getErrorReference, isSilentError } from '@/lib/errors';

const apiError = (status: number, code: string, message = 'From the API') =>
  new ApiError(status, { code, message, requestId: 'req-42' });

describe('user-facing error messages', () => {
  it('uses friendly copy for codes not meant for users', () => {
    expect(getErrorMessage(apiError(0, 'NETWORK_ERROR'))).toMatch(/offline/i);
    expect(getErrorMessage(apiError(500, 'INTERNAL_ERROR'))).toMatch(/our side/i);
  });

  it("keeps the API's own message when it is written for users", () => {
    expect(
      getErrorMessage(apiError(409, 'CONFLICT', 'A doctor with this email already exists')),
    ).toBe('A doctor with this email already exists');
  });

  it('never shows raw text from unknown errors', () => {
    expect(getErrorMessage(new Error('TypeError: x is undefined'))).toBe(
      'Something went wrong. Please try again.',
    );
  });

  it('exposes the request id as a support reference and keeps 401s silent', () => {
    expect(getErrorReference(apiError(422, 'VALIDATION_ERROR'))).toBe('req-42');
    expect(isSilentError(apiError(401, 'UNAUTHORIZED'))).toBe(true);
    expect(isSilentError(apiError(404, 'NOT_FOUND'))).toBe(false);
  });
});
