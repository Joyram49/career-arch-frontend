// src/hooks/use-query-params.ts
'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import type { ZodSchema } from 'zod';

/**
 * ── useQueryParams ───────────────────────────────────────────────────────
 *
 * Single source of truth for "URL as state". Give it a Zod schema (the same
 * kind you already write for backend query validation — e.g.
 * `adminListUsersSchema.shape.query`) and it will:
 *
 *   1. Read the current URLSearchParams
 *   2. Run them through the schema (coerce, default, drop invalid)
 *   3. Give you back a fully-typed, sanitized params object
 *   4. Give you setters that push a new URL without a full page reload
 *
 * Why a schema instead of a plain object?
 * - Same "sanitize once, trust everywhere" contract we use on the backend
 *   (see admin.users.validation.ts / admin.orgs.validation.ts) — a malformed
 *   or tampered query string (e.g. ?page=abc or ?isActive=maybe) can never
 *   leak into component state; it silently falls back to schema defaults.
 * - Re-uses `.coerce.number()`, `.enum()`, `.transform()` you already know.
 *
 * STABILITY CONTRACT (read this before wiring up an effect):
 * `setParam`, `setParams`, `resetParams`, and `buildHref` are referentially
 * stable across navigations — they only get a new identity if `pathname`,
 * `replace`, `scroll`, or the `schema` reference itself changes. That means
 * it's SAFE to put them in a `useEffect` dependency array:
 *
 *   useEffect(() => {
 *     setParams({ search: debouncedSearch || undefined, page: 1 });
 *   }, [debouncedSearch, setParams]); // won't re-fire when `page` changes elsewhere
 *
 * This is achieved WITHOUT refs (React Compiler forbids mutating a ref
 * during render — see the `reactCompiler: true` flag in next.config.ts).
 * Instead, `buildHref` reads the CURRENT URL from `window.location.search`
 * at call time rather than closing over the `params` computed during some
 * earlier render. It's only ever invoked from event handlers/effects (never
 * during render), so `window` is always available and always up to date.
 *
 * IMPORTANT: pass a module-level (stable) schema, e.g.
 *   export const adminUsersQuerySchema = adminListUsersSchema.shape.query;
 * NOT an inline `z.object({...})` literal created on every render — an
 * inline schema defeats the stability contract above, since `parseParams`
 * (and therefore `buildHref`/`setParams`) would depend on it.
 */

type ParamsUpdate<T> = Partial<T> | ((prev: T) => Partial<T>);

interface UseQueryParamsOptions {
  /** Scroll to top after the URL updates. Default: false (good for filters/pagination). */
  scroll?: boolean;
  /** Replace history entry instead of pushing a new one. Default: true — filter changes
   *  shouldn't spam the back button. Set false for e.g. pagination you want to be back-able. */
  replace?: boolean;
}

export interface UseQueryParamsReturn<T extends Record<string, unknown>> {
  /** Fully parsed & sanitized params — safe to pass straight into a TanStack Query key. */
  params: T;
  /** Update a single key. Pass `undefined` to remove it from the URL entirely. */
  setParam: <K extends keyof T>(key: K, value: T[K] | undefined) => void;
  /** Update several keys at once (object, or updater function reading the previous params). */
  setParams: (update: ParamsUpdate<T>) => void;
  /** Clear every param back to the schema's defaults. */
  resetParams: () => void;
  /** Raw string builder if you need an <a href> instead of a router.push. */
  buildHref: (update: ParamsUpdate<T>) => string;
}

export function useQueryParams<T extends Record<string, unknown>>(
  schema: ZodSchema<T>,
  options: UseQueryParamsOptions = {},
): UseQueryParamsReturn<T> {
  const { scroll = false, replace = true } = options;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();

  const parseParams = useCallback(
    (sp: URLSearchParams): T => {
      const raw = Object.fromEntries(sp.entries());
      const parsed = schema.safeParse(raw);
      if (parsed.success) return parsed.data;

      // Malformed/tampered query string — fall back to schema defaults rather than throwing.
      const fallback = schema.safeParse({});
      return fallback.success ? fallback.data : ({} as T);
    },
    [schema],
  );

  // Reactive value for rendering — recomputes whenever the URL actually changes.
  const params: T = useMemo(
    () => parseParams(new URLSearchParams(searchParamsString)),
    [searchParamsString, parseParams],
  );

  // Write-side: deliberately does NOT depend on `params`/`searchParamsString`.
  // It reads `window.location.search` fresh at call time instead, so its
  // identity stays fixed across navigations — see the stability contract
  // in the file header comment.
  const buildHref = useCallback(
    (update: ParamsUpdate<T>): string => {
      const currentSearch = window.location.search;
      const currentParams = parseParams(new URLSearchParams(currentSearch));
      const next = typeof update === 'function' ? update(currentParams) : update;

      const sp = new URLSearchParams(currentSearch);
      Object.entries(next).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') {
          sp.delete(key);
        } else {
          sp.set(key, String(value));
        }
      });

      const qs = sp.toString();
      return qs.length > 0 ? `${pathname}?${qs}` : pathname;
    },
    [pathname, parseParams],
  );

  const setParams = useCallback(
    (update: ParamsUpdate<T>) => {
      const href = buildHref(update);
      if (replace) {
        router.replace(href, { scroll });
      } else {
        router.push(href, { scroll });
      }
    },
    [buildHref, replace, router, scroll],
  );

  const setParam = useCallback(
    <K extends keyof T>(key: K, value: T[K] | undefined) => {
      setParams({ [key]: value } as Partial<T>);
    },
    [setParams],
  );

  const resetParams = useCallback(() => {
    if (replace) {
      router.replace(pathname, { scroll });
    } else {
      router.push(pathname, { scroll });
    }
  }, [pathname, replace, router, scroll]);

  return { params, setParam, setParams, resetParams, buildHref };
}
