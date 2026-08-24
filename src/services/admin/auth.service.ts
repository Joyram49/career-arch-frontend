'use server';
import type { IAdmin } from '@app-types/auth';
import { envConfig } from '@config/envConfig';
import { serverFetchOrRedirect } from '@lib/server-fetch';
import { cookies } from 'next/headers';

// ── Types ──────────────────────────────────────────────────────────────────

export interface AdminLoginInput {
  email: string;
  password: string;
}

/** Shape of backend's standard success response */
interface BackendResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Array<{ field: string; message: string }>;
}

interface AdminLoginData {
  admin: IAdmin;
  accessToken: string;
}

interface AdminMeData {
  admin: IAdmin;
}

interface RefreshTokenData {
  accessToken: string;
}

/** What loginAdmin returns to the component */
export type AdminLoginResult =
  | { success: true; admin: IAdmin }
  | { success: false; message: string; fieldErrors?: Array<{ field: string; message: string }> };

/** What logoutAdmin returns to the component */
export type AdminLogoutResult = { success: true } | { success: false; message: string };

/** What getAdminMe returns to the component */
export type AdminMeResult = { success: true; admin: IAdmin } | { success: false; message: string };

/** What refreshAdminToken returns */
export type AdminRefreshResult =
  | { success: true; accessToken: string }
  | { success: false; message: string };

// ── Login ──────────────────────────────────────────────────────────────────

/**
 * POST /auth/admin/login
 *
 * Authenticates admin credentials. On success the backend sets two
 * HttpOnly cookies: `accessToken` + `refreshToken`. We only surface
 * the `admin` object — never the raw token string.
 * for cookies --> followed the same rules for user login
 */
export async function loginAdmin(data: AdminLoginInput): Promise<AdminLoginResult> {
  try {
    const res = await fetch(`${envConfig.serverApiUrl}/auth/admin/login`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(data),
      cache: 'no-store',
    });

    const json: BackendResponse<AdminLoginData> = await res.json();

    // Rate limited
    if (res.status === 429) {
      return {
        success: false,
        message: 'Too many login attempts. Please wait 15 minutes and try again.',
      };
    }

    // Backend returned a business-logic failure (wrong creds, suspended, etc.)
    if (!res.ok || !json.success) {
      return {
        success: false,
        message: json.message ?? 'Login failed. Please try again.',
        ...(json.errors !== undefined && json.errors.length > 0
          ? { fieldErrors: json.errors }
          : {}),
      };
    }

    if (json.data === undefined) {
      return { success: false, message: 'Unexpected server response. Please try again.' };
    }

    const cookieStore = await cookies();
    const setCookieHeaders = res.headers.getSetCookie?.() ?? [];

    for (const rawCookie of setCookieHeaders) {
      const [nameValue, ...attributes] = rawCookie.split(';').map((s) => s.trim());

      if (!nameValue) continue;
      const eqIdx = nameValue.indexOf('=');
      const name = nameValue.slice(0, eqIdx);
      const value = nameValue.slice(eqIdx + 1);

      const attrMap: Record<string, string | boolean> = {};
      for (const attr of attributes) {
        const [k, v] = attr.split('=').map((s) => s.trim());
        if (!k) continue;

        attrMap[k.toLowerCase()] = v ?? true;
      }

      cookieStore.set(name, value, {
        httpOnly: attrMap['httpOnly'] === true,
        secure: attrMap['secure'] === true,
        sameSite: (attrMap['samesite'] as 'strict' | 'lax' | 'none') ?? 'lax',
        path: (attrMap['path'] as string) ?? '/',
        maxAge:
          attrMap['max-age'] !== undefined
            ? parseInt(attrMap['max-age'] as string, 10)
            : 7 * 24 * 60 * 60,
      });
    }

    // Set readable role cookie for proxy.ts
    cookieStore.set('userRole', 'ADMIN', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });

    return { success: true, admin: json.data.admin };
  } catch (err: unknown) {
    // fetch() only throws on genuine network failures — not HTTP error codes
    return { success: false, message: networkErrorMessage(err) };
  }
}

// ── Logout ─────────────────────────────────────────────────────────────────

/**
 * POST /auth/admin/logout
 *
 * Blacklists the JTI in Redis and revokes the refresh token in DB.
 * Backend clears the HttpOnly cookies via Set-Cookie headers.
 *
 * Non-blocking by design — callers clear local Zustand state regardless
 * of whether this request succeeds (e.g. token already expired).
 */
export async function logoutAdmin(): Promise<AdminLogoutResult> {
  try {
    await serverFetchOrRedirect(`/auth/admin/logout`, {
      method: 'POST',
    });

    // clear all cookies
    const cookieStore = await cookies();
    cookieStore.delete('access_token');
    cookieStore.delete('refresh_token');
    cookieStore.delete('userRole');
  } catch {
    // Network error during logout — never block the user from logging out locally
    return {
      success: false,
      message: 'Could not reach server — session cleared locally.',
    };
  }
}

// ── Refresh Token ──────────────────────────────────────────────────────────

/**
 * POST /auth/admin/refresh-token
 *
 * Uses the HttpOnly refresh cookie to issue a new access token and rotate
 * the refresh token. Called by the Axios interceptor on 401, or explicitly
 * from an RSC / server action when needed.
 *
 * credentials: 'include' is critical — the refresh cookie must be sent.
 * No body needed — backend reads the cookie directly.
 */
export async function refreshAdminToken(): Promise<AdminRefreshResult> {
  try {
    const res = await serverFetchOrRedirect<BackendResponse<RefreshTokenData>>(
      '/auth/admin/refresh-token',
      {
        method: 'POST',
      },
    );
    return { success: true, data: res.data };
  } catch (err: unknown) {
    return { success: false, message: networkErrorMessage(err) };
  }
}

// ── Get Me ─────────────────────────────────────────────────────────────────

/**
 * GET /auth/admin/me
 *
 * Fetches the authenticated admin's profile.
 * Called on app mount (inside a TanStack Query `useQuery`) to hydrate
 * the Zustand auth store after a page refresh.
 *
 * For RSC / server action usage, pass the cookie header manually:
 *   import { cookies } from 'next/headers';
 *   headers: { Cookie: (await cookies()).toString() }
 * That variant lives in a separate server-only helper — this is the client variant.
 */
export async function getAdminMe(): Promise<AdminMeResult> {
  try {
    const res = await serverFetchOrRedirect<BackendResponse<AdminMeData>>('auth/admin/me');

    return { success: true, admin: res.data.admin };
  } catch (err: unknown) {
    return { success: false, message: networkErrorMessage(err) };
  }
}

// ── Internal helper ────────────────────────────────────────────────────────

/**
 * Converts a raw fetch network error into a human-readable message.
 * fetch() only throws on genuine network failures (offline, DNS, CORS preflight fail).
 * HTTP 4xx/5xx never reach here — they're handled per-function above.
 */
function networkErrorMessage(err: unknown): string {
  if (err instanceof TypeError && err.message.toLowerCase().includes('fetch')) {
    return 'Network error — check your connection and try again.';
  }
  if (err instanceof Error) return err.message;
  return 'An unexpected error occurred. Please try again.';
}
