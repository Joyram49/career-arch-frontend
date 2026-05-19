'use client';

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table';
import { motion, type Variants } from 'framer-motion';
import { useState } from 'react';

import { Button } from '@ui/button';
import { Input } from '@ui/input';
import { Skeleton } from '@ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@ui/table';

import { cn } from '@lib/utils';
import { useApplications, useWithdrawApplication } from '@queries/use-applications';
import { ApplicationDrawer } from './application-drawer';

/* ── Types ── */
export interface Application {
  id: string;
  jobTitle: string;
  companyName: string;
  companyInitials: string;
  companyColor: string;
  appliedAt: string;
  updatedAt: string;
  status: ApplicationStatus;
  salary: string;
  location: string;
  coverLetter?: string;
  resumeUrl?: string;
  jobSlug: string;
}

export type ApplicationStatus =
  | 'APPLIED'
  | 'UNDER_REVIEW'
  | 'SHORTLISTED'
  | 'INTERVIEW'
  | 'OFFERED'
  | 'HIRED'
  | 'REJECTED'
  | 'WITHDRAWN';

const STATUS_FILTER_TABS: { key: ApplicationStatus | 'ALL'; label: string }[] = [
  { key: 'ALL', label: 'All' },
  { key: 'APPLIED', label: 'Pending' },
  { key: 'UNDER_REVIEW', label: 'Under Review' },
  { key: 'SHORTLISTED', label: 'Shortlisted' },
  { key: 'INTERVIEW', label: 'Interview' },
  { key: 'OFFERED', label: 'Offered' },
  { key: 'REJECTED', label: 'Rejected' },
];

const STATUS_META: Record<ApplicationStatus, { label: string; cls: string }> = {
  APPLIED: { label: 'Applied', cls: 'badge-status-applied' },
  UNDER_REVIEW: { label: 'Under Review', cls: 'badge-status-review' },
  SHORTLISTED: { label: 'Shortlisted', cls: 'badge-status-shortlisted' },
  INTERVIEW: { label: 'Interview', cls: 'badge-status-interview' },
  OFFERED: { label: 'Offered', cls: 'badge-status-offered' },
  HIRED: { label: 'Hired', cls: 'badge-status-hired' },
  REJECTED: { label: 'Rejected', cls: 'badge-status-rejected' },
  WITHDRAWN: { label: 'Withdrawn', cls: 'badge-status-withdrawn' },
};

/* ── Demo data ── */
const DEMO_APPLICATIONS: Application[] = [
  {
    id: '1',
    jobTitle: 'Senior Backend Engineer',
    companyName: 'Stripe',
    companyInitials: 'S',
    companyColor: '#7c3aed',
    appliedAt: 'May 10, 2025',
    updatedAt: 'May 12, 2025',
    status: 'UNDER_REVIEW',
    salary: '$140k–$180k',
    location: 'Remote',
    jobSlug: 'senior-backend-engineer-stripe',
  },
  {
    id: '2',
    jobTitle: 'Staff Product Engineer',
    companyName: 'Notion',
    companyInitials: 'N',
    companyColor: '#18181b',
    appliedAt: 'May 8, 2025',
    updatedAt: 'May 11, 2025',
    status: 'SHORTLISTED',
    salary: '$160k–$210k',
    location: 'San Francisco, CA',
    jobSlug: 'staff-product-engineer-notion',
  },
  {
    id: '3',
    jobTitle: 'Engineering Manager',
    companyName: 'Linear',
    companyInitials: 'L',
    companyColor: '#4f46e5',
    appliedAt: 'May 5, 2025',
    updatedAt: 'May 9, 2025',
    status: 'INTERVIEW',
    salary: '$170k–$220k',
    location: 'Remote',
    jobSlug: 'engineering-manager-linear',
  },
  {
    id: '4',
    jobTitle: 'Growth Strategy Director',
    companyName: 'Spotify',
    companyInitials: 'S',
    companyColor: '#16a34a',
    appliedAt: 'Apr 28, 2025',
    updatedAt: 'May 6, 2025',
    status: 'OFFERED',
    salary: '$145k–$195k',
    location: 'New York, NY',
    jobSlug: 'growth-strategy-director-spotify',
  },
  {
    id: '5',
    jobTitle: 'Product Manager',
    companyName: 'Figma',
    companyInitials: 'F',
    companyColor: '#f24e1e',
    appliedAt: 'Apr 20, 2025',
    updatedAt: 'Apr 30, 2025',
    status: 'REJECTED',
    salary: '$130k–$170k',
    location: 'Remote',
    jobSlug: 'product-manager-figma',
  },
  {
    id: '6',
    jobTitle: 'Lead Systems Architect',
    companyName: 'Vercel',
    companyInitials: 'V',
    companyColor: '#000000',
    appliedAt: 'Apr 15, 2025',
    updatedAt: 'Apr 15, 2025',
    status: 'APPLIED',
    salary: '$180k–$230k',
    location: 'Remote',
    jobSlug: 'lead-systems-architect-vercel',
  },
];

