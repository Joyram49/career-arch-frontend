'use client';

import { motion, type Variants } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

import { cn } from '@lib/utils';
import { Button } from '@ui/button';
import { Input } from '@ui/input';
import { Skeleton } from '@ui/skeleton';

/* ── Types ── */
interface SavedJob {
  id: string;
  jobId: string;
  slug: string;
  title: string;
  company: string;
  companyInitials: string;
  companyColor: string;
  location: string;
  type: string;
  salary: string;
  plan: 'FREE' | 'BASIC' | 'PREMIUM';
  savedAt: string;
  closingDate?: string;
  isRemote: boolean;
}

const DEMO_SAVED: SavedJob[] = [
  {
    id: '1',
    jobId: 'j1',
    slug: 'senior-backend-engineer-stripe',
    title: 'Senior Backend Engineer',
    company: 'Stripe',
    companyInitials: 'S',
    companyColor: '#7c3aed',
    location: 'Global Remote',
    type: 'Full-time',
    salary: '$140k–$180k',
    plan: 'BASIC',
    savedAt: '2 days ago',
    isRemote: true,
  },
  {
    id: '2',
    jobId: 'j2',
    slug: 'staff-product-engineer-notion',
    title: 'Staff Product Engineer',
    company: 'Notion',
    companyInitials: 'N',
    companyColor: '#18181b',
    location: 'San Francisco, CA',
    type: 'Hybrid',
    salary: '$160k–$210k',
    plan: 'PREMIUM',
    savedAt: '3 days ago',
    closingDate: 'Jun 30',
    isRemote: false,
  },
  {
    id: '3',
    jobId: 'j3',
    slug: 'engineering-manager-linear',
    title: 'Engineering Manager',
    company: 'Linear',
    companyInitials: 'L',
    companyColor: '#4f46e5',
    location: 'Remote',
    type: 'Full-time',
    salary: '$170k–$220k',
    plan: 'PREMIUM',
    savedAt: '5 days ago',
    isRemote: true,
  },
  {
    id: '4',
    jobId: 'j4',
    slug: 'design-systems-lead-figma',
    title: 'Design Systems Lead',
    company: 'Figma',
    companyInitials: 'F',
    companyColor: '#f24e1e',
    location: 'New York, NY',
    type: 'Full-time',
    salary: '$135k–$175k',
    plan: 'BASIC',
    savedAt: '1 week ago',
    isRemote: false,
  },
  {
    id: '5',
    jobId: 'j5',
    slug: 'growth-director-spotify',
    title: 'Growth Strategy Director',
    company: 'Spotify',
    companyInitials: 'S',
    companyColor: '#16a34a',
    location: 'New York, NY',
    type: 'Full-time',
    salary: '$145k–$195k',
    plan: 'FREE',
    savedAt: '1 week ago',
    closingDate: 'Jul 15',
    isRemote: false,
  },
  {
    id: '6',
    jobId: 'j6',
    slug: 'platform-lead-vercel',
    title: 'Platform Lead',
    company: 'Vercel',
    companyInitials: 'V',
    companyColor: '#000000',
    location: 'Remote',
    type: 'Full-time',
    salary: '$180k–$230k',
    plan: 'PREMIUM',
    savedAt: '2 weeks ago',
    isRemote: true,
  },
];

const PLAN_STYLES = {
  FREE: 'badge-plan-free',
  BASIC: 'badge-plan-basic',
  PREMIUM: 'badge-plan-premium',
} as const;

