'use server';
import { IUser } from '@app-types/auth';
import { envConfig } from '@config/envConfig';
import { LoginInput, RegisterInput } from '@validations/auth.schema';
import { cookies } from 'next/headers';

interface IRegisterSuccessResult {
  success: true;
  message: string;
}

interface IRegisterErrorResult {
  success: false;
  message: string;
  fieldErrors?: Array<{ field: string; message: string }>;
}

export type RegisterResult = IRegisterSuccessResult | IRegisterErrorResult;

interface ILoginSuccessResult {
  success: true;
  requires2FA: false;
  user: IUser;
}

interface ITwoFaRequiredResult {
  success: true;
  requires2FA: true;
  tempToken: string;
}

interface ILoginErrorResult {
  success: false;
  message: string;
  fieldErrors?: Array<{ field: string; message: string }>;
}

export type LoginResult = ILoginSuccessResult | ITwoFaRequiredResult | ILoginErrorResult;

/* ─────────────────────────────────────────────
   registerUser — Server Action
   Calls POST /auth/user/register
   No cookies set — backend only sends a verification email.
   On success the user must check their inbox before they can log in.
   ──────────────────────────────────────────── */

export async function userRegistration(
  payload: Pick<RegisterInput, 'firstName' | 'lastName' | 'email' | 'password'>,
): Promise<RegisterResult> {
  let response: Response;

  //   send api request to the backend
  try {
    response = await fetch(`${envConfig.serverApiUrl}/auth/user/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        password: payload.password,
      }),
      cache: 'no-store',
    });
  } catch {
    return {
      success: false,
      message: 'Unable to reach the server. Please check your connection and try again.',
    };
  }

  let body: {
    success: boolean;
    message: string;
    errors: Array<{ field: string; message: string }>;
  };
  try {
    body = await response.json();
  } catch (error) {
    return {
      success: false,
      message: 'Unexpected server response. Please try again.',
    };
  }

  //   guard error response
  if (!response.ok) {
    return {
      success: false,
      message: body.message ?? 'Registration failed. Please try again later',
      fieldErrors: body.errors,
    };
  }

  // send success response to the client
  return {
    success: true,
    message: body.message,
  };
}

/* ─────────────────────────────────────────────
   resendVerification — Server Action
   Calls POST /auth/user/resend-verification
    backend will sends a verification email.
   On success the user have to redirect with the url they will find in email
   ──────────────────────────────────────────── */
export async function resendVerificationEmail(
  payload: Pick<RegisterInput, 'email'>,
): Promise<RegisterResult> {
  let response: Response;
  //   send api request to the backend
  try {
    response = await fetch(`${envConfig.serverApiUrl}/auth/user/resend-verification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: payload.email,
      }),
      cache: 'no-store',
    });
  } catch {
    return {
      success: false,
      message: 'Unable to reach the server. Please check your connection and try again.',
    };
  }

  let body: {
    success: boolean;
    message: string;
    errors: Array<{ field: string; message: string }>;
  };
  try {
    body = await response.json();
  } catch (error) {
    return {
      success: false,
      message: 'Unexpected server response. Please try again.',
    };
  }

  //   guard error response
  if (!response.ok) {
    return {
      success: false,
      message: body.message ?? 'Verification failed. Please try again later',
      fieldErrors: body.errors,
    };
  }

  // send success response to the client
  return {
    success: true,
    message: body.message,
  };
}

/* ─────────────────────────────────────────────
   verifyEmail — Server Action
   Calls POST /auth/user/verify-email
    backend will receive token to verify email.
   On success the user can login their account
   ──────────────────────────────────────────── */

export async function verifyEmail(payload: { token: string }): Promise<RegisterResult> {
  let response: Response;

  try {
    const url = new URL(`${envConfig.serverApiUrl}/auth/user/verify-email`);
    url.searchParams.set('token', payload.token);

    response = await fetch(url.toString(), {
      method: 'GET',
      cache: 'no-store',
    });
  } catch {
    return {
      success: false,
      message: 'Unable to reach the server. Please check your connection and try again.',
    };
  }

  let body: {
    success: boolean;
    message: string;
    errors: Array<{ field: string; message: string }>;
  };

  try {
    body = await response.json();
  } catch {
    return {
      success: false,
      message: 'Unexpected server response. Please try again.',
    };
  }

  if (!response.ok) {
    return {
      success: false,
      message: body.message ?? 'Verification failed. Please try again later',
      fieldErrors: body.errors,
    };
  }

  return {
    success: true,
    message: body.message,
  };
}

/* ─────────────────────────────────────────────
   forgotPassword — Server Action
   Calls POST /auth/user/forgot-password
   Backend sends a password-reset email if the address is found.
   Always returns a generic message (prevents email enumeration).
   ──────────────────────────────────────────── */