/* ── Column helper ── */
const ch = createColumnHelper<Application>();

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export function ApplicationsClient(): React.JSX.Element {
  const [activeFilter, setActiveFilter] = useState<ApplicationStatus | 'ALL'>('ALL');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Application | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { data, isLoading } = useApplications();
  const withdraw = useWithdrawApplication();

  const allApps: Application[] =
    (data?.applications as Application[] | undefined) ?? DEMO_APPLICATIONS;

  const filtered = allApps.filter((a) => {
    const matchesFilter = activeFilter === 'ALL' || a.status === activeFilter;
    const matchesSearch =
      search === '' ||
      a.jobTitle.toLowerCase().includes(search.toLowerCase()) ||
      a.companyName.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleRowClick = (app: Application): void => {
    setSelected(app);
    setDrawerOpen(true);
  };

  const columns: ColumnDef<Application, ApplicationStatus>[] = [
    ch.accessor('jobTitle', {
      header: 'Position',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-lg text-xs font-black text-white"
            style={{ background: row.original.companyColor }}
          >
            {row.original.companyInitials}
          </div>
          <div>
            <p className="text-[13px] font-bold text-foreground">{row.original.jobTitle}</p>
            <p className="text-[11px] text-muted-foreground">{row.original.companyName}</p>
          </div>
        </div>
      ),
    }),
    ch.accessor('appliedAt', {
      header: 'Applied',
      cell: ({ getValue }) => (
        <span className="text-[12px] text-muted-foreground">{getValue()}</span>
      ),
    }),
    ch.accessor('status', {
      header: 'Status',
      cell: ({ getValue }) => {
        const meta = STATUS_META[getValue() as ApplicationStatus];
        return (
          <span className={cn('rounded-full px-2.5 py-1 text-[11px] font-bold', meta.cls)}>
            {meta.label}
          </span>
        );
      },
    }),
    ch.accessor('updatedAt', {
      header: 'Last Updated',
      cell: ({ getValue }) => (
        <span className="text-[12px] text-muted-foreground">{getValue()}</span>
      ),
    }),
    ch.accessor('id', {
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <Button
            size="sm"
            variant="outline"
            className="h-7 rounded-lg px-3 text-[11px] font-bold"
            onClick={() => handleRowClick(row.original)}
          >
            View
          </Button>
          {(row.original.status === 'APPLIED' || row.original.status === 'UNDER_REVIEW') && (
            <Button
              size="sm"
              variant="ghost"
              className="h-7 rounded-lg px-3 text-[11px] font-bold text-brand-red hover:bg-brand-red/10 hover:text-brand-red"
              onClick={() => withdraw.mutate(row.original.id)}
            >
              Withdraw
            </Button>
          )}
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: filtered,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const }}
      className="flex flex-col gap-5"
    >
      {/* Filter tabs + search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {STATUS_FILTER_TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveFilter(tab.key)}
              className={cn(
                'rounded-full px-3 py-1.5 text-[12px] font-semibold transition-all',
                activeFilter === tab.key
                  ? 'bg-brand-navy text-white'
                  : 'bg-muted text-muted-foreground hover:bg-muted/70 hover:text-foreground',
              )}
            >
              {tab.label}
              <span className="ml-1.5 text-[11px] opacity-70">
                {tab.key === 'ALL'
                  ? allApps.length
                  : allApps.filter((a) => a.status === tab.key).length}
              </span>
            </button>
          ))}
        </div>
        <Input
          type="search"
          placeholder="Search position or company…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-9 w-full rounded-xl text-[13px] sm:w-56"
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id} className="border-border bg-muted/40 hover:bg-muted/40">
                {hg.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={5}>
                    <Skeleton className="h-12 w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-16 text-center">
                  <p className="text-sm font-medium text-muted-foreground">No applications found</p>
                  <p className="mt-1 text-[12px] text-muted-foreground/70">
                    Try adjusting your filters
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="app-table-row cursor-pointer border-border"
                  onClick={() => handleRowClick(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Summary */}
      {!isLoading && (
        <p className="text-[12px] text-muted-foreground">
          Showing {filtered.length} of {allApps.length} applications
        </p>
      )}

      {/* Detail Drawer */}
      <ApplicationDrawer
        application={selected}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </motion.div>
  );
}
