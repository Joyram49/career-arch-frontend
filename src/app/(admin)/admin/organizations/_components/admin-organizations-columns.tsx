/* eslint-disable @typescript-eslint/explicit-function-return-type */
'use client';

import { type IAdminOrgListItem } from '@app-types/admin/admin.dashboard.orgs';
import { type ColumnDef } from '@tanstack/react-table';
import { Button } from '@ui/button';
import { useMemo } from 'react';
import { StatusBadge } from '../../_components/shared';
import { formatCents, orgInitials, orgLocationLabel } from './admin-organizations-utils';

interface UseAdminOrganizationsColumnsArgs {
  onView: (org: IAdminOrgListItem) => void;
  onRequestSuspend: (org: IAdminOrgListItem) => void;
  onRequestApprove: (org: IAdminOrgListItem) => void;
  onRequestActivate: (org: IAdminOrgListItem) => void;
}

export function useAdminOrganizationsColumns({
  onView,
  onRequestSuspend,
  onRequestApprove,
  onRequestActivate,
}: UseAdminOrganizationsColumnsArgs) {
  return useMemo<ColumnDef<IAdminOrgListItem>[]>(
    () => [
      {
        id: 'organization',
        header: 'Organization',
        enableSorting: false,
        cell: ({ row }) => {
          const org = row.original;
          const name = org.profile?.companyName ?? 'Unknown Org';
          return (
            <div className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-lg bg-brand-navy/10 text-[10px] font-bold text-brand-navy">
                {orgInitials(name)}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{name}</p>
                <p className="text-[11px] text-muted-foreground">{org.email}</p>
              </div>
            </div>
          );
        },
      },
      {
        id: 'industry',
        header: 'Industry',
        enableSorting: false,
        cell: ({ row }) => (
          <span className="text-xs text-muted-foreground">
            {row.original.profile?.industry ?? '—'}
          </span>
        ),
      },
      {
        id: 'location',
        header: 'Location',
        enableSorting: false,
        cell: ({ row }) => (
          <span className="text-xs text-muted-foreground">
            {orgLocationLabel(row.original.profile)}
          </span>
        ),
      },
      {
        id: 'jobs',
        header: 'Jobs',
        enableSorting: false,
        cell: ({ row }) => (
          <span className="text-sm font-semibold text-foreground">{row.original._count.jobs}</span>
        ),
      },
      {
        id: 'hires',
        header: 'Hires',
        enableSorting: false,
        cell: ({ row }) => (
          <span className="text-sm font-semibold text-foreground">{row.original.hiredCount}</span>
        ),
      },
      {
        id: 'incentives',
        header: 'Unpaid Incentives',
        enableSorting: false,
        cell: ({ row }) => {
          const { unpaidAmountCents, unpaidCount } = row.original.incentives;
          if (unpaidAmountCents <= 0) {
            return <span className="text-sm text-muted-foreground">—</span>;
          }
          return (
            <div>
              <span className="text-sm font-semibold text-brand-red">
                {formatCents(unpaidAmountCents)}
              </span>
              <p className="text-[10px] text-muted-foreground">
                {unpaidCount} incentive{unpaidCount === 1 ? '' : 's'}
              </p>
            </div>
          );
        },
      },
      {
        id: 'status',
        header: 'Status',
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex flex-col items-start gap-1">
            <StatusBadge status={row.original.isApproved ? 'approved' : 'pending'} />
            <StatusBadge status={row.original.isActive ? 'active' : 'suspended'} />
          </div>
        ),
      },
      {
        accessorKey: 'lastLoginAt',
        header: 'Last Login',
        enableSorting: true,
        cell: ({ row }) => (
          <span className="text-xs text-muted-foreground">
            {row.original.lastLoginAt
              ? new Date(row.original.lastLoginAt).toLocaleDateString()
              : 'Never'}
          </span>
        ),
      },
      {
        accessorKey: 'createdAt',
        header: 'Joined',
        enableSorting: true,
        cell: ({ row }) => (
          <span className="text-xs text-muted-foreground">
            {new Date(row.original.createdAt).toLocaleDateString()}
          </span>
        ),
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => {
          const org = row.original;
          return (
            <div className="flex items-center justify-end gap-1.5">
              <Button
                size="sm"
                variant="outline"
                className="h-7 px-2 text-xs"
                onClick={() => onView(org)}
              >
                View
              </Button>
              {!org.isApproved && (
                <Button
                  size="sm"
                  className="h-7 bg-brand-emerald px-2 text-xs text-white hover:bg-brand-emerald/90"
                  onClick={() => onRequestApprove(org)}
                >
                  Approve
                </Button>
              )}
              {org.isActive ? (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 border-amber-300 px-2 text-xs text-amber-700 hover:bg-amber-50"
                  onClick={() => onRequestSuspend(org)}
                >
                  Suspend
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 border-emerald-300 px-2 text-xs text-emerald-700 hover:bg-emerald-50"
                  onClick={() => onRequestActivate(org)}
                >
                  Activate
                </Button>
              )}
            </div>
          );
        },
      },
    ],
    [onView, onRequestSuspend, onRequestApprove, onRequestActivate],
  );
}