const SORT_OPTIONS = [
  { value: 'recent', label: 'Recently Saved' },
  { value: 'salary', label: 'Salary' },
  { value: 'deadline', label: 'Deadline' },
] as const;

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export function SavedJobsClient(): React.JSX.Element {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'recent' | 'salary' | 'deadline'>('recent');
  const [saved, setSaved] = useState<SavedJob[]>(DEMO_SAVED);
  const isLoading = false;

  const filtered = saved.filter(
    (j) =>
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company.toLowerCase().includes(search.toLowerCase()),
  );

  const handleUnsave = (id: string, title: string): void => {
    setSaved((prev) => prev.filter((j) => j.id !== id));
    toast.success(`Removed "${title}" from saved jobs`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const }}
      className="flex flex-col gap-5"
    >
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-bold text-foreground">{saved.length} saved jobs</span>
          {saved.length > 0 && (
            <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
              {saved.filter((j) => j.isRemote).length} remote
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <Input
            type="search"
            placeholder="Search saved jobs…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-full rounded-xl text-[13px] sm:w-52"
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className="h-9 rounded-xl border border-border bg-card px-3 text-[12px] font-semibold text-foreground outline-none focus:ring-2 focus:ring-ring"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-52 rounded-2xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-muted">
            <svg viewBox="0 0 32 32" fill="none" className="size-8 text-muted-foreground">
              <path
                d="M6 4h20a2 2 0 012 2v22l-12-6L4 28V6a2 2 0 012-2z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <p className="text-[15px] font-bold text-foreground">No saved jobs</p>
          <p className="mt-1 text-[13px] text-muted-foreground">
            {search !== '' ? 'Try a different search term' : 'Browse jobs and save ones you like'}
          </p>
          <Link href={{ pathname: '/jobs' }} className="mt-4">
            <Button className="rounded-xl bg-brand-navy font-bold text-white hover:bg-brand-navy/90">
              Explore Jobs
            </Button>
          </Link>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((job) => (
            <motion.article key={job.id} variants={cardVariants} className="saved-job-card group">
              {/* Header */}
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="flex size-10 shrink-0 items-center justify-center rounded-xl text-sm font-black text-white"
                    style={{ background: job.companyColor }}
                  >
                    {job.companyInitials}
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold text-muted-foreground">{job.company}</p>
                    <p className="text-[11px] text-muted-foreground/70">{job.location}</p>
                  </div>
                </div>

                {/* Unsave heart */}
                <button
                  type="button"
                  onClick={() => handleUnsave(job.id, job.title)}
                  className="rounded-lg p-1.5 text-brand-red opacity-70 transition-opacity hover:opacity-100"
                  aria-label={`Remove ${job.title} from saved jobs`}
                >
                  <svg viewBox="0 0 18 18" fill="currentColor" className="size-4">
                    <path d="M9 15.5S2 11 2 6a4 4 0 018 0 4 4 0 018 0c0 5-7 9.5-7 9.5z" />
                  </svg>
                </button>
              </div>

              {/* Title */}
              <h3 className="mb-3 text-[14px] leading-snug font-black tracking-tight text-foreground transition-colors group-hover:text-brand-sky">
                {job.title}
              </h3>

              {/* Tags */}
              <div className="mb-3 flex flex-wrap gap-1.5">
                <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                  {job.type}
                </span>
                {job.isRemote && (
                  <span className="rounded-full bg-brand-sky/8 px-2 py-0.5 text-[10px] font-semibold text-brand-sky">
                    Remote
                  </span>
                )}
                <span
                  className={cn(
                    'rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase',
                    PLAN_STYLES[job.plan],
                  )}
                >
                  {job.plan}
                </span>
              </div>

              {/* Salary + deadline */}
              <div className="mb-4 flex items-center justify-between">
                <span className="text-[13px] font-black text-brand-emerald">{job.salary}</span>
                {job.closingDate !== undefined && (
                  <span className="text-[10px] font-semibold text-brand-amber">
                    Closes {job.closingDate}
                  </span>
                )}
              </div>

              {/* Meta + CTA */}
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground">Saved {job.savedAt}</span>
                <Link href={{ pathname: `/jobs/${job.slug}` }}>
                  <Button
                    size="sm"
                    className="h-7 rounded-lg bg-brand-navy px-3 text-[11px] font-bold text-white hover:bg-brand-navy/90"
                  >
                    Apply Now
                  </Button>
                </Link>
              </div>
            </motion.article>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
