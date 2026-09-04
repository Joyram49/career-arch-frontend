// src/providers/query-params-provider.tsx
'use client';

import { useQueryParams, type UseQueryParamsReturn } from '@hooks/use-query-params';
import { createContext, useContext } from 'react';
import type { ZodSchema } from 'zod';

/**
 * ── QueryParamsProvider ──────────────────────────────────────────────────
 *
 * Wrap a page (or a section of one) whose filter bar, table, and pagination
 * all need the SAME sanitized query-params object. Without this, you'd
 * either lift state manually or call useQueryParams() in three places and
 * risk them drifting out of sync mid-navigation.
 *
 * Usage — e.g. admin/users/page.tsx:
 *
 *   const querySchema = adminListUsersSchema.shape.query; // reuse backend zod schema
 *
 *   <QueryParamsProvider schema={querySchema}>
 *     <SearchFilterBar />   // reads/writes `search`
 *     <UsersTable />        // reads `sortBy`, `sortOrder`
 *     <PaginationProvider>  // page/limit can also live here — see pagination-provider.tsx
 *       <PaginationControls />
 *     </PaginationProvider>
 *   </QueryParamsProvider>
 *
 * Generic type parameter is intentionally erased in the context value
 * (stored as Record<string, unknown>) because React context can't carry an
 * open generic — useQueryParamsContext<T>() restores the type at the call
 * site, same trick used for QueryClient / any other generic context.
 */

type AnyParams = Record<string, unknown>;

const QueryParamsContext = createContext<UseQueryParamsReturn<AnyParams> | null>(null);

interface QueryParamsProviderProps<T extends AnyParams> {
  schema: ZodSchema<T>;
  children: React.ReactNode;
}

export function QueryParamsProvider<T extends AnyParams>({
  schema,
  children,
}: QueryParamsProviderProps<T>): React.JSX.Element {
  const value = useQueryParams(schema);

  return (
    <QueryParamsContext.Provider value={value as unknown as UseQueryParamsReturn<AnyParams>}>
      {children}
    </QueryParamsContext.Provider>
  );
}

/** Consume the shared params inside any descendant of <QueryParamsProvider>. */
export function useQueryParamsContext<T extends AnyParams>(): UseQueryParamsReturn<T> {
  const ctx = useContext(QueryParamsContext);
  if (ctx === null) {
    throw new Error('useQueryParamsContext must be used within a <QueryParamsProvider>');
  }
  return ctx as unknown as UseQueryParamsReturn<T>;
}
