'use client';

import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table';
import { Button } from '@ui/button';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { useMemo } from 'react';

import type { IOrgJobPerformanceItem } from '@app-types/org/org.dashboard';

import { PlanBadge, StatusBadge } from '../../_components/shared';
import { JobsPerformanceEmpty } from './org-jobs-performance-empty';
import { JobsPerformanceError } from './org-jobs-performance-error';
import { JobsPerformanceSkeleton } from './org-jobs-performance-skeleton';

interface OrgJobsPerformanceTableProps {
  jobs: IOrgJobPerformanceItem[];
  isLoading: boolean;
  isError: boolean;
  limit: number;
  onRetry: () => void;
}

export function OrgJobsPerformanceTable({
  jobs,
  isLoading,
  isError,
  limit,
  onRetry,
}: OrgJobsPerformanceTableProps): React.JSX.Element {
  const columns = useMemo<ColumnDef<IOrgJobPerformanceItem>[]>(
    () => [
      {
        id: 'title',
        header: 'Job Title',
        cell: ({ row }) => {
          const job = row.original;
          return (
            <div>
              <Link
                href={`/org/jobs/${job.id}`}
                className="text-sm font-semibold text-foreground hover:text-brand-sky hover:underline"
              >
                {job.title}
              </Link>
              <div className="mt-0.5">
                <PlanBadge plan={job.requiredPlan.toLowerCase() as 'free' | 'basic' | 'premium'} />
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ getValue }) => (
          <StatusBadge
            status={
              getValue<IOrgJobPerformanceItem['status']>().toLowerCase() as
                | 'published'
                | 'draft'
                | 'closed'
                | 'archived'
            }
          />
        ),
      },
      {
        accessorKey: 'applicationsCount',
        header: 'Applications',
        cell: ({ getValue }) => (
          <span className="text-sm font-semibold text-foreground">{getValue<number>()}</span>
        ),
      },
      {
        accessorKey: 'views',
        header: 'Views',
        cell: ({ getValue }) => (
          <span className="text-sm text-muted-foreground">
            {getValue<number>().toLocaleString()}
          </span>
        ),
      },
      {
        id: 'daysActiveOrDeadline',
        header: 'Status Detail',
        cell: ({ row }) => {
          const job = row.original;
          if (job.status === 'DRAFT') {
            return <span className="text-xs text-muted-foreground">Not published</span>;
          }
          if (job.deadline) {
            const isPast = new Date(job.deadline) < new Date();
            return (
              <span className={`text-xs ${isPast ? 'text-brand-red' : 'text-muted-foreground'}`}>
                {isPast ? 'Closed ' : 'Closes '}
                {formatDistanceToNow(new Date(job.deadline), { addSuffix: true })}
              </span>
            );
          }
          return (
            <span className="text-xs text-muted-foreground">{job.daysActive} days active</span>
          );
        },
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => {
          const job = row.original;
          return (
            <div className="flex items-center justify-end gap-1.5">
              <Button asChild size="sm" variant="outline" className="h-7 px-2 text-xs">
                <Link href={`/org/applications?jobId=${job.id}`}>Applications</Link>
              </Button>
              <Button asChild size="sm" variant="outline" className="h-7 px-2 text-xs">
                <Link href={`/org/jobs/${job.id}/edit`}>Edit</Link>
              </Button>
            </div>
          );
        },
      },
    ],
    [],
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: jobs,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  return (
    <div className="overflow-auto rounded-xl border border-border bg-card">
      <table className="w-full text-left" aria-label="Job listings performance table">
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
            <JobsPerformanceSkeleton rows={limit} />
          ) : isError ? (
            <tr>
              <td colSpan={columns.length}>
                <JobsPerformanceError onRetry={onRetry} />
              </td>
            </tr>
          ) : jobs.length === 0 ? (
            <tr>
              <td colSpan={columns.length}>
                <JobsPerformanceEmpty />
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
