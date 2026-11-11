import type { FieldValues, Path, UseFormSetError } from 'react-hook-form';

import { isApiError } from './api-client';
import { getErrorMessage } from './errors';

interface Issue {
  path: string;
  message: string;
}

const isIssue = (value: unknown): value is Issue =>
  typeof value === 'object' &&
  value !== null &&
  'path' in value &&
  'message' in value &&
  typeof value.path === 'string' &&
  typeof value.message === 'string';

/** `409 CONFLICT` names the clashing fields in `details.fields`. */
function conflictIssues(details: unknown, message: string): Issue[] {
  if (typeof details !== 'object' || details === null || !('fields' in details)) return [];
  if (!Array.isArray(details.fields)) return [];
  return details.fields
    .filter((field): field is string => typeof field === 'string')
    .map((path) => ({ path, message }));
}

function toIssues(error: unknown): Issue[] {
  if (!isApiError(error)) return [];
  if (error.code === 'VALIDATION_ERROR' && Array.isArray(error.details)) {
    return error.details.filter(isIssue);
  }
  if (error.code === 'CONFLICT') return conflictIssues(error.details, error.message);
  return [];
}

/**
 * Shows an API failure on the form: 422 and 409 land under their fields (the first one gets
 * focus); anything else becomes the form-level `root` error.
 */
export function applyApiErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
  fields: readonly Path<T>[],
): void {
  const isField = (path: string): path is Path<T> => fields.some((field) => field === path);
  const issues = toIssues(error).filter((issue) => isField(issue.path));

  if (issues.length === 0) {
    setError('root', { message: getErrorMessage(error) });
    return;
  }
  issues.forEach((issue, index) => {
    if (isField(issue.path)) {
      setError(issue.path, { message: issue.message }, { shouldFocus: index === 0 });
    }
  });
}