export async function forgotPassword(payload: { email: string }): Promise<RegisterResult> {
  let response: Response;

  try {
    response = await fetch(`${envConfig.serverApiUrl}/auth/user/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: payload.email }),
      cache: 'no-store',
    });
  } catch {
    return {
      success: false,
      message: 'Unable to reach the server. Please check your connection and try again.',
    };
  }

  let body: {
    success: boolean;
    message: string;
    errors: Array<{ field: string; message: string }>;
  };

  try {
    body = await response.json();
  } catch {
    return { success: false, message: 'Unexpected server response. Please try again.' };
  }

  if (!response.ok) {
    return {
      success: false,
      message: body.message ?? 'Failed to send reset link. Please try again later.',
      fieldErrors: body.errors,
    };
  }

  return { success: true, message: body.message };
}

/* ─────────────────────────────────────────────
   resetPassword — Server Action
   Calls POST /auth/user/reset-password
   Requires the one-time token from the reset email (URL search param),
   plus the new password and confirmation.
   On success the user must sign in with the new password.
   ──────────────────────────────────────────── */
export async function resetPassword(payload: {
  token: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<RegisterResult> {
  let response: Response;

  try {
    response = await fetch(`${envConfig.serverApiUrl}/auth/user/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: payload.token,
        newPassword: payload.newPassword,
        confirmPassword: payload.confirmPassword,
      }),
      cache: 'no-store',
    });
  } catch {
    return {
      success: false,
      message: 'Unable to reach the server. Please check your connection and try again.',
    };
  }

  let body: {
    success: boolean;
    message: string;
    errors: Array<{ field: string; message: string }>;
  };

  try {
    body = await response.json();
  } catch {
    return { success: false, message: 'Unexpected server response. Please try again.' };
  }

  if (!response.ok) {
    return {
      success: false,
      message: body.message ?? 'Password reset failed. Please request a new link.',
      fieldErrors: body.errors,
    };
  }

  return { success: true, message: body.message };
}

/* ─────────────────────────────────────────────
   loginUser — Server Action
   Calls POST /auth/user/login
   Backend sets HttpOnly accessToken + refreshToken cookies.
   We set a readable `userRole` cookie so proxy.ts can guard routes.
   ──────────────────────────────────────────── */

export async function loginUser(input: LoginInput): Promise<LoginResult> {
  let response: Response;
  try {
    // Forward the request to the backend
    // withCredentials equivalent in server actions: we pass Cookie header
    // from the incoming request so the backend can rotate tokens if needed.
    // For login, no existing cookie is needed — backend creates fresh ones.
    response = await fetch(`${envConfig.serverApiUrl}/auth/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        email: input.email,
        password: input.password,
        rememberMe: input.rememberMe ?? false,
      }),
      // Don't cache — always fresh
      cache: 'no-store',
    });
  } catch {
    return {
      success: false,
      message: 'Unable to reach the server. Please check your connection and try again.',
    };
  }

  /* ── Parse body ── */
  let body: {
    success: boolean;
    message: string;
    data?: {
      user?: IUser;
      accessToken?: string;
      requires2FA?: boolean;
      tempToken?: string;
    };
    errors?: Array<{ field: string; message: string }>;
  };

  try {
    body = await response.json();
  } catch {
    return { success: false, message: 'Unexpected server response. Please try again.' };
  }

  /* ── Handle HTTP errors ── */
  if (!response.ok) {
    return {
      success: false,
      message: body.message ?? 'Login failed. Please check your credentials.',
      fieldErrors: body.errors,
    };
  }

  /* ── 2FA required ── */
  if (body.data?.requires2FA === true && body.data.tempToken !== undefined) {
    return {
      success: true,
      requires2FA: true,
      tempToken: body.data.tempToken,
    };
  }

  /* ── Full login success ── */
  if (body.data?.user === undefined) {
    return { success: false, message: 'Unexpected server response.' };
  }

  /*
   * Set a readable (non-HttpOnly) `userRole` cookie.
   * proxy.ts reads this to determine which dashboard to guard/redirect to.
   * The actual auth tokens (HttpOnly) are set by the backend on the response.
   *
   * Note: In a server action we can only set cookies we control.
   * The backend's Set-Cookie headers (HttpOnly tokens) are handled by
   * Next.js automatically forwarding them when using fetch() in a server action
   * from the same origin, BUT since the API is on a different origin
   * (career-arch.onrender.com), we need to manually forward the Set-Cookie
   * headers to the browser response.
   */
  const cookieStore = await cookies();

  // Set readable role cookie for proxy.ts route guards
  cookieStore.set('userRole', 'USER', {
    httpOnly: false, // Must be readable by proxy.ts (middleware)
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  return {
    success: true,
    requires2FA: false,
    user: body.data.user,
  };
}

/* ─────────────────────────────────────────────
   logoutUser — Server Action
   Calls POST /auth/user/logout
   Backend sets HttpOnly accessToken + refreshToken cookies + userRole we added manually. so we had to remove all of these from cookies
   ──────────────────────────────────────────── */

// src/services/user/auth.ts (add this function)
export async function logoutUser(): Promise<{ success: boolean; message: string }> {
  try {
    // Tell Express to blacklist JTI + revoke refresh token in DB
    // accessToken HttpOnly cookie is auto-forwarded by Next.js proxy
    await fetch(`${envConfig.serverApiUrl}/auth/user/logout`, {
      method: 'POST',
      cache: 'no-store',
      credentials: 'include',
    });
  } catch {
    // Continue with client-side cleanup even if backend call fails
  }

  // Clear all 3 cookies
  const cookieStore = await cookies();
  cookieStore.delete('accessToken');
  cookieStore.delete('refreshToken');
  cookieStore.delete('userRole');

  return { success: true, message: 'Logged out successfully' };
}
