import { envConfig } from '@config/envConfig';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';

interface ServerFetchOptions extends RequestInit {
  tags?: string[];
}

export async function serverFetch<T>(path: string, options: ServerFetchOptions = {}): Promise<T> {
  const cookieStore = await cookies();
  const headerStore = await headers();
  const { tags, ...fetchOptions } = options;

  // get access token from header as settled in proxy.ts
  const refreshedToken = headerStore.get('x-refreshed-access-token');

  // Cookie header build
  let cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ');

  // replace expired access_token  with new access_token
  if (refreshedToken) {
    if (cookieHeader.includes('access_token=')) {
      cookieHeader = cookieHeader.replace(/access_token=[^;]*/, `access_token=${refreshedToken}`);
    } else {
      cookieHeader = cookieHeader
        ? `${cookieHeader}; access_token=${refreshedToken}`
        : `access_token=${refreshedToken}`;
    }
  }

  const response = await fetch(`${envConfig.serverApiUrl}${path}`, {
    ...fetchOptions,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Cookie: cookieHeader,
      ...fetchOptions.headers,
    },
    cache: fetchOptions.cache ?? 'no-store',
    next: tags ? { tags } : undefined,
  });

  if (response.status === 401) {
    throw new ServerAuthError('Session expired.');
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error((body as { message?: string }).message ?? `Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function serverFetchOrRedirect<T>(
  path: string,
  options?: ServerFetchOptions,
): Promise<T> {
  try {
    return await serverFetch<T>(path, options);
  } catch (err) {
    if (err instanceof ServerAuthError) {
      redirect('/login?reason=session_expired');
    }
    throw err;
  }
}

export class ServerAuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ServerAuthError';
  }
}
