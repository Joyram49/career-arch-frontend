import { envConfig } from '@config/envConfig';
import { RegisterInput } from '@validations/auth.schema';

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
    response = await fetch(`${envConfig.apiUrl}/auth/user/register`, {
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
    response = await fetch(`${envConfig.apiUrl}/auth/user/resend-verification`, {
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
    const url = new URL(`${envConfig.apiUrl}/auth/user/verify-email`);
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
    response = await fetch(`${envConfig.apiUrl}/auth/user/forgot-password`, {
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
    response = await fetch(`${envConfig.apiUrl}/auth/user/reset-password`, {
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
