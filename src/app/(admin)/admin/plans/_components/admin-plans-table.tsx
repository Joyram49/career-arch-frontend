'use client';

import { type IAdminPlanListItem } from '@app-types/admin/admin.dashboard.plans';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { Button } from '@ui/button';

import { useAdminPlansColumns } from './use-admin-plans-columns';

interface AdminPlansTableProps {
  plans: IAdminPlanListItem[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  onEdit: (plan: IAdminPlanListItem) => void;
  onRequestToggle: (plan: IAdminPlanListItem) => void;
  onRequestDelete: (plan: IAdminPlanListItem) => void;
}

export function AdminPlansTable({
  plans,
  isLoading,
  isError,
  onRetry,
  onEdit,
  onRequestToggle,
  onRequestDelete,
}: AdminPlansTableProps): React.JSX.Element {
  const columns = useAdminPlansColumns({ onEdit, onRequestToggle, onRequestDelete });

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: plans,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex-1 overflow-auto">
      <table className="w-full text-left" aria-label="Plans table">
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
            <tr>
              <td colSpan={columns.length} className="px-5 py-10 text-center">
                <div className="mx-auto flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <i className="ti ti-loader-2 animate-spin" aria-hidden="true" />
                  Loading plans…
                </div>
              </td>
            </tr>
          ) : isError ? (
            <tr>
              <td colSpan={columns.length}>
                <div className="flex min-h-60 flex-col items-center justify-center px-5 text-center">
                  <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-destructive/10">
                    <i className="ti ti-alert-circle text-xl text-destructive" aria-hidden="true" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground">Failed to load plans</h3>
                  <p className="mt-1 max-w-sm text-xs text-muted-foreground">
                    Something went wrong while retrieving the plan catalogue. Please try again.
                  </p>
                  <Button variant="outline" size="sm" className="mt-4" onClick={onRetry}>
                    <i className="ti ti-refresh mr-1.5" aria-hidden="true" />
                    Try again
                  </Button>
                </div>
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="transition-colors hover:bg-muted/20">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-5 py-4">
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
