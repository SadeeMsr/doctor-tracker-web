import { isApiError } from './api-client';

const IN_PROGRESS_RETRY_MS = 1000;

/**
 * The API answers `409 IDEMPOTENCY_IN_PROGRESS` when the first attempt with this key is still
 * running. Wait and ask once more: the second answer is the stored result of the first.
 */
export async function retryWhileInProgress<T>(request: () => Promise<T>): Promise<T> {
  try {
    return await request();
  } catch (error) {
    if (!(isApiError(error) && error.code === 'IDEMPOTENCY_IN_PROGRESS')) throw error;
    await new Promise((resolve) => setTimeout(resolve, IN_PROGRESS_RETRY_MS));
    return request();
  }
}

/** A `DELETE` that answers 404 already reached the wanted state, so it counts as success. */
export async function ignoreNotFound(request: Promise<void>): Promise<void> {
  try {
    await request;
  } catch (error) {
    if (isApiError(error) && error.status === 404) return;
    throw error;
  }
}
