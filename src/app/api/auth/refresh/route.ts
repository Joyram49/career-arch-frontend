import { envConfig } from '@config/envConfig';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(): Promise<NextResponse> {
  const cookieStore = await cookies();
  const userRole = cookieStore.get('userRole')?.value;
  const isRemembered = cookieStore.get('remember_me')?.value;

  const refreshEndpoint =
    userRole === 'ORGANIZATION'
      ? '/auth/org/refresh-token'
      : userRole === 'ADMIN'
        ? '/auth/admin/refresh-token'
        : '/auth/user/refresh-token';

  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ');

  try {
    const refreshResponse = await fetch(`${envConfig.serverApiUrl}${refreshEndpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader,
      },
      cache: 'no-store',
    });

    if (!refreshResponse.ok) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    const data = (await refreshResponse.json()) as { data?: { accessToken?: string } };

    // ── Parse & forward Set-Cookie headers from backend ──────────────────
    const setCookieHeaders =
      refreshResponse.headers.getSetCookie?.() ??
      splitSetCookieHeader(refreshResponse.headers.get('set-cookie') ?? '');

    let newAccessToken: string | undefined;

    for (const rawCookie of setCookieHeaders) {
      const parts = rawCookie.split(/;\s+/);
      const nameValue = parts[0] ?? '';
      const eqIdx = nameValue.indexOf('=');
      if (eqIdx === -1) continue;

      const name = nameValue.slice(0, eqIdx).trim();
      const value = nameValue.slice(eqIdx + 1).trim();
      if (!name || !value) continue;

      if (name === 'access_token') newAccessToken = value;

      const attrMap: Record<string, string | boolean> = {};
      for (const attr of parts.slice(1)) {
        const eqPos = attr.indexOf('=');
        if (eqPos === -1) {
          attrMap[attr.toLowerCase()] = true;
        } else {
          attrMap[attr.slice(0, eqPos).trim().toLowerCase()] = attr.slice(eqPos + 1).trim();
        }
      }

      const rawSameSite =
        typeof attrMap['samesite'] === 'string' ? attrMap['samesite'].toLowerCase() : 'lax';
      const sameSite = (['strict', 'lax', 'none'] as const).includes(
        rawSameSite as 'strict' | 'lax' | 'none',
      )
        ? (rawSameSite as 'strict' | 'lax' | 'none')
        : 'lax';

      const maxAge =
        attrMap['max-age'] !== undefined
          ? parseInt(attrMap['max-age'] as string, 10)
          : isRemembered === 'true'
            ? 30 * 24 * 60 * 60
            : 7 * 24 * 60 * 60;

      // Write to the cookie store — this will be reflected in the
      // outgoing response automatically by Next.js
      cookieStore.set(name, value, {
        httpOnly: attrMap['httponly'] === true,
        secure: attrMap['secure'] === true,
        sameSite,
        path: (attrMap['path'] as string) ?? '/',
        maxAge,
      });
    }

    // ── Also fall back to body token if headers were empty ────────────────
    if (!newAccessToken && data.data?.accessToken) {
      newAccessToken = data.data.accessToken;
    }

    if (!newAccessToken) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    // ✅ Single response — cookieStore.set() mutations are applied by Next.js
    //    to THIS response. Do NOT copy headers from a previously-created response.
    return NextResponse.json({ success: true, accessToken: newAccessToken });
  } catch (err) {
    console.error('refresh route error', err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

function splitSetCookieHeader(raw: string): string[] {
  if (!raw) return [];
  // Split on commas that are followed by a cookie name (not a date like "Thu, 01 Jan")
  const parts = raw.split(/,(?=\s*[a-zA-Z][a-zA-Z0-9_-]+=)/);
  return parts.map((p) => p.trim()).filter(Boolean);
}
