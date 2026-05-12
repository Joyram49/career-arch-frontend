# ⚡ CareerArch Frontend — Session Instructions

> Paste this at the top of every frontend session along with FRONTEND_SETUP.md
> and only the files relevant to your specific task.

---

## Project Identity

**CareerArch Frontend** — Next.js 16 SaaS job portal (Phase 4)
**Stack:** Next.js 16 · React 19 · TypeScript (strict) · Tailwind CSS v4 · shadcn/ui · TanStack Query · Axios · Zustand · Framer Motion · Socket.IO · Stripe
**Backend API:** <https://career-arch.onrender.com/api/v1>
**Backend Repo:** <https://github.com/Joyram49/career-arch>
**Status:** Phase 4A complete. Phase 4B (public pages) next.

---

## 1. The Golden Architecture Rule

```text
Page (RSC) → fetch data server-side (or pass to client)
Client Component → TanStack Query (useQuery / useMutation) → Service function → Axios
State → Zustand (auth, UI) | TanStack Query (server state) | nuqs (URL state)
```

- **Server Components by default** — add `"use client"` only when the component uses hooks, events, or browser APIs
- **Services are thin** — one Axios call per function, returns `ApiResponse<T>`
- **Query hooks are thin** — call service, define key, set options. No logic.
- **Components are dumb** — receive data via props or query hooks. No business logic.
- **Stores are minimal** — Zustand only for: auth state, UI state (sidebar open), notification badge count

---

## 2. Path Aliases — Always Use These

```typescript
// ✅ Correct
import { cn } from '@lib/utils';
import { useAuthStore } from '@store/auth.store';
import type { Job } from '@app-types/job';
import { queryKeys } from '@queries/keys';
import { Button } from '@ui/button';

// ❌ Never
import { cn } from '../../lib/utils';
```

| Alias            | Maps to               |
| ---------------- | --------------------- |
| `@/*`            | `src/*`               |
| `@ui/*`          | `src/components/ui/*` |
| `@components/*`  | `src/components/*`    |
| `@hooks/*`       | `src/hooks/*`         |
| `@lib/*`         | `src/lib/*`           |
| `@services/*`    | `src/services/*`      |
| `@queries/*`     | `src/queries/*`       |
| `@store/*`       | `src/store/*`         |
| `@validations/*` | `src/validations/*`   |
| `@app-types/*`   | `src/types/*`         |
| `@config/*`      | `src/config/*`        |

---

## 3. Service Pattern

```typescript
// src/services/jobs.service.ts
import { apiGet, apiPost, type ApiResponse } from '@lib/axios';
import type { Job, JobFilters } from '@app-types/job';

export async function getJobs(filters: JobFilters): Promise<ApiResponse<{ jobs: Job[] }>> {
  return apiGet('/jobs', filters);
}

export async function getJobBySlug(slug: string): Promise<ApiResponse<{ job: Job }>> {
  return apiGet(`/jobs/${slug}`);
}
```

---

## 4. Query Hook Pattern

```typescript
// src/queries/use-jobs.ts
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@queries/keys';
import { getJobs, getJobBySlug } from '@services/jobs.service';
import type { JobFilters } from '@app-types/job';

export function useJobs(filters: JobFilters) {
  return useQuery({
    queryKey: queryKeys.jobs.list(filters),
    queryFn: () => getJobs(filters),
  });
}

export function useJobDetail(slug: string) {
  return useQuery({
    queryKey: queryKeys.jobs.detail(slug),
    queryFn: () => getJobBySlug(slug),
    enabled: slug.length > 0,
  });
}
```

---

## 5. Component Pattern

```typescript
// Prefer explicit return type, named exports
// Use CSS vars for theming — never hardcoded colors

'use client'; // Only if using hooks/events

import { cn } from '@lib/utils';

interface JobCardProps {
  job: Job;
  className?: string;
}

export function JobCard({ job, className }: JobCardProps): React.JSX.Element {
  return (
    <div
      className={cn('surface p-4 transition-shadow hover:shadow-md', className)}
    >
      {/* content */}
    </div>
  );
}
```

---

## 6. Theming Rule — CRITICAL

**NEVER write `dark:` Tailwind prefixes in component code.**

```typescript
// ✅ Correct — uses CSS variable that shifts with theme
<div style={{ color: 'var(--muted-foreground)' }} />
<div className="text-muted-foreground" />

// ❌ Wrong — hardcoded dark: prefix
<div className="text-gray-500 dark:text-gray-400" />
```

All colors shift automatically when `[data-theme="dark"]` is applied to `<html>` by next-themes. CSS variables defined in `globals.css` handle both modes.

---

## 7. Form Pattern (react-hook-form + zod)

```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginInput } from '@validations/auth.schema';
import {
  Form, FormField, FormItem, FormLabel, FormControl, FormMessage,
} from '@ui/form';
import { Input } from '@ui/input';
import { Button } from '@ui/button';

export function LoginForm(): React.JSX.Element {
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  function onSubmit(data: LoginInput): void {
    // call mutation
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
```

