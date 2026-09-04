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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@ui/dialog';
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
type OrgStatus = 'pending' | 'approved' | 'suspended' | 'archived';

interface AdminOrg {
  id: string;
  name: string;
  email: string;
  industry: string;
  size: string;
  status: OrgStatus;
  jobsPosted: number;
  totalHires: number;
  incentivesDue: number;
  joined: string;
}

/* ── Mock data ─────────────────────────────────────────────── */
const MOCK_ORGS: AdminOrg[] = [
  {
    id: '1',
    name: 'TechCorp Inc.',
    email: 'hr@techcorp.com',
    industry: 'Technology',
    size: '51-200',
    status: 'pending',
    jobsPosted: 0,
    totalHires: 0,
    incentivesDue: 0,
    joined: '14 May 2025',
  },
  {
    id: '2',
    name: 'Nexus Solutions',
    email: 'jobs@nexus.io',
    industry: 'Finance',
    size: '11-50',
    status: 'pending',
    jobsPosted: 0,
    totalHires: 0,
    incentivesDue: 0,
    joined: '15 May 2025',
  },
  {
    id: '3',
    name: 'DataLabs',
    email: 'team@datalabs.com',
    industry: 'Technology',
    size: '201-1000',
    status: 'approved',
    jobsPosted: 24,
    totalHires: 8,
    incentivesDue: 0,
    joined: '3 Jan 2025',
  },
  {
    id: '4',
    name: 'HealthFirst',
    email: 'hr@healthfirst.org',
    industry: 'Healthcare',
    size: '1000+',
    status: 'approved',
    jobsPosted: 18,
    totalHires: 5,
    incentivesDue: 100,
    joined: '22 Feb 2025',
  },
  {
    id: '5',
    name: 'SpamCo',
    email: 'spam@spamco.net',
    industry: 'Other',
    size: '1-10',
    status: 'archived',
    jobsPosted: 3,
    totalHires: 0,
    incentivesDue: 0,
    joined: '1 Mar 2025',
  },
  {
    id: '6',
    name: 'FakeJobs Ltd.',
    email: 'fake@fakejobs.com',
    industry: 'Other',
    size: '1-10',
    status: 'suspended',
    jobsPosted: 12,
    totalHires: 1,
    incentivesDue: 50,
    joined: '10 Apr 2025',
  },
  {
    id: '7',
    name: 'BuildRight Corp',
    email: 'talent@buildright.com',
    industry: 'Construction',
    size: '51-200',
    status: 'approved',
    jobsPosted: 9,
    totalHires: 3,
    incentivesDue: 0,
    joined: '15 Mar 2025',
  },
];

const TAB_STATUSES: Array<{ value: string; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'suspended', label: 'Suspended' },
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

