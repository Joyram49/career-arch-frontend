// src/components/shared/pagination-controls.tsx
'use client';

import { cn } from '@lib/utils';
import { usePagination } from '@providers/pagination-provider';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Drop-in replacement for the ad-hoc <AdminPagination> that currently lives
 * inline in admin/_components/shared.tsx. Reads everything from
 * usePagination() — no props needed — so it works identically whether the
 * parent <PaginationProvider> is standalone or URL-synced.
 */
interface PaginationControlsProps {
  className?: string;
  /** Show the "Showing X–Y of Z results" label. Default: true. */
  showSummary?: boolean;
}

export function PaginationControls({
  className,
  showSummary = true,
}: PaginationControlsProps): React.JSX.Element {
  const { page, limit, total, totalPages, canPrev, canNext, setPage, prevPage, nextPage } =
    usePagination();

  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  // Show at most 5 page buttons, centered around the current page.
  const windowSize = 5;
  const start = Math.max(
    1,
    Math.min(page - Math.floor(windowSize / 2), totalPages - windowSize + 1),
  );
  const pageButtons = Array.from(
    { length: Math.min(windowSize, totalPages) },
    (_, i) => Math.max(1, start) + i,
  );

  return (
    <div
      className={cn(
        'flex items-center justify-between border-t border-border px-6 py-3',
        className,
      )}
    >
      {showSummary && (
        <span className="text-xs text-muted-foreground">
          Showing {from}–{to} of {total} results
        </span>
      )}
      <div className="ml-auto flex items-center gap-1">
        <button
          type="button"
          onClick={prevPage}
          disabled={!canPrev}
          className="flex size-8 items-center justify-center rounded-lg border border-border bg-card text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Previous page"
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
        </button>

        {pageButtons.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPage(p)}
            className={cn(
              'flex size-8 items-center justify-center rounded-lg border text-sm font-medium transition',
              p === page
                ? 'border-brand-sky bg-brand-sky text-white'
                : 'border-border bg-card text-foreground hover:bg-muted',
            )}
            aria-current={p === page ? 'page' : undefined}
          >
            {p}
          </button>
        ))}

        <button
          type="button"
          onClick={nextPage}
          disabled={!canNext}
          className="flex size-8 items-center justify-center rounded-lg border border-border bg-card text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Next page"
        >
          <ChevronRight className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
