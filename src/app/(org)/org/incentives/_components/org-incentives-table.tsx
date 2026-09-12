'use client';

import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table';
import { Button } from '@ui/button';
import { format } from 'date-fns';
import { useMemo } from 'react';

import type { IOrgIncentiveListItem } from '@app-types/org/org.incentives';

import { IncentiveStatusBadge } from './incentive-status-badge';
import { OrgIncentivesTableEmpty, OrgIncentivesTableError } from './org-incentives-table-states';
import { OrgIncentivesTableSkeleton } from './org-incentives-table-skeleton';

function formatDate(value: string | null): string {
  return value ? format(new Date(value), 'dd MMM yyyy') : '—';
}

interface OrgIncentivesTableProps {
  incentives: IOrgIncentiveListItem[];
  isLoading: boolean;
  isError: boolean;
  hasFilters: boolean;
  limit: number;
  busyId?: string;
  onRetry: () => void;
  onPay: (incentive: IOrgIncentiveListItem) => void;
  onDispute: (incentive: IOrgIncentiveListItem) => void;
}

export function OrgIncentivesTable({
  incentives,
  isLoading,
  isError,
  hasFilters,
  limit,
  busyId,
  onRetry,
  onPay,
  onDispute,
}: OrgIncentivesTableProps): React.JSX.Element {
  const columns = useMemo<ColumnDef<IOrgIncentiveListItem>[]>(
    () => [
      {
        id: 'candidate',
        header: 'Candidate',
        cell: ({ row }) => {
          const i = row.original;
          const name = i.candidate
            ? `${i.candidate.firstName} ${i.candidate.lastName}`
            : 'Unknown Candidate';
          return (
            <div>
              <p className="text-sm font-semibold text-foreground">{name}</p>
              <p className="max-w-44 truncate text-[11px] text-muted-foreground">
                {i.job?.title ?? '—'}
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
        accessorKey: 'hiredAt',
        header: 'Hire Date',
        cell: ({ getValue }) => (
          <span className="text-xs text-muted-foreground">
            {formatDate(getValue<string | null>())}
          </span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ getValue }) => (
          <IncentiveStatusBadge status={getValue<IOrgIncentiveListItem['status']>()} />
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
              <div className="flex items-center justify-end gap-1.5">
                <Button
                  size="sm"
                  className="h-7 bg-brand-emerald px-2 text-xs text-white hover:bg-brand-emerald/90"
                  disabled={isBusy}
                  onClick={() => onPay(i)}
                >
                  Pay ${i.amount.toFixed(0)}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 px-2 text-xs"
                  disabled={isBusy}
                  onClick={() => onDispute(i)}
                >
                  Dispute
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

          if (i.status === 'DISPUTED') {
            return (
              <span className="flex items-center justify-end text-[10px] text-muted-foreground">
                Awaiting review
              </span>
            );
          }

          return null; // WAIVED — status column already communicates this
        },
      },
    ],
    [busyId, onDispute, onPay],
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: incentives,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  return (
    <div className="flex-1 overflow-auto rounded-xl border border-border bg-card">
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
        <tbody className="divide-y divide-border">
          {isLoading ? (
            <OrgIncentivesTableSkeleton rows={limit} />
          ) : isError ? (
            <tr>
              <td colSpan={columns.length}>
                <OrgIncentivesTableError onRetry={onRetry} />
              </td>
            </tr>
          ) : incentives.length === 0 ? (
            <tr>
              <td colSpan={columns.length}>
                <OrgIncentivesTableEmpty hasFilters={hasFilters} />
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
