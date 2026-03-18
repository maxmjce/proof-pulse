import { type NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';
import { updateSession } from '@/lib/supabase/middleware';

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for api routes, embed, static assets
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/embed/') ||
    pathname.startsWith('/_next/') ||
    pathname.match(/\.(svg|png|jpg|jpeg|gif|webp|ico)$/)
  ) {
    return NextResponse.next();
  }

  // Run next-intl middleware first (handles locale detection + redirect)
  const intlResponse = intlMiddleware(request);

  // After intl, run Supabase session refresh + auth protection
  const sessionResponse = await updateSession(request);

  // Merge cookies from both responses
  if (intlResponse.headers.get('location')) {
    // If intl middleware is redirecting (e.g., adding locale prefix), pass through cookies
    sessionResponse.cookies.getAll().forEach((cookie) => {
      intlResponse.cookies.set(cookie.name, cookie.value);
    });
    return intlResponse;
  }

  // Copy intl headers to session response
  intlResponse.headers.forEach((value, key) => {
    sessionResponse.headers.set(key, value);
  });

  return sessionResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/widget|api/webhooks|api/testimonials|api/forms/by-slug|embed|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
