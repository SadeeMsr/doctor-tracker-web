'use client';

import { SHORTCUTS } from '@/lib/shortcuts';

import { useShortcut } from './use-shortcut';

interface PageState {
  page: number;
  totalPages: number;
}

/**
 * `[` and `]` step through a paginated list. Call it before any early return; `meta` may be
 * undefined while the first page loads.
 * @example usePagingShortcuts(query.data?.meta, state.setPage);
 */
export function usePagingShortcuts(meta: PageState | undefined, setPage: (page: number) => void) {
  const page = meta?.page ?? 1;
  const totalPages = meta?.totalPages ?? 1;

  useShortcut(SHORTCUTS.previousPage, () => setPage(page - 1), { enabled: page > 1 });
  useShortcut(SHORTCUTS.nextPage, () => setPage(page + 1), { enabled: page < totalPages });
}
