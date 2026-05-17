'use server';
import type { IAdmin } from '@app-types/auth';
import { envConfig } from '@config/envConfig';

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
 */
export async function loginAdmin(data: AdminLoginInput): Promise<AdminLoginResult> {
  try {
    const res = await fetch(`${envConfig.serverApiUrl}/auth/admin/login`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(data),
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
    const res = await fetch(`${envConfig.serverApiUrl}/auth/admin/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    // 401 = token already expired — still a clean logout from our side
    if (res.status === 401 || res.ok) {
      return { success: true };
    }

    const json: BackendResponse<null> = await res
      .json()
      .catch(() => ({ success: false, message: '' }));

    return {
      success: false,
      message: json.message || 'Logout request failed — session cleared locally.',
    };
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
    const res = await fetch(`${envConfig.serverApiUrl}/auth/admin/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    const json: BackendResponse<RefreshTokenData> = await res.json();

    if (!res.ok || !json.success || json.data === undefined) {
      return {
        success: false,
        message: json.message ?? 'Session expired. Please log in again.',
      };
    }

    return { success: true, accessToken: json.data.accessToken };
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
    const res = await fetch(`${envConfig.serverApiUrl}/auth/admin/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    // 401 = not authenticated — not an error, just unauthenticated
    if (res.status === 401) {
      return { success: false, message: 'Not authenticated.' };
    }

    const json: BackendResponse<AdminMeData> = await res.json();

    if (!res.ok || !json.success || json.data === undefined) {
      return {
        success: false,
        message: json.message ?? 'Failed to load admin profile.',
      };
    }

    return { success: true, admin: json.data.admin };
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
