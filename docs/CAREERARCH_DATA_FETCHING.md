# CareerArch — Data Fetching, Caching & Mutation Guide

> **Read this before writing any fetch, query, mutation, or revalidation code.**
> This is the single source of truth for how data flows in CareerArch frontend.

---

## 1. The Two Contexts — Never Mix Them

| Context | Tool | Auth mechanism | File suffix convention |
|---|---|---|---|
| Server Component (RSC) | `serverFetch()` | `cookies()` → `Cookie` header | `*.server.ts` |
| Server Action (mutation) | `serverFetch()` | `cookies()` → `Cookie` header | `*.action.ts` |
| Client Component (browser) | `APIKit.*` + Axios | HttpOnly cookie auto-attached | `*.client.ts` |
| TanStack Query hook | `APIKit.*` via `useQuery`/`useMutation` | same as above | `use-*.ts` |

**Hard rule:** Never import a `*.server.ts` file or `serverFetch` into a Client Component.
Next.js will throw at build time because `next/headers` is not available in the browser bundle.

---

## 2. Server-Side Fetching — `serverFetch()`

```typescript
// src/lib/server-fetch.ts
import { cookies } from 'next/headers';
import { envConfig } from '@config/envConfig';

interface ServerFetchOptions extends RequestInit {
  tags?: string[];
}

export async function serverFetch<T>(
  path: string,
  options: ServerFetchOptions = {},
): Promise<T> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ');

  const { tags, ...fetchOptions } = options;

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

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message ?? `Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}
```

### When to use
- Any `async` Server Component that needs authenticated data
- Any Server Action (`'use server'`) that reads data before mutating

### Cookie flow
```
Browser cookies → [incoming request] → Next.js cookies() store
                                               ↓ manual bridge
                                        Cookie header on fetch()
                                               ↓
                                           Backend ✅
```

---

## 3. Client-Side Fetching — `APIKit`

### Structure
```
src/lib/axios/
├── client.ts          ← Axios instance + 401 refresh interceptor
├── index.ts           ← exports APIKit + client
└── modules/
    ├── auth.api.ts
    ├── user.api.ts
    ├── jobs.api.ts
    ├── applications.api.ts
    ├── subscription.api.ts
    ├── notifications.api.ts
    ├── org.api.ts
    └── admin.api.ts
```

### Usage pattern — always go through APIKit, never raw Axios
```typescript
// ✅ Correct
const res = await APIKit.user.profile.getMe();
const res = await APIKit.applications.getAll({ page: 1 });
const res = await APIKit.org.jobs.create(payload);

// ❌ Wrong — never import client directly in query hooks
import { client } from '@lib/axios/client';
client.get('/auth/user/me');
```

### Auth mechanism
- Axios instance has `withCredentials: true`
- Browser auto-attaches the HttpOnly `accessToken` cookie on every request
- On 401: interceptor reads `userRole` cookie (not HttpOnly, readable by JS)
  and calls the correct role-specific refresh endpoint
- After refresh, retries the original request automatically

---

## 4. Query Keys — Always from `queryKeys`

**File:** `src/constants/queryKeys.ts`

All query keys live here. Never hardcode strings in `useQuery`/`useMutation`.

```typescript
import { queryKeys } from '@constants/queryKeys';

// ✅ Correct
queryKey: queryKeys.profile.me()
queryKey: queryKeys.applications.list(filters)
queryKey: queryKeys.admin.users.detail(id)

// ❌ Wrong
queryKey: ['profile', 'me']
queryKey: ['applications']
```

### Key structure
```typescript
queryKeys = {
  auth:             { me(role) }
  jobs:             { all, list(filters), detail(slug), categories, saved }
  applications:     { all, list(filters), detail(id) }
  profile:          { me, org(id) }
  subscription:     { my, plans, invoices }
  notifications:    { all(filters), unreadCount }
  orgJobs:          { all, list(filters), detail(id), deleted }
  orgApplications:  { all, byJob(jobId, filters), detail(id) }
  orgIncentives:    { all, list(filters), detail(id) }
  orgBilling:       { info }
  orgProfile:       { my }
  admin: {
    stats,
    users:         { list(filters), detail(id) }
    orgs:          { list(filters), detail(id) }
    jobs:          { list(filters) }
    plans:         { all, detail(id) }
    subscriptions: { list(filters), stats }
    incentives:    { list(filters), stats }
  }
}
```

---

## 5. TanStack Query Hooks — Pattern

**File location:** `src/queries/use-*.ts`
**Always add `'use client'` at the top.**

### useQuery pattern
```typescript
'use client';

import { useQuery } from '@tanstack/react-query';
import { APIKit } from '@lib/axios';
import { queryKeys } from '@constants/queryKeys';

export function useProfile() {
  return useQuery({
    queryKey: queryKeys.profile.me(),
    queryFn: async () => {
      const res = await APIKit.user.profile.getMe();
      return res.data.data.user;     // unwrap IApiResponse
    },
    staleTime: 1000 * 60 * 5,       // 5 min — profile doesn't change often
  });
}
```

### useMutation pattern
```typescript
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { APIKit } from '@lib/axios';
import { queryKeys } from '@constants/queryKeys';

