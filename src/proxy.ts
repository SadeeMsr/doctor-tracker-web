import { NextResponse, type NextRequest } from 'next/server';

import { AUTH_COOKIES } from '@/lib/constants';

const PUBLIC_ROUTES = ['/login'];

/**
 * Optimistic route protection: a cheap cookie-presence check that redirects before render.
 * The real authorization happens in the API on every request (JWT verification).
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const hasSession = request.cookies.has(AUTH_COOKIES.refresh);
  const isPublic = PUBLIC_ROUTES.includes(pathname);

  if (!hasSession && !isPublic) {
    const url = new URL('/login', request.url);
    url.searchParams.set('next', pathname + search);
    return NextResponse.redirect(url);
  }

  if (hasSession && isPublic) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Skip API proxying, Next internals and static files.
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp|ico)$).*)',
  ],
};
