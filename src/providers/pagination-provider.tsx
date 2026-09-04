// src/providers/pagination-provider.tsx
'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';

/**
 * ── PaginationProvider ───────────────────────────────────────────────────
 *
 * Two modes, same API for consumers:
 *
 * 1) STANDALONE — page/limit live in local React state. Good for a modal's
 *    internal list, a dashboard widget, anything that doesn't need to
 *    survive a refresh.
 *
 *      <PaginationProvider initialLimit={10}>
 *        <MyList />
 *        <PaginationControls />
 *      </PaginationProvider>
 *
 * 2) URL-SYNCED (controlled) — pass `page`/`limit` + `onPageChange`/
 *    `onLimitChange` sourced from useQueryParamsContext(), so the page
 *    survives refresh/back-button and is shareable as a link. This is the
 *    one to use for every admin list page (Users, Orgs, Jobs, Subscriptions…).
 *
 *      const { params, setParam } = useQueryParamsContext<AdminListUsersQuery>();
 *
 *      <PaginationProvider
 *        page={params.page}
 *        limit={params.limit}
 *        onPageChange={(p) => setParam('page', p)}
 *        onLimitChange={(l) => setParam('limit', l)}
 *      >
 *        <UsersTable />
 *        <PaginationControls />
 *      </PaginationProvider>
 *
 * Either way, once your query hook resolves, call `setTotal(response.data.total)`
 * (e.g. inside a `useEffect` keyed on the query result) so totalPages/canNext
 * become accurate.
 */

interface PaginationContextValue {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  canPrev: boolean;
  canNext: boolean;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setTotal: (total: number) => void;
  nextPage: () => void;
  prevPage: () => void;
}

const PaginationContext = createContext<PaginationContextValue | null>(null);

interface PaginationProviderProps {
  children: React.ReactNode;
  /** Uncontrolled starting page. Ignored once `page` (controlled) is passed. */
  initialPage?: number;
  initialLimit?: number;
  /** Controlled mode — pass together with onPageChange to sync with the URL. */
  page?: number;
  limit?: number;
  total?: numbger;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
}

export function PaginationProvider({
  children,
  initialPage = 1,
  initialLimit = 10,
  page: controlledPage,
  limit: controlledLimit,
  total: controlledTotal,
  onPageChange,
  onLimitChange,
}: PaginationProviderProps): React.JSX.Element {
  const [internalPage, setInternalPage] = useState(initialPage);
  const [internalLimit, setInternalLimit] = useState(initialLimit);
  const [internalTotal, setInternalTotal] = useState(0);

  const isPageControlled = controlledPage !== undefined;
  const isLimitControlled = controlledLimit !== undefined;
  const isTotalControlled = controlledTotal !== undefined;

  const page = isPageControlled ? controlledPage : internalPage;
  const limit = isLimitControlled ? controlledLimit : internalLimit;
  const total = isTotalControlled ? controlledTotal : internalTotal;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const setPage = useCallback(
    (next: number) => {
      const clamped = Math.min(Math.max(1, next), totalPages);

      if (isPageControlled) {
        onPageChange?.(clamped);
      } else {
        setInternalPage(clamped);
      }
    },
    [isPageControlled, onPageChange, totalPages],
  );

  const setLimit = useCallback(
    (next: number) => {
      if (isLimitControlled) {
        onLimitChange?.(next);
      } else {
        setInternalLimit(next);
      }

      setPage(1);
    },
    [isLimitControlled, onLimitChange, setPage],
  );

  const nextPage = useCallback(() => {
    setPage(page + 1);
  }, [page, setPage]);

  const prevPage = useCallback(() => {
    setPage(page - 1);
  }, [page, setPage]);

  const value = useMemo<PaginationContextValue>(
    () => ({
      page,
      limit,
      total,
      totalPages,
      canPrev: page > 1,
      canNext: page < totalPages,
      setPage,
      setLimit,
      setTotal: setInternalTotal,
      nextPage,
      prevPage,
    }),
    [page, limit, total, totalPages, setPage, setLimit, nextPage, prevPage],
  );

  return <PaginationContext.Provider value={value}>{children}</PaginationContext.Provider>;
}

export function usePagination(): PaginationContextValue {
  const ctx = useContext(PaginationContext);
  if (ctx === null) {
    throw new Error('usePagination must be used within a <PaginationProvider>');
  }
  return ctx;
}
