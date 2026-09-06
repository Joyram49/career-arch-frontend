/* eslint-disable @typescript-eslint/explicit-function-return-type */
'use client';

import { type IAdminTransactionListItem } from '@app-types/admin/admin.dashboard.transactions';
import { cn } from '@lib/utils';
import { type ColumnDef } from '@tanstack/react-table';
import { Button } from '@ui/button';
import { useMemo } from 'react';
import { StatusBadge } from '../../_components/shared';
import { formatCents, partyInitials, TX_TYPE_LABEL } from './admin-transactions-utils';

const TX_TYPE_STYLES: Record<string, string> = {
  SUBSCRIPTION: 'bg-sky-50 text-sky-700 border border-sky-200',
  INCENTIVE: 'bg-amber-50 text-amber-700 border border-amber-200',
  REFUND: 'bg-purple-50 text-purple-700 border border-purple-200',
  OTHER: 'bg-slate-50 text-slate-600 border border-slate-200',
};

const TX_TYPE_ICONS: Record<string, string> = {
  SUBSCRIPTION: 'ti-credit-card',
  INCENTIVE: 'ti-coin',
  REFUND: 'ti-arrow-back-up',
  OTHER: 'ti-receipt',
};

interface UseAdminTransactionsColumnsArgs {
  onView: (transaction: IAdminTransactionListItem) => void;
}

export function useAdminTransactionsColumns({ onView }: UseAdminTransactionsColumnsArgs) {
  return useMemo<ColumnDef<IAdminTransactionListItem>[]>(
    () => [
      {
        accessorKey: 'createdAt',
        header: 'Date',
        enableSorting: true,
        cell: ({ row }) => (
          <span className="text-xs text-muted-foreground">
            {new Date(row.original.createdAt).toLocaleDateString()}
          </span>
        ),
      },
      {
        id: 'type',
        header: 'Type',
        enableSorting: false,
        cell: ({ row }) => {
          const t = row.original.type;
          return (
            <span
              className={cn(
                'inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-semibold',
                TX_TYPE_STYLES[t],
              )}
            >
              <i className={cn('ti text-xs', TX_TYPE_ICONS[t])} aria-hidden="true" />
              {TX_TYPE_LABEL[t]}
            </span>
          );
        },
      },
      {
        id: 'description',
        header: 'Description',
        enableSorting: false,
        cell: ({ row }) => {
          const tx = row.original;
          const label = tx.user?.name ?? tx.organization?.companyName ?? 'Unknown';
          const email = tx.user?.email ?? tx.organization?.email ?? '';
          return (
            <div className="flex items-center gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-sky/15 text-xs font-bold text-brand-sky">
                {partyInitials(label)}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm text-foreground">{tx.description ?? '—'}</p>
                <p className="truncate text-[11px] text-muted-foreground">
                  {label}
                  {email ? ` · ${email}` : ''}
                </p>
              </div>
            </div>
          );
        },
      },
      {
        id: 'subscription',
        header: 'Plan',
        enableSorting: false,
        cell: ({ row }) => {
          const sub = row.original.subscription;
          if (!sub) return <span className="text-xs text-muted-foreground">—</span>;
          return (
            <span className="text-xs font-medium text-foreground capitalize">
              {sub.plan.toLowerCase()}{' '}
              <span className="text-muted-foreground">({sub.billingCycle.toLowerCase()})</span>
            </span>
          );
        },
      },
      {
        accessorKey: 'amountCents',
        header: 'Amount',
        enableSorting: true,
        cell: ({ row }) => {
          const tx = row.original;
          const isNegative = tx.type === 'REFUND' || tx.isRefunded;
          return (
            <span
              className={cn('text-sm font-bold', isNegative ? 'text-brand-red' : 'text-foreground')}
            >
              {isNegative ? '-' : ''}
              {formatCents(Math.abs(tx.amountCents))}
            </span>
          );
        },
      },
      {
        id: 'status',
        header: 'Status',
        enableSorting: false,
        cell: ({ row }) => (
          <StatusBadge
            status={
              row.original.status.toLowerCase() as 'succeeded' | 'pending' | 'failed' | 'refunded'
            }
          />
        ),
      },
      {
        id: 'stripeId',
        header: 'Stripe ID',
        enableSorting: false,
        cell: ({ row }) => {
          const id =
            row.original.stripePaymentIntentId ??
            row.original.stripeInvoiceId ??
            row.original.stripeRefundId ??
            '—';
          return (
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
              {id}
            </code>
          );
        },
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-1.5">
            <Button
              size="sm"
              variant="outline"
              className="h-7 px-2 text-xs"
              onClick={() => onView(row.original)}
            >
              <i className="ti ti-receipt mr-1 text-xs" aria-hidden="true" />
              View
            </Button>
          </div>
        ),
      },
    ],
    [onView],
  );
}
