/** Mirrors the API's `toListResponse` meta exactly. */
export interface PageMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface Paginated<T> {
  data: T[];
  meta: PageMeta;
}

export interface Single<T> {
  data: T;
}
