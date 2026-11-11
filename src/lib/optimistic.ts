import type { QueryClient, QueryKey } from '@tanstack/react-query';

import type { Paginated } from './types';

export type ListSnapshot<T> = [QueryKey, Paginated<T> | undefined][];

/** Optimistically drops one row from every cached page under `listsKey`; returns the rollback. */
export async function removeFromLists<T extends { id: string }>(
  queryClient: QueryClient,
  listsKey: QueryKey,
  id: string,
): Promise<ListSnapshot<T>> {
  await queryClient.cancelQueries({ queryKey: listsKey });
  const snapshot = queryClient.getQueriesData<Paginated<T>>({ queryKey: listsKey });
  queryClient.setQueriesData<Paginated<T>>({ queryKey: listsKey }, (page) => {
    if (!page?.data.some((row) => row.id === id)) return page;
    return {
      data: page.data.filter((row) => row.id !== id),
      meta: { ...page.meta, total: Math.max(0, page.meta.total - 1) },
    };
  });
  return snapshot;
}

export function restoreLists<T>(queryClient: QueryClient, snapshot: ListSnapshot<T>): void {
  for (const [key, page] of snapshot) queryClient.setQueryData(key, page);
}
