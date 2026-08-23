'use client';

import { cn } from '@lib/utils';
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table';
import { Button } from '@ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '@ui/tabs';
import { motion, type Variants } from 'framer-motion';
import { useMemo, useState } from 'react';
import {
  AdminPageHeader,
  AdminPagination,
  ArchiveConfirmDialog,
  FilterSelect,
  SearchFilterBar,
  StatusBadge,
} from '../_components/shared';

/* ── Types ─────────────────────────────────────────────────── */
type JobStatus = 'published' | 'draft' | 'closed' | 'archived';
type RequiredPlan = 'free' | 'basic' | 'premium';

interface AdminJob {
  id: string;
  title: string;
  org: string;
  status: JobStatus;
  requiredPlan: RequiredPlan;
  applications: number;
  views: number;
  postedDate: string;
  closeDate?: string;
  flagged?: boolean;
}

const MOCK_JOBS: AdminJob[] = [
  {
    id: '1',
    title: 'Senior Backend Engineer',
    org: 'DataLabs',
    status: 'published',
    requiredPlan: 'basic',
    applications: 47,
    views: 1240,
    postedDate: '1 May 2025',
    closeDate: '1 Jun 2025',
  },
  {
    id: '2',
    title: 'Product Designer',
    org: 'HealthFirst',
    status: 'published',
    requiredPlan: 'premium',
    applications: 31,
    views: 890,
    postedDate: '5 May 2025',
  },
  {
    id: '3',
    title: 'Marketing Manager',
    org: 'BuildRight Corp',
    status: 'draft',
    requiredPlan: 'free',
    applications: 0,
    views: 0,
    postedDate: '10 May 2025',
  },
  {
    id: '4',
    title: 'Data Analyst',
    org: 'DataLabs',
    status: 'closed',
    requiredPlan: 'basic',
    applications: 62,
    views: 2100,
    postedDate: '10 Apr 2025',
    closeDate: '10 May 2025',
  },
  {
    id: '5',
    title: 'Work From Home Easy Money',
    org: 'FakeJobs Ltd.',
    status: 'published',
    requiredPlan: 'free',
    applications: 3,
    views: 45,
    postedDate: '12 May 2025',
    flagged: true,
  },
  {
    id: '6',
    title: 'Frontend Developer',
    org: 'TechCorp Inc.',
    status: 'archived',
    requiredPlan: 'free',
    applications: 18,
    views: 540,
    postedDate: '1 Mar 2025',
    closeDate: '1 Apr 2025',
  },
  {
    id: '7',
    title: 'DevOps Engineer',
    org: 'HealthFirst',
    status: 'published',
    requiredPlan: 'premium',
    applications: 22,
    views: 670,
    postedDate: '8 May 2025',
  },
];

const PLAN_STYLES: Record<RequiredPlan, string> = {
  free: 'bg-slate-100 text-slate-500 border border-slate-200',
  basic: 'bg-sky-50 text-sky-700 border border-sky-200',
  premium: 'bg-amber-50 text-amber-700 border border-amber-200',
};

const TAB_STATUSES = [
  { value: 'all', label: 'All' },
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Drafts' },
  { value: 'closed', label: 'Closed' },
  { value: 'archived', label: 'Archived' },
];

const pageVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

