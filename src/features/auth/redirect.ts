import type { Route } from 'next';

/**
 * Where to go after login. Only same-site paths are allowed, so a crafted
 * `?next=https://evil.example` (or `//evil.example`) can't turn login into an open redirect.
 */
export function safeNextPath(next: string | null): Route {
  if (!next?.startsWith('/') || next.startsWith('//') || next.startsWith('/\\')) return '/';
  if (next.startsWith('/login')) return '/';
  return next as Route;
}