export function useWithdrawApplication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await APIKit.applications.withdraw(id);
      return res.data;
    },
    onSuccess: () => {
      // Invalidate the list — refetches automatically
      void qc.invalidateQueries({ queryKey: queryKeys.applications.all() });
      toast.success('Application withdrawn');
    },
    onError: () => toast.error('Failed to withdraw application'),
  });
}
```

### staleTime guidelines
| Data type | staleTime |
|---|---|
| User profile | 5 min |
| Job listings / search | 2 min |
| Application list | 2 min |
| Notifications | 1 min |
| Subscription / billing | 5 min |
| Admin stats | 1 min |
| Static (plans, categories) | 10 min |

---

## 6. Server Actions — Mutation Pattern

**File location:** `src/app/[route]/_actions/*.action.ts`
**Always add `'use server'` at the top.**

```typescript
'use server';

import { revalidatePath } from 'next/cache';
import { serverFetch } from '@lib/server-fetch';
import type { IApiResponse } from '@app-types/api';

export async function updateProfileAction(
  input: UpdateProfileInput,
): Promise<{ success: boolean; message: string }> {
  try {
    await serverFetch<IApiResponse<unknown>>('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(input),
    });

    // Revalidate the page so Server Components refetch
    revalidatePath('/dashboard/profile');

    return { success: true, message: 'Profile updated.' };
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : 'Update failed.',
    };
  }
}
```

### Called from Client Component
```typescript
'use client';

import { useTransition } from 'react';
import { toast } from 'sonner';
import { updateProfileAction } from '../_actions/update-profile.action';

export function ProfileEditForm() {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(data: UpdateProfileInput) {
    startTransition(async () => {
      const result = await updateProfileAction(data);
      if (result.success) toast.success(result.message);
      else toast.error(result.message);
    });
  }
  // ...
}
```

---

## 7. Login — Cookie Forwarding (Special Case)

Login is a Server Action that must manually forward the backend's `Set-Cookie`
headers to the browser because it's a direct server-to-server fetch.

```typescript
// After successful login fetch:
const setCookieHeaders = response.headers.getSetCookie?.() ?? [];

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
    httpOnly: attrMap['httponly'] === true,
    secure: attrMap['secure'] === true,
    sameSite: (attrMap['samesite'] as 'strict' | 'lax' | 'none') ?? 'lax',
    path: (attrMap['path'] as string) ?? '/',
    maxAge: attrMap['max-age'] ? Number(attrMap['max-age']) : undefined,
  });
}

// Set readable role cookie for middleware route guards
cookieStore.set('userRole', role, {
  httpOnly: false,    // middleware reads this
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/',
  maxAge: 60 * 60 * 24 * 30,
});
```

### Why this is needed
Server actions bypass any proxy. The backend's `Set-Cookie` response headers
don't reach the browser automatically — you must relay them manually via
`cookieStore.set()`.

---

## 8. Cookie Architecture

| Cookie | HttpOnly | Readable by JS | Purpose |
|---|---|---|---|
| `accessToken` | ✅ yes | ❌ no | API authentication |
| `refreshToken` | ✅ yes | ❌ no | Token rotation |
| `userRole` | ❌ no | ✅ yes | Middleware route guards, Axios refresh endpoint routing |

**XSS protection:** `accessToken` and `refreshToken` are never accessible via
`document.cookie`. An XSS attacker can make authenticated requests during the
session but cannot steal the token itself.

---

## 9. Invalidation Cheat Sheet

```typescript
const qc = useQueryClient();

// Invalidate everything under a domain
void qc.invalidateQueries({ queryKey: queryKeys.applications.all() });
void qc.invalidateQueries({ queryKey: queryKeys.orgJobs.all() });

// Invalidate a specific item
void qc.invalidateQueries({ queryKey: queryKeys.applications.detail(id) });

// Invalidate a list with specific filters
void qc.invalidateQueries({ queryKey: queryKeys.jobs.list(filters) });

// Server Action — invalidate Next.js page cache
revalidatePath('/dashboard/profile');

// Server Action — invalidate by tag (when fetch uses tags option)
revalidateTag('profile');
```

---

## 10. Complete Mental Model

```
┌──────────────────────────────────────────────────────────────┐
│  SERVER COMPONENT (RSC)                                      │
│  serverFetch('/path') → Cookie header forwarded → backend    │
│  Result passed as props to Client Components                 │
│  No TanStack Query — one-time server render                  │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│  SERVER ACTION ('use server')                                │
│  serverFetch('/path', { method: 'PUT', body })               │
│  Cookie header forwarded → backend                          │
│  revalidatePath() or revalidateTag() after mutation          │
│  Called from Client via useTransition()                      │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│  CLIENT COMPONENT ('use client')                             │
│  useQuery({ queryKey: queryKeys.X.Y(), queryFn })            │
│    → APIKit.module.method()                                  │
│    → Axios (withCredentials: true)                           │
│    → HttpOnly cookie auto-attached by browser                │
│    → backend ✅                                              │
│                                                              │
│  On 401:                                                     │
│    reads userRole cookie → picks refresh endpoint            │
│    POST /auth/{role}/refresh-token (with refreshToken cookie)│
│    backend rotates cookies                                   │
│    retries original request ✅                               │
└──────────────────────────────────────────────────────────────┘

Data flow summary:
  RSC         → serverFetch  → Cookie header  → backend
  Action      → serverFetch  → Cookie header  → backend + revalidatePath
  Client      → APIKit       → Axios          → cookie auto → backend
  Query keys  → always from queryKeys constant file
  Toast       → always sonner (toast.success / toast.error)
```

---

## 11. Service File Naming Convention

```
src/services/
└── user/
    ├── profile.server.ts    ← imports serverFetch, used by RSC + actions
    └── profile.client.ts    ← imports APIKit, used by query hooks
                               (only if you prefer a service layer over
                                calling APIKit directly in query hooks)
```

Prefer calling `APIKit` directly inside `queryFn` for simple cases.
Extract to `*.client.ts` only when the logic is complex or reused.

---

_Last updated: Phase 4B — Auth + data fetching architecture complete._
_Applies to: all phases going forward._
