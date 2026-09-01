// proxy.ts  (root level — Next.js 16 এ middleware.ts এর পরিবর্তে এটাই)

import { NextResponse, type NextRequest } from 'next/server';

// ─── Environment ────────────────────────────────────────────────────────────
const SERVER_API_URL = `${process.env.NEXT_PUBLIC_BACKEND_LOCAL_URL}/api/v1`;

const AUTH_PREFIXES = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/send-verify-email',
  '/otp-verify',
  '/org/login',
  '/org/forgot-password',
  '/org/reset-password',
  '/org/verify-email',
  '/org/otp-verify',
  '/org/send-verify-email',
  '/admin-login',
];

const PUBLIC_PREFIXES = ['/', '/jobs', '/companies', '/pricing', '/salary-guide'];

const ROLE_HOME: Record<string, string> = {
  USER: '/user',
  ORGANIZATION: '/organization',
  ADMIN: '/admin',
};

const PROTECTED_PREFIX_ROLE: Record<string, string> = {
  '/user': 'USER',
  '/organization': 'ORGANIZATION',
  '/admin': 'ADMIN',
};

function matchesPrefix(pathname: string, prefixes: string[]): boolean {
  return prefixes.some((p) => pathname === p || pathname.startsWith(p + '/'));
}

//  decode JWT tokens and verify expiry
//  jsonwebtoken doesn't execute on Middleware edge runtime  so we need to      //decode  manually
function isTokenExpired(token: string): boolean {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;

    // Base64URL decode the payload
    const payload = parts[1];
    if (!payload) return true;

    // Base64URL → Base64 → JSON
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const jsonStr = atob(base64);
    const decoded = JSON.parse(jsonStr) as { exp?: number };

    if (typeof decoded.exp !== 'number') return true;

    // keeps 10 seconds buffer with exact expiry
    const nowInSeconds = Math.floor(Date.now() / 1000);
    return decoded.exp < nowInSeconds + 10;
  } catch {
    return true;
  }
}

function redirectToLogin(request: NextRequest, reason?: string): NextResponse {
  const url = new URL('/login', request.url);
  if (reason) url.searchParams.set('reason', reason);
  const res = NextResponse.redirect(url);
  res.cookies.delete('access_token');
  res.cookies.delete('refresh_token');
  res.cookies.delete('userRole');
  res.cookies.delete('remember_me');
  return res;
}

async function rotateToken(request: NextRequest): Promise<{
  success: boolean;
  accessToken: string | null;
  setCookies: string[];
}> {
  const role = request.cookies.get('userRole')?.value;
  const endpoint =
    role === 'ORGANIZATION'
      ? '/auth/org/refresh-token'
      : role === 'ADMIN'
        ? '/auth/admin/refresh-token'
        : '/auth/user/refresh-token';

  try {
    const res = await fetch(`${SERVER_API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: request.headers.get('cookie') ?? '',
      },
      cache: 'no-store',
    });

    if (!res.ok) return { success: false, accessToken: null, setCookies: [] };

    const body = (await res.json()) as { data?: { accessToken?: string } };
    const accessToken = body.data?.accessToken ?? null;
    const setCookies = res.headers.getSetCookie?.() ?? [];

    if (!accessToken) return { success: false, accessToken: null, setCookies: [] };

    return { success: true, accessToken, setCookies };
  } catch {
    return { success: false, accessToken: null, setCookies: [] };
  }
}

function buildNextResponse(
  request: NextRequest,
  accessToken: string,
  setCookies: string[],
): NextResponse {
  const reqHeaders = new Headers(request.headers);
  //  Custom header inject — serverFetch will read it
  reqHeaders.set('x-refreshed-access-token', accessToken);

  const response = NextResponse.next({ request: { headers: reqHeaders } });

  // attached Set-Cookie for browser
  for (const cookie of setCookies) {
    response.headers.append('Set-Cookie', cookie);
  }

  return response;
}

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get('access_token')?.value;
  const refreshToken = request.cookies.get('refresh_token')?.value;
  const userRole = request.cookies.get('userRole')?.value;

  // check if cookie exist and check validation
  const tokenMissingOrExpired = !accessToken || isTokenExpired(accessToken);
  const hasRefresh = Boolean(refreshToken);

  // ── 1. Auth pages ────────────────────────────────────────────────────────
  if (matchesPrefix(pathname, AUTH_PREFIXES)) {
    // if token is valid then redirect to dashboard
    if (!tokenMissingOrExpired && userRole) {
      return NextResponse.redirect(new URL(`${ROLE_HOME[userRole]}/dashboard`, request.url));
    }
    return NextResponse.next();
  }

  // ── 2. Public pages ──────────────────────────────────────────────────────
  if (matchesPrefix(pathname, PUBLIC_PREFIXES)) {
    if (tokenMissingOrExpired && hasRefresh) {
      const { success, accessToken: newToken, setCookies } = await rotateToken(request);
      if (success && newToken) {
        return buildNextResponse(request, newToken, setCookies);
      }
    }
    return NextResponse.next();
  }

  // ── 3. Protected routes ──────────────────────────────────────────────────
  const protectedEntry = Object.entries(PROTECTED_PREFIX_ROLE).find(([prefix]) =>
    pathname.startsWith(prefix),
  );

  if (protectedEntry) {
    const [, requiredRole] = protectedEntry;

    // Token missing or expired
    if (tokenMissingOrExpired) {
      if (!hasRefresh) {
        const url = new URL('/login', request.url);
        url.searchParams.set('redirect', pathname);
        return NextResponse.redirect(url);
      }

      // try rotate tokens
      const { success, accessToken: newToken, setCookies } = await rotateToken(request);

      if (!success || !newToken) {
        return redirectToLogin(request, 'session_expired');
      }

      // Role mismatch check
      if (userRole && userRole !== requiredRole) {
        return NextResponse.redirect(new URL(`${ROLE_HOME[userRole]}/dashboard`, request.url));
      }

      return buildNextResponse(request, newToken, setCookies);
    }

    // Token valid but mismatched
    if (userRole && userRole !== requiredRole) {
      return NextResponse.redirect(new URL(`${ROLE_HOME[userRole]}/dashboard`, request.url));
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)|api/).*)',
  ],
};