---

## 8. Mutation Pattern

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { queryKeys } from '@queries/keys';
import { applyToJob } from '@services/application.service';
import type { AxiosError } from 'axios';
import type { ApiErrorResponse } from '@app-types/api';

export function useApplyToJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: applyToJob,
    onSuccess: (_, variables) => {
      toast.success('Application submitted successfully!');
      // Invalidate related queries
      void queryClient.invalidateQueries({ queryKey: queryKeys.applications.all() });
      void queryClient.invalidateQueries({ queryKey: queryKeys.jobs.detail(variables.slug) });
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const message = error.response?.data?.message ?? 'Failed to submit application';
      toast.error(message);
    },
  });
}
```

---

## 9. Auth Awareness in Components

```typescript
import { useAuth } from '@hooks/use-auth';

export function SomeComponent(): React.JSX.Element {
  const { isAuthenticated, isUser, currentUser, plan } = useAuth();

  if (!isAuthenticated) return <LoginPrompt />;

  return <div>Welcome, {currentUser?.firstName}</div>;
}
```

---

## 10. RSC vs Client — Decision Rule

```text
Default → Server Component (no directive)

Add 'use client' when component uses:
  ✓ useState / useEffect / useRef / useCallback
  ✓ Event handlers (onClick, onChange, onSubmit)
  ✓ TanStack Query hooks (useQuery, useMutation)
  ✓ Zustand stores (useAuthStore, useUiStore)
  ✓ Socket.IO hooks
  ✓ Framer Motion animations
  ✓ react-hook-form
  ✓ next-themes (useTheme)
  ✓ Browser APIs (window, document, navigator)

Stay Server Component:
  ✓ Layouts that just wrap children
  ✓ Pages that only pass data down
  ✓ Static or rarely changing UI
  ✓ generateMetadata functions
```

---

## 11. Error Handling in Mutations

```typescript
// Extract backend field errors for form display
import type { AxiosError } from 'axios';
import type { ApiErrorResponse } from '@app-types/api';

function handleApiError(
  error: AxiosError<ApiErrorResponse>,
  form?: ReturnType<typeof useForm>,
): void {
  const apiError = error.response?.data;
  if (apiError?.errors !== undefined && form !== undefined) {
    apiError.errors.forEach(({ field, message }) => {
      form.setError(field as never, { message });
    });
  } else {
    toast.error(apiError?.message ?? 'An unexpected error occurred');
  }
}
```

---

## 12. Adding a New Feature — Checklist

```text
□ 1. Add/update Zod schema in src/validations/*.schema.ts
□ 2. Add TypeScript types in src/types/*.ts (mirror backend model)
□ 3. Add API service function in src/services/*.service.ts
□ 4. Add query key in src/queries/keys.ts
□ 5. Add TanStack Query hook in src/queries/use-*.ts
□ 6. Build component in src/components/**/*.tsx
□ 7. Add page in src/app/**/page.tsx
□ 8. Add loading.tsx + error.tsx siblings if the page fetches data
□ 9. Update proxy.ts if new route needs auth guarding
□ 10. Ensure theme uses CSS vars (no dark: prefixes)
```

---

## 13. Backend Contract Reference

Always sync with backend before building a feature:

| What to check       | Where to look                                    |
| ------------------- | ------------------------------------------------ |
| Route + HTTP method | `src/routes/**/*.routes.ts`                      |
| Request body shape  | `src/validations/*.validation.ts`                |
| Response shape      | `src/utils/apiResponse.ts` + service return type |
| Auth requirement    | Route middleware: `authenticate`, `authorize`    |
| Plan requirement    | `checkApplyLimit`, `checkJobPlan`, etc.          |
| Socket events       | `src/config/socket.ts` emit helpers              |

---

## 14. Key Conventions

| Convention        | Rule                                                            |
| ----------------- | --------------------------------------------------------------- |
| File naming       | `kebab-case.tsx` for components, `camelCase.ts` for hooks/utils |
| Component exports | Named exports (no default exports for components)               |
| Return type       | Always explicit: `React.JSX.Element`, `string`, `void`          |
| Type imports      | Always `import type { X }` for type-only imports                |
| No any            | ESLint will error — find the real type                          |
| No ! assertions   | Use null checks instead                                         |
| Toast on mutation | Always show success/error feedback                              |
| Loading states    | Use skeleton components, not spinners where possible            |
| Empty states      | Every list needs an EmptyState component                        |

---

## Session Start Template

```text
[FRONTEND_INSTRUCTIONS.md]  ← this file
[FRONTEND_SETUP.md]          ← architecture overview
[backend route file]         ← the API endpoint you're consuming
[existing component files]   ← files you're modifying

Task: Build the [specific page/component] for [feature].
```