export default function AdminOrgsPage(): React.JSX.Element {
  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');
  const [industryFilter, setIndustry] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedOrg, setSelectedOrg] = useState<AdminOrg | null>(null);
  const [archiveTarget, setArchiveTarget] = useState<AdminOrg | null>(null);
  const [suspendTarget, setSuspendTarget] = useState<AdminOrg | null>(null);
  const [rejectTarget, setRejectTarget] = useState<AdminOrg | null>(null);

  const filtered = useMemo(() => {
    return MOCK_ORGS.filter((o) => {
      const matchTab = tab === 'all' || o.status === tab;
      const matchSearch =
        !search ||
        o.name.toLowerCase().includes(search.toLowerCase()) ||
        o.email.toLowerCase().includes(search.toLowerCase());
      const matchIndustry = !industryFilter || o.industry === industryFilter;
      return matchTab && matchSearch && matchIndustry;
    });
  }, [tab, search, industryFilter]);

  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = { all: MOCK_ORGS.length };
    MOCK_ORGS.forEach((o) => {
      counts[o.status] = (counts[o.status] ?? 0) + 1;
    });
    return counts;
  }, []);

  const columns = useMemo<ColumnDef<AdminOrg>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Organization',
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-lg bg-brand-navy/10 text-[10px] font-bold text-brand-navy">
              {row.original.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{row.original.name}</p>
              <p className="text-[11px] text-muted-foreground">{row.original.email}</p>
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'industry',
        header: 'Industry',
        cell: ({ getValue }) => (
          <span className="text-xs text-muted-foreground">{getValue<string>()}</span>
        ),
      },
      {
        accessorKey: 'size',
        header: 'Size',
        cell: ({ getValue }) => (
          <span className="text-xs text-muted-foreground">{getValue<string>()}</span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ getValue }) => <StatusBadge status={getValue<OrgStatus>()} />,
      },
      {
        accessorKey: 'jobsPosted',
        header: 'Jobs',
        cell: ({ getValue }) => (
          <span className="text-sm font-semibold text-foreground">{getValue<number>()}</span>
        ),
      },
      {
        accessorKey: 'totalHires',
        header: 'Hires',
        cell: ({ getValue }) => (
          <span className="text-sm font-semibold text-foreground">{getValue<number>()}</span>
        ),
      },
      {
        accessorKey: 'incentivesDue',
        header: 'Incentives Due',
        cell: ({ getValue }) => {
          const v = getValue<number>();
          return (
            <span
              className={cn(
                'text-sm font-semibold',
                v > 0 ? 'text-brand-red' : 'text-muted-foreground',
              )}
            >
              {v > 0 ? `$${v}` : '—'}
            </span>
          );
        },
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => {
          const o = row.original;
          return (
            <div className="flex items-center justify-end gap-1.5">
              <Button
                size="sm"
                variant="outline"
                className="h-7 px-2 text-xs"
                onClick={() => setSelectedOrg(o)}
              >
                View
              </Button>
              {o.status === 'pending' && (
                <>
                  <Button
                    size="sm"
                    className="h-7 bg-brand-emerald px-2 text-xs text-white hover:bg-brand-emerald/90"
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 border-red-300 px-2 text-xs text-red-600 hover:bg-red-50"
                    onClick={() => setRejectTarget(o)}
                  >
                    Reject
                  </Button>
                </>
              )}
              {o.status === 'approved' && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 border-amber-300 px-2 text-xs text-amber-700 hover:bg-amber-50"
                  onClick={() => setSuspendTarget(o)}
                >
                  Suspend
                </Button>
              )}
              {o.status === 'suspended' && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 border-emerald-300 px-2 text-xs text-emerald-700 hover:bg-emerald-50"
                >
                  Activate
                </Button>
              )}
              {o.status !== 'archived' && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 border-slate-300 px-2 text-xs text-slate-500 hover:bg-slate-50"
                  onClick={() => setArchiveTarget(o)}
                >
                  Archive
                </Button>
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
        title="Organizations"
        description="Approve, suspend, or archive employer accounts. Archived orgs auto-delete after 30 days."
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
                {tabCounts[t.value] !== undefined && (
                  <span className="ml-1.5 rounded-full bg-muted px-1.5 py-0.5 text-[9px] font-bold text-muted-foreground">
                    {tabCounts[t.value]}
                  </span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <SearchFilterBar
        searchPlaceholder="Search by name or email…"
        searchValue={search}
        onSearchChange={setSearch}
      >
        <FilterSelect
          value={industryFilter}
          onChange={setIndustry}
          placeholder="All Industries"
          options={[
            { label: 'Technology', value: 'Technology' },
            { label: 'Finance', value: 'Finance' },
            { label: 'Healthcare', value: 'Healthcare' },
            { label: 'Construction', value: 'Construction' },
            { label: 'Other', value: 'Other' },
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
          <table className="w-full text-left" aria-label="Organizations table">
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
                    No organizations found
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
        <AdminPagination
          page={table.getState().pagination.pageIndex + 1}
          totalPages={table.getPageCount()}
          onPageChange={(p) => table.setPageIndex(p - 1)}
          total={filtered.length}
          perPage={8}
        />
      </motion.div>

      {/* Detail modal */}
      <Dialog open={selectedOrg !== null} onOpenChange={() => setSelectedOrg(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">{selectedOrg?.name}</DialogTitle>
          </DialogHeader>
          {selectedOrg && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Email</span>
                  <p className="font-medium text-foreground">{selectedOrg.email}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Industry</span>
                  <p className="font-medium text-foreground">{selectedOrg.industry}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Size</span>
                  <p className="font-medium text-foreground">{selectedOrg.size}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Status</span>
                  <p className="mt-0.5">
                    <StatusBadge status={selectedOrg.status} />
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Jobs Posted</span>
                  <p className="font-medium text-foreground">{selectedOrg.jobsPosted}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Total Hires</span>
                  <p className="font-medium text-foreground">{selectedOrg.totalHires}</p>
                </div>
                {selectedOrg.incentivesDue > 0 && (
                  <div className="col-span-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                    <strong>Incentives overdue:</strong> ${selectedOrg.incentivesDue} unpaid
                  </div>
                )}
              </div>
              <div className="flex gap-2 border-t border-border pt-3">
                {selectedOrg.status === 'pending' && (
                  <Button
                    size="sm"
                    className="bg-brand-emerald text-white hover:bg-brand-emerald/90"
                  >
                    Approve
                  </Button>
                )}
                {selectedOrg.status !== 'archived' && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-300 text-slate-600 hover:bg-slate-50"
                    onClick={() => {
                      setArchiveTarget(selectedOrg);
                      setSelectedOrg(null);
                    }}
                  >
                    Archive
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <ArchiveConfirmDialog
        open={suspendTarget !== null}
        onOpenChange={() => setSuspendTarget(null)}
        title={`Suspend ${suspendTarget?.name}?`}
        description="This organization will lose the ability to post jobs immediately."
        confirmLabel="Suspend Org"
        variant="suspend"
        onConfirm={() => setSuspendTarget(null)}
      />
      <ArchiveConfirmDialog
        open={rejectTarget !== null}
        onOpenChange={() => setRejectTarget(null)}
        title={`Reject ${rejectTarget?.name}?`}
        description="This application will be rejected and the organization notified by email."
        confirmLabel="Reject"
        variant="danger"
        onConfirm={() => setRejectTarget(null)}
      />
      <ArchiveConfirmDialog
        open={archiveTarget !== null}
        onOpenChange={() => setArchiveTarget(null)}
        title={`Archive ${archiveTarget?.name}?`}
        description="The org account will be archived. All associated jobs will also be archived and auto-deleted after 30 days."
        confirmLabel="Archive Org"
        variant="archive"
        onConfirm={() => setArchiveTarget(null)}
      />
    </div>
  );
}
