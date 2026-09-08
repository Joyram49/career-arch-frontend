/* eslint-disable @typescript-eslint/explicit-function-return-type */
'use client';

import { type IAdminPlanListItem } from '@app-types/admin/admin.dashboard.plans';
import { type ColumnDef } from '@tanstack/react-table';
import { Button } from '@ui/button';
import { useMemo } from 'react';
import { formatLimit, formatPriceCents } from './admin-plans-utils';

interface UseAdminPlansColumnsArgs {
  onEdit: (plan: IAdminPlanListItem) => void;
  onRequestToggle: (plan: IAdminPlanListItem) => void;
  onRequestDelete: (plan: IAdminPlanListItem) => void;
}

const PLAN_BADGE_STYLES: Record<IAdminPlanListItem['key'], string> = {
  FREE: 'bg-slate-100 text-slate-500 border border-slate-200',
  BASIC: 'bg-sky-50 text-sky-700 border border-sky-200',
  PREMIUM: 'bg-amber-50 text-amber-700 border border-amber-200',
};

export function useAdminPlansColumns({
  onEdit,
  onRequestToggle,
  onRequestDelete,
}: UseAdminPlansColumnsArgs) {
  return useMemo<ColumnDef<IAdminPlanListItem>[]>(
    () => [
      {
        id: 'plan',
        header: 'Plan',
        cell: ({ row }) => {
          const p = row.original;
          return (
            <div>
              <span
                className={`rounded px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase ${PLAN_BADGE_STYLES[p.key]}`}
              >
                {p.key}
              </span>
              <p className="mt-1 text-sm font-semibold text-foreground">{p.displayName}</p>
            </div>
          );
        },
      },
      {
        accessorKey: 'monthlyPriceCents',
        header: 'Price',
        cell: ({ row }) => (
          <span className="text-sm font-bold text-foreground">
            {formatPriceCents(row.original.monthlyPriceCents)}
            {row.original.monthlyPriceCents > 0 && (
              <span className="text-xs font-normal text-muted-foreground">/mo</span>
            )}
          </span>
        ),
      },
      {
        id: 'applyLimit',
        header: 'Apply Limit',
        cell: ({ row }) => (
          <span className="text-sm text-foreground">
            {formatLimit(row.original.features.applyMonthlyLimit, 'apply', 'applies')}
          </span>
        ),
      },
      {
        id: 'savedJobsLimit',
        header: 'Saved Jobs',
        cell: ({ row }) => (
          <span className="text-sm text-foreground">
            {formatLimit(row.original.features.saveJobsLimit, 'job')}
          </span>
        ),
      },
      {
        id: 'features',
        header: 'Features',
        cell: ({ row }) => {
          const f = row.original.features;
          const enabled = [
            f.canViewOrgProfile && 'View org profiles',
            f.earlyJobAlerts && 'Early alerts',
            f.canDownloadHistory && 'Download history',
            f.aiResumeTips && 'AI resume tips',
            f.prioritySearch && 'Priority search',
          ].filter(Boolean) as string[];
          return (
            <div className="flex max-w-56 flex-wrap gap-1">
              {enabled.length === 0 ? (
                <span className="text-xs text-muted-foreground">Basic only</span>
              ) : (
                enabled.map((label) => (
                  <span
                    key={label}
                    className="rounded border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-700"
                  >
                    {label}
                  </span>
                ))
              )}
            </div>
          );
        },
      },
      {
        id: 'stripe',
        header: 'Stripe',
        cell: ({ row }) => {
          const p = row.original;
          if (!p.stripeProductId) {
            return <span className="text-xs text-muted-foreground italic">Not synced</span>;
          }
          return (
            <div className="space-y-0.5">
              <code className="block rounded bg-muted px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground">
                {p.stripeProductId}
              </code>
              <code className="block rounded bg-muted px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground">
                {p.stripePriceId}
              </code>
            </div>
          );
        },
      },
      {
        id: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const p = row.original;
          const isFree = p.key === 'FREE';
          return (
            <button
              type="button"
              disabled={isFree}
              onClick={() => onRequestToggle(p)}
              className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase transition-all disabled:cursor-not-allowed disabled:opacity-60 ${
                p.isActive
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  : 'border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100'
              }`}
              aria-label={`Toggle ${p.displayName} — currently ${p.isActive ? 'active' : 'inactive'}`}
              title={isFree ? 'The FREE plan cannot be deactivated' : undefined}
            >
              {p.isActive ? 'Active' : 'Inactive'}
            </button>
          );
        },
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => {
          const p = row.original;
          const isFree = p.key === 'FREE';
          return (
            <div className="flex items-center justify-end gap-1.5">
              <Button
                size="sm"
                variant="outline"
                className="h-7 px-2 text-xs"
                onClick={() => onEdit(p)}
              >
                <i className="ti ti-edit mr-1 text-xs" aria-hidden="true" />
                Edit
              </Button>
              {!isFree && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 border-red-200 px-2 text-xs text-red-600 hover:bg-red-50"
                  onClick={() => onRequestDelete(p)}
                >
                  Delete
                </Button>
              )}
            </div>
          );
        },
      },
    ],
    [onEdit, onRequestToggle, onRequestDelete],
  );
}
