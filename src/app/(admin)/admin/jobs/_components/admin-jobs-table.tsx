'use client';

import type { AdminJobSortBy, IAdminJobListItem } from '@app-types/admin/admin.dashboard.jobs';
import { cn } from '@lib/utils';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table';
import { Button } from '@ui/button';
import { isPast } from 'date-fns';
import { useMemo } from 'react';
import { StatusBadge } from '../../_components/shared';
import { JobsEmptyState } from './admin-jobs-table-empty';
import { JobsErrorState } from './admin-jobs-table-error';
import { JobsTableSkeleton } from './admin-jobs-table-skeleton';

// ── Salary formatting helper ─────────────────────────────────────────────
function formatSalary(min: number | null, max: number | null, currency: string): string {
  if (min === null && max === null) return 'Not disclosed';
  const fmt = (n: number): string =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(n);

  if (min !== null && max !== null) return `${fmt(min)} – ${fmt(max)}`;
  if (min !== null) return `From ${fmt(min)}`;
  return `Up to ${fmt(max as number)}`;
}

interface AdminJobsTableProps {
  jobs: IAdminJobListItem[];
  isLoading: boolean;
  isError: boolean;
  hasFilters: boolean;
  limit: number;
  sortBy: AdminJobSortBy;
  sortOrder: 'asc' | 'desc';
  onSortChange: (sortBy: AdminJobSortBy | undefined, sortOrder: 'asc' | 'desc' | undefined) => void;
  onRetry: () => void;
  onView: (job: IAdminJobListItem) => void;
  onTakedown: (job: IAdminJobListItem) => void;
  onRepublish: (job: IAdminJobListItem) => void;
  onArchive: (job: IAdminJobListItem) => void;
  /** id of the job currently being republished, to show a busy state on its row */
  republishingId?: string;
}

export function AdminJobsTable({
  jobs,
  isLoading,
  isError,
  hasFilters,
  limit,
  sortBy,
  sortOrder,
  onSortChange,
  onRetry,
  onView,
  onTakedown,
  onRepublish,
  onArchive,
  republishingId,
}: AdminJobsTableProps): React.JSX.Element {
  const columns = useMemo<ColumnDef<IAdminJobListItem>[]>(
    () => [
      {
        id: 'title',
        header: 'Job',
        enableSorting: true,
        cell: ({ row }) => {
          const job = row.original;
          return (
            <div>
              <p className="text-sm font-semibold text-foreground">{job.title}</p>
              <p className="text-[11px] text-muted-foreground">
                {job.organization.profile?.companyName ?? job.organization.email}
              </p>
            </div>
          );
        },
      },
      {
        id: 'category',
        header: 'Category',
        enableSorting: false,
        cell: ({ row }) => (
          <span className="text-xs text-muted-foreground">{row.original.category ?? '—'}</span>
        ),
      },
      {
        id: 'salaryMin',
        header: 'Salary',
        enableSorting: true,
        cell: ({ row }) => (
          <span className="text-xs whitespace-nowrap text-foreground">
            {formatSalary(
              row.original.salaryMin,
              row.original.salaryMax,
              row.original.salaryCurrency,
            )}
          </span>
        ),
      },
      {
        id: 'vacancies',
        header: 'Vacancy',
        enableSorting: false,
        cell: ({ row }) => (
          <span className="text-sm font-semibold text-foreground">{row.original.vacancies}</span>
        ),
      },
      {
        id: 'deadline',
        header: 'Deadline',
        enableSorting: false,
        cell: ({ row }) => {
          const { deadline } = row.original;
          if (deadline === null) {
            return <span className="text-xs text-muted-foreground">No deadline</span>;
          }
          const expired = isPast(new Date(deadline));
          return (
            <span
              className={cn(
                'flex items-center gap-1 text-xs font-medium whitespace-nowrap',
                expired ? 'text-brand-red' : 'text-foreground',
              )}
            >
              {expired && <i className="ti ti-alert-triangle text-[11px]" aria-hidden="true" />}
              {new Date(deadline).toLocaleDateString()}
            </span>
          );
        },
      },
      {
        id: 'status',
        header: 'Status',
        enableSorting: false,
        cell: ({ row }) => <StatusBadge status={row.original.status.toLowerCase() as never} />,
      },
      {
        id: 'applications',
        header: 'Applications',
        enableSorting: false,
        cell: ({ row }) => (
          <span className="text-sm font-semibold text-foreground">
            {row.original._count.applications}
          </span>
        ),
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => {
          const job = row.original;
          const isBusy = republishingId === job.id;
          return (
            <div className="flex items-center justify-end gap-1.5">
              <Button
                size="sm"
                variant="outline"
                className="h-7 px-2 text-xs"
                onClick={() => onView(job)}
              >
                View
              </Button>

              {job.status === 'PUBLISHED' && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 border-red-300 px-2 text-xs text-red-600 hover:bg-red-50"
                  onClick={() => onTakedown(job)}
                >
                  Takedown
                </Button>
              )}

              {job.status === 'CLOSED' && (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 border-emerald-300 px-2 text-xs text-emerald-700 hover:bg-emerald-50"
                    disabled={isBusy}
                    onClick={() => onRepublish(job)}
                  >
                    {isBusy ? 'Republishing…' : 'Republish'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 border-slate-300 px-2 text-xs text-slate-500 hover:bg-slate-50"
                    onClick={() => onArchive(job)}
                  >
                    Archive
                  </Button>
                </>
              )}

              {job.status === 'ARCHIVED' && (
                <span className="text-[10px] text-muted-foreground italic">
                  Pending cron deletion
                </span>
              )}
            </div>
          );
        },
      },
    ],
    [onArchive, onRepublish, onTakedown, onView, republishingId],
  );

  const sorting: SortingState = [{ id: sortBy, desc: sortOrder === 'desc' }];

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: jobs,
    columns,
    state: { sorting },
    onSortingChange: (updater) => {
      const nextSorting = typeof updater === 'function' ? updater(sorting) : updater;
      const sort = nextSorting[0];
      onSortChange(
        sort?.id as AdminJobSortBy | undefined,
        sort ? (sort.desc ? 'desc' : 'asc') : undefined,
      );
    },
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    manualPagination: true,
    enableMultiSort: false,
  });

  return (
    <div className="flex-1 overflow-auto">
      <table className="w-full text-left" aria-label="Jobs table">
        <thead className="border-b border-border bg-muted/40">
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((h) => (
                <th
                  key={h.id}
                  className="px-5 py-3 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase"
                  onClick={h.column.getToggleSortingHandler()}
                  style={{ cursor: h.column.getCanSort() ? 'pointer' : 'default' }}
                >
                  <span className="flex items-center gap-1">
                    {flexRender(h.column.columnDef.header, h.getContext())}
                    {h.column.getIsSorted() === 'asc' && (
                      <i className="ti ti-chevron-up text-xs" aria-hidden="true" />
                    )}
                    {h.column.getIsSorted() === 'desc' && (
                      <i className="ti ti-chevron-down text-xs" aria-hidden="true" />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-border bg-card">
          {isLoading ? (
            <JobsTableSkeleton rows={limit} />
          ) : isError ? (
            <tr>
              <td colSpan={columns.length}>
                <JobsErrorState onRetry={onRetry} />
              </td>
            </tr>
          ) : jobs.length === 0 ? (
            <tr>
              <td colSpan={columns.length}>
                <JobsEmptyState hasFilters={hasFilters} />
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="transition-colors hover:bg-muted/20">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-5 py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
