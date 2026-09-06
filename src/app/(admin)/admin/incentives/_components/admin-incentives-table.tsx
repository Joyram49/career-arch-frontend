'use client';

import { type IAdminIncentiveListItem } from '@app-types/admin/admin.dashboard.incentives';
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table';
import { Button } from '@ui/button';
import { useMemo } from 'react';
import { StatusBadge } from '../../_components/shared';
import { IncentivesEmptyState } from './admin-incentives-table-empty';
import { IncentivesErrorState } from './admin-incentives-table-error';
import { IncentivesTableSkeleton } from './admin-incentives-table-skeleton';

type BadgeStatus = 'pending' | 'overdue' | 'disputed' | 'paid' | 'waived';

function toBadgeStatus(status: IAdminIncentiveListItem['status']): BadgeStatus {
  return status.toLowerCase() as BadgeStatus;
}

function formatDate(value: string | null): string {
  return value ? new Date(value).toLocaleDateString() : '—';
}

interface AdminIncentivesTableProps {
  incentives: IAdminIncentiveListItem[];
  isLoading: boolean;
  isError: boolean;
  hasFilters: boolean;
  limit: number;
  onRetry: () => void;
  onWaive: (incentive: IAdminIncentiveListItem) => void;
  onResolveDispute: (incentive: IAdminIncentiveListItem) => void;
  /** id of the incentive currently being mutated, to show a busy state on its row */
  busyId?: string;
}

export function AdminIncentivesTable({
  incentives,
  isLoading,
  isError,
  hasFilters,
  limit,
  onRetry,
  onWaive,
  onResolveDispute,
  busyId,
}: AdminIncentivesTableProps): React.JSX.Element {
  const columns = useMemo<ColumnDef<IAdminIncentiveListItem>[]>(
    () => [
      {
        id: 'organization',
        header: 'Organization',
        cell: ({ row }) => (
          <span className="text-sm font-semibold text-foreground">
            {row.original.organization?.companyName ?? 'Unknown Org'}
          </span>
        ),
      },
      {
        id: 'candidate',
        header: 'Candidate',
        cell: ({ row }) => {
          const c = row.original.candidate;
          const name = c ? `${c.firstName} ${c.lastName}` : 'Unknown Candidate';
          return (
            <div>
              <p className="text-sm text-foreground">{name}</p>
              <p className="max-w-40 truncate text-[11px] text-muted-foreground">
                {row.original.job?.title ?? '—'}
              </p>
            </div>
          );
        },
      },
      {
        accessorKey: 'amount',
        header: 'Amount',
        cell: ({ getValue }) => (
          <span className="text-sm font-bold text-foreground">
            ${getValue<number>().toFixed(2)}
          </span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ getValue }) => (
          <StatusBadge status={toBadgeStatus(getValue<IAdminIncentiveListItem['status']>())} />
        ),
      },
      {
        accessorKey: 'hiredAt',
        header: 'Hire Date',
        cell: ({ getValue }) => (
          <span className="text-xs text-muted-foreground">
            {formatDate(getValue<string | null>())}
          </span>
        ),
      },
      {
        id: 'dueOrPaid',
        header: 'Due / Paid Date',
        cell: ({ row }) => {
          const i = row.original;
          if (i.status === 'PAID') {
            return <span className="text-xs text-muted-foreground">{formatDate(i.paidAt)}</span>;
          }
          const isOverdue = i.status === 'OVERDUE';
          return (
            <span
              className={
                isOverdue ? 'text-xs font-medium text-brand-red' : 'text-xs text-muted-foreground'
              }
            >
              {formatDate(i.dueAt)}
            </span>
          );
        },
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => {
          const i = row.original;
          const isBusy = busyId === i.id;

          if (i.status === 'PENDING' || i.status === 'OVERDUE') {
            return (
              <div className="flex items-center justify-end">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 px-2 text-xs"
                  disabled={isBusy}
                  onClick={() => onWaive(i)}
                >
                  Waive
                </Button>
              </div>
            );
          }

          if (i.status === 'DISPUTED') {
            return (
              <div className="flex items-center justify-end gap-1.5">
                <Button
                  size="sm"
                  className="h-7 bg-brand-sky px-2 text-xs text-white hover:bg-brand-sky/90"
                  disabled={isBusy}
                  onClick={() => onResolveDispute(i)}
                >
                  Resolve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 px-2 text-xs"
                  disabled={isBusy}
                  onClick={() => onWaive(i)}
                >
                  Waive
                </Button>
              </div>
            );
          }

          if (i.status === 'PAID') {
            return (
              <span className="flex items-center justify-end text-[10px] font-medium text-brand-emerald">
                ✓ Paid
              </span>
            );
          }

          // WAIVED — status column already communicates this, no action needed.
          return null;
        },
      },
    ],
    [busyId, onResolveDispute, onWaive],
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: incentives,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  return (
    <div className="flex-1 overflow-auto">
      <table className="w-full text-left" aria-label="Incentives table">
        <thead className="border-b border-border bg-muted/40">
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((h) => (
                <th
                  key={h.id}
                  className="px-5 py-3 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase"
                >
                  {flexRender(h.column.columnDef.header, h.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-border bg-card">
          {isLoading ? (
            <IncentivesTableSkeleton rows={limit} />
          ) : isError ? (
            <tr>
              <td colSpan={columns.length}>
                <IncentivesErrorState onRetry={onRetry} />
              </td>
            </tr>
          ) : incentives.length === 0 ? (
            <tr>
              <td colSpan={columns.length}>
                <IncentivesEmptyState hasFilters={hasFilters} />
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
