'use client';

import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table';
import { Button } from '@ui/button';
import { format, formatDistanceToNow } from 'date-fns';
import { useMemo } from 'react';

import type { IOrgApplicationListItem } from '@app-types/org/org.applications';

import { ApplicationStatusBadge } from './application-status-badge';
import { OrgApplicationsTableSkeleton } from './org-applications-table-skeleton';
import {
  OrgApplicationsTableEmpty,
  OrgApplicationsTableError,
} from './org-applications-table-states';

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

interface OrgApplicationsTableProps {
  applications: IOrgApplicationListItem[];
  isLoading: boolean;
  isError: boolean;
  hasFilters: boolean;
  limit: number;
  onRetry: () => void;
  onView: (id: string) => void;
}

export function OrgApplicationsTable({
  applications,
  isLoading,
  isError,
  hasFilters,
  limit,
  onRetry,
  onView,
}: OrgApplicationsTableProps): React.JSX.Element {
  const columns = useMemo<ColumnDef<IOrgApplicationListItem>[]>(
    () => [
      {
        id: 'candidate',
        header: 'Candidate',
        cell: ({ row }) => {
          const a = row.original;
          return (
            <div className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-full bg-brand-sky/15 text-xs font-bold text-brand-sky">
                {getInitials(a.candidateName)}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{a.candidateName}</p>
                {a.candidateHeadline && (
                  <p className="text-[11px] text-muted-foreground">{a.candidateHeadline}</p>
                )}
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: 'jobTitle',
        header: 'Job',
        cell: ({ getValue }) => (
          <span className="text-xs text-foreground">{getValue<string>()}</span>
        ),
      },
      {
        accessorKey: 'appliedAt',
        header: 'Applied',
        cell: ({ getValue }) => (
          <span
            className="text-xs text-muted-foreground"
            title={format(new Date(getValue<string>()), 'PPP')}
          >
            {formatDistanceToNow(new Date(getValue<string>()), { addSuffix: true })}
          </span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ getValue }) => (
          <ApplicationStatusBadge status={getValue<IOrgApplicationListItem['status']>()} />
        ),
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <div className="flex items-center justify-end">
            <Button
              size="sm"
              variant="outline"
              className="h-7 px-2 text-xs"
              onClick={() => onView(row.original.id)}
            >
              View
            </Button>
          </div>
        ),
      },
    ],
    [onView],
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: applications,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  return (
    <div className="flex-1 overflow-auto rounded-xl border border-border bg-card">
      <table className="w-full text-left" aria-label="Applications table">
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
            <OrgApplicationsTableSkeleton rows={limit} />
          ) : isError ? (
            <tr>
              <td colSpan={columns.length}>
                <OrgApplicationsTableError onRetry={onRetry} />
              </td>
            </tr>
          ) : applications.length === 0 ? (
            <tr>
              <td colSpan={columns.length}>
                <OrgApplicationsTableEmpty hasFilters={hasFilters} />
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="cursor-pointer transition-colors hover:bg-muted/20"
                onClick={() => onView(row.original.id)}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-5 py-3"
                    onClick={(e) => cell.column.id === 'actions' && e.stopPropagation()}
                  >
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
