'use client';

import { type IAdminSubscriptionListItem } from '@app-types/admin/admin.dashboard.subscriptions';
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table';
import { Button } from '@ui/button';
import { useMemo } from 'react';
import { StatusBadge } from '../../_components/shared';

const PLAN_STYLES: Record<string, string> = {
  FREE: 'bg-slate-100 text-slate-500 border border-slate-200',
  BASIC: 'bg-sky-50 text-sky-700 border border-sky-200',
  PREMIUM: 'bg-amber-50 text-amber-700 border border-amber-200',
};

const STATUS_MAP: Record<string, 'active' | 'archived' | 'pending'> = {
  ACTIVE: 'active',
  CANCELLED: 'archived',
  INACTIVE: 'archived',
  PAST_DUE: 'pending',
};

interface AdminSubscriptionsTableProps {
  subscriptions: IAdminSubscriptionListItem[];
  isLoading: boolean;
  isError: boolean;
  hasFilters: boolean;
  limit: number;
  onRetry: () => void;
  onCancel: (subscription: IAdminSubscriptionListItem) => void;
  onRefund: (subscription: IAdminSubscriptionListItem) => void;
  busyId?: string;
}

export function AdminSubscriptionsTable({
  subscriptions,
  isLoading,
  isError,
  hasFilters,
  limit,
  onRetry,
  onCancel,
  onRefund,
  busyId,
}: AdminSubscriptionsTableProps): React.JSX.Element {
  const columns = useMemo<ColumnDef<IAdminSubscriptionListItem>[]>(
    () => [
      {
        id: 'user',
        header: 'User',
        cell: ({ row }) => {
          const u = row.original.user;
          const name = u?.profile ? `${u.profile.firstName} ${u.profile.lastName}` : 'Unknown User';
          return (
            <div>
              <p className="text-sm font-semibold text-foreground">{name}</p>
              <p className="text-[11px] text-muted-foreground">{u?.email}</p>
            </div>
          );
        },
      },
      {
        accessorKey: 'plan',
        header: 'Plan',
        cell: ({ getValue }) => {
          const p = getValue<string>();
          return (
            <span
              className={`rounded px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase ${PLAN_STYLES[p]}`}
            >
              {p}
            </span>
          );
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ getValue }) => (
          <StatusBadge status={STATUS_MAP[getValue<string>()] ?? 'pending'} />
        ),
      },
      {
        accessorKey: 'amountCents',
        header: 'Amount',
        cell: ({ getValue }) => (
          <span className="text-sm font-semibold text-foreground">
            ${(getValue<number>() / 100).toFixed(2)}/mo
          </span>
        ),
      },
      {
        accessorKey: 'applyCountThisMonth',
        header: 'Applications',
        cell: ({ getValue }) => (
          <span className="text-sm font-semibold text-foreground">{getValue<number>()}</span>
        ),
      },
      {
        accessorKey: 'currentPeriodEnd',
        header: 'Renewal',
        cell: ({ getValue }) => {
          const v = getValue<string | null>();
          return (
            <span className="text-xs text-muted-foreground">
              {v ? new Date(v).toLocaleDateString() : '—'}
            </span>
          );
        },
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => {
          const s = row.original;
          const isBusy = busyId === s.id;
          const canCancel = s.plan !== 'FREE' && s.status === 'ACTIVE';
          const canRefund = s.plan !== 'FREE' && s.status !== 'CANCELLED';

          return (
            <div className="flex items-center justify-end gap-1.5">
              {canCancel && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 border-red-300 px-2 text-xs text-red-600 hover:bg-red-50"
                  disabled={isBusy}
                  onClick={() => onCancel(s)}
                >
                  Cancel
                </Button>
              )}
              {canRefund && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 px-2 text-xs"
                  disabled={isBusy}
                  onClick={() => onRefund(s)}
                >
                  Refund
                </Button>
              )}
            </div>
          );
        },
      },
    ],
    [busyId, onCancel, onRefund],
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: subscriptions,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  return (
    <div className="flex-1 overflow-auto">
      <table className="w-full text-left" aria-label="Subscriptions table">
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
            Array.from({ length: limit }).map((_, i) => (
              <tr key={i} className="animate-pulse">
                <td colSpan={columns.length} className="px-5 py-3">
                  <div className="h-4 w-full rounded bg-muted" />
                </td>
              </tr>
            ))
          ) : isError ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-5 py-12 text-center text-sm text-muted-foreground"
              >
                Failed to load subscriptions.{' '}
                <button type="button" className="text-brand-sky underline" onClick={onRetry}>
                  Try again
                </button>
              </td>
            </tr>
          ) : subscriptions.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-5 py-12 text-center text-sm text-muted-foreground"
              >
                {hasFilters ? 'No subscriptions match your filters.' : 'No subscriptions yet.'}
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