/* ── Takedown modal ──────────────────────────────────────────── */
function TakedownModal({
  job,
  onClose,
}: {
  job: AdminJob | null;
  onClose: () => void;
}): React.JSX.Element | null {
  const [reason, setReason] = useState('');
  if (!job) return null;
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">Archive Job Listing</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            &apos;{job.title}&apos; by {job.org} will be archived and removed from public search.
            The cron worker will hard-delete it after the retention period.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <label className="block text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            Reason for Takedown
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              'Policy violation',
              'Spam / Scam',
              'Duplicate listing',
              'Misleading content',
              'Org suspended',
              'Other',
            ].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setReason(r)}
                className={cn(
                  'rounded-lg border px-3 py-2 text-xs font-medium transition-all',
                  reason === r
                    ? 'border-brand-red bg-red-50 text-red-700'
                    : 'border-border bg-card text-muted-foreground hover:border-border hover:bg-muted',
                )}
              >
                {r}
              </button>
            ))}
          </div>
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
            <strong>Note:</strong> This is a soft archive — the job will be auto-deleted after 30
            days by the cleanup cron. No immediate hard delete.
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="bg-slate-700 text-white hover:bg-slate-800"
            disabled={!reason}
            onClick={onClose}
          >
            Archive Job
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ── Page ─────────────────────────────────────────────────── */
export default function AdminJobsPage(): React.JSX.Element {
  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');
  const [planFilter, setPlan] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [takedownTarget, setTakedown] = useState<AdminJob | null>(null);
  const [archiveTarget, setArchive] = useState<AdminJob | null>(null);

  const filtered = useMemo(() => {
    return MOCK_JOBS.filter((j) => {
      const matchTab = tab === 'all' || j.status === tab;
      const matchSearch =
        !search ||
        j.title.toLowerCase().includes(search.toLowerCase()) ||
        j.org.toLowerCase().includes(search.toLowerCase());
      const matchPlan = !planFilter || j.requiredPlan === planFilter;
      return matchTab && matchSearch && matchPlan;
    });
  }, [tab, search, planFilter]);

  const tabCounts = useMemo(() => {
    const c: Record<string, number> = { all: MOCK_JOBS.length };
    MOCK_JOBS.forEach((j) => {
      c[j.status] = (c[j.status] ?? 0) + 1;
    });
    return c;
  }, []);

  const flaggedCount = MOCK_JOBS.filter((j) => j.flagged).length;

  const columns = useMemo<ColumnDef<AdminJob>[]>(
    () => [
      {
        accessorKey: 'title',
        header: 'Job Title',
        cell: ({ row }) => (
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-foreground">{row.original.title}</p>
              {row.original.flagged && (
                <span className="rounded bg-red-100 px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-red-600 uppercase">
                  Flagged
                </span>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground">{row.original.org}</p>
          </div>
        ),
      },
      {
        accessorKey: 'requiredPlan',
        header: 'Plan',
        cell: ({ getValue }) => {
          const p = getValue<RequiredPlan>();
          return (
            <span
              className={cn(
                'rounded px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase',
                PLAN_STYLES[p],
              )}
            >
              {p}
            </span>
          );
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ getValue }) => <StatusBadge status={getValue<JobStatus>()} />,
      },
      {
        accessorKey: 'applications',
        header: 'Applications',
        cell: ({ getValue }) => (
          <span className="text-sm font-semibold text-foreground">{getValue<number>()}</span>
        ),
      },
      {
        accessorKey: 'views',
        header: 'Views',
        cell: ({ getValue }) => (
          <span className="text-xs text-muted-foreground">
            {getValue<number>().toLocaleString()}
          </span>
        ),
      },
      {
        accessorKey: 'postedDate',
        header: 'Posted',
        cell: ({ getValue }) => (
          <span className="text-xs text-muted-foreground">{getValue<string>()}</span>
        ),
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => {
          const j = row.original;
          return (
            <div className="flex items-center justify-end gap-1.5">
              {j.status !== 'archived' && (
                <>
                  {j.flagged && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 border-red-300 px-2 text-xs text-red-600 hover:bg-red-50"
                      onClick={() => setTakedown(j)}
                    >
                      Takedown
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 border-slate-300 px-2 text-xs text-slate-500 hover:bg-slate-50"
                    onClick={() => setArchive(j)}
                  >
                    Archive
                  </Button>
                </>
              )}
              {j.status === 'archived' && (
                <span className="text-[10px] text-muted-foreground italic">
                  Pending cron deletion
                </span>
              )}
            </div>
          );
        },
      },
    ],
    [],
  );

  const table = useReactTable({
    data: filtered,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 8 } },
  });

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <AdminPageHeader
        title="Jobs"
        description="Review and moderate job listings. Archived jobs are soft-deleted; the cron worker hard-deletes them after the retention period."
        actions={
          flaggedCount > 0 ? (
            <div className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5">
              <i className="ti ti-alert-triangle text-sm text-red-500" aria-hidden="true" />
              <span className="text-xs font-semibold text-red-600">{flaggedCount} flagged</span>
            </div>
          ) : undefined
        }
      />

      {/* Tabs */}
      <div className="border-b border-border bg-card px-6 pt-3">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="h-9 gap-1 bg-transparent p-0">
            {TAB_STATUSES.map((t) => (
              <TabsTrigger
                key={t.value}
                value={t.value}
                className="relative h-9 rounded-none border-b-2 border-transparent px-4 text-xs font-medium data-[state=active]:border-brand-sky data-[state=active]:text-brand-sky"
              >
                {t.label}
                <span className="ml-1.5 rounded-full bg-muted px-1.5 py-0.5 text-[9px] font-bold text-muted-foreground">
                  {tabCounts[t.value] ?? 0}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <SearchFilterBar
        searchPlaceholder="Search by title or org…"
        searchValue={search}
        onSearchChange={setSearch}
      >
        <FilterSelect
          value={planFilter}
          onChange={setPlan}
          placeholder="All Plans"
          options={[
            { label: 'Free', value: 'free' },
            { label: 'Basic', value: 'basic' },
            { label: 'Premium', value: 'premium' },
          ]}
        />
      </SearchFilterBar>

      <motion.div
        className="flex flex-1 flex-col overflow-hidden"
        variants={pageVariants}
        initial="hidden"
        animate="visible"
      >
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
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-5 py-12 text-center text-sm text-muted-foreground"
                  >
                    No jobs found
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className={cn(
                      'transition-colors hover:bg-muted/20',
                      row.original.flagged && 'bg-red-50/30',
                    )}
                  >
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
        <AdminPagination
          page={table.getState().pagination.pageIndex + 1}
          totalPages={table.getPageCount()}
          onPageChange={(p) => table.setPageIndex(p - 1)}
          total={filtered.length}
          perPage={8}
        />
      </motion.div>

      <TakedownModal job={takedownTarget} onClose={() => setTakedown(null)} />

      <ArchiveConfirmDialog
        open={archiveTarget !== null}
        onOpenChange={() => setArchive(null)}
        title={`Archive "${archiveTarget?.title}"?`}
        description="This job will be soft-archived and removed from public search. The cleanup cron will hard-delete it after 30 days."
        confirmLabel="Archive Job"
        variant="archive"
        onConfirm={() => setArchive(null)}
      />
    </div>
  );
}
