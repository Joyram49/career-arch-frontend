'use client';

import { AnimatePresence, motion, type Variants } from 'framer-motion';
import Link from 'next/link';

import { CloseIcon, DownloadIcon } from '@assets/icons/custom';
import { cn } from '@lib/utils';
import { Button } from '@ui/button';
import type { Application, ApplicationStatus } from './applications-client';

/* ── Status stepper config ── */
const STEPPER_STAGES: { key: ApplicationStatus; label: string }[] = [
  { key: 'APPLIED', label: 'Applied' },
  { key: 'UNDER_REVIEW', label: 'In Review' },
  { key: 'SHORTLISTED', label: 'Shortlisted' },
  { key: 'INTERVIEW', label: 'Interview' },
  { key: 'OFFERED', label: 'Decision' },
];

const STATUS_ORDER: ApplicationStatus[] = [
  'APPLIED',
  'UNDER_REVIEW',
  'SHORTLISTED',
  'INTERVIEW',
  'OFFERED',
  'HIRED',
];

interface Props {
  application: Application | null;
  open: boolean;
  onClose: () => void;
}

const drawerVariants: Variants = {
  hidden: { x: '100%', opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
  exit: {
    x: '100%',
    opacity: 0,
    transition: { duration: 0.25, ease: [0.55, 0.055, 0.675, 0.19] as const },
  },
};

export function ApplicationDrawer({ application, open, onClose }: Props): React.JSX.Element {
  if (application === null) return <></>;

  const currentIdx = STATUS_ORDER.indexOf(application.status);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="sidebar-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer panel */}
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={`Application details for ${application.jobTitle}`}
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="shadow-modal fixed top-0 right-0 z-(--z-modal) flex h-full w-full max-w-md flex-col overflow-y-auto bg-card"
          >
            {/* Header */}
            <div className="flex items-start gap-4 border-b border-border p-5">
              <div
                className="flex size-12 shrink-0 items-center justify-center rounded-xl text-sm font-black text-white"
                style={{ background: application.companyColor }}
              >
                {application.companyInitials}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-[15px] font-black text-foreground">{application.jobTitle}</h2>
                <p className="text-[12px] text-muted-foreground">{application.companyName}</p>
                <p className="mt-0.5 text-[12px] font-semibold text-brand-emerald">
                  {application.salary}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="Close drawer"
              >
                <CloseIcon className="size-5" />
              </button>
            </div>

            {/* Status stepper */}
            <div className="border-b border-border px-5 py-4">
              <p className="mb-3 text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
                Application Progress
              </p>
              <div className="status-stepper">
                {STEPPER_STAGES.map((stage, idx) => {
                  const stageIdx = STATUS_ORDER.indexOf(stage.key);
                  const isComplete = stageIdx < currentIdx;
                  const isActive =
                    stageIdx === currentIdx ||
                    (application.status === 'HIRED' && stage.key === 'OFFERED');

                  return (
                    <div key={stage.key} className="status-step">
                      {/* Connector line (not before first) */}
                      {idx > 0 && (
                        <div
                          className={cn('status-step-line', isComplete && 'complete')}
                          style={{ transform: 'translateX(-50%)' }}
                          aria-hidden="true"
                        />
                      )}
                      <div
                        className={cn(
                          'status-step-dot',
                          isActive && 'active',
                          isComplete && 'complete',
                        )}
                        aria-label={`${stage.label}${isComplete ? ' (complete)' : isActive ? ' (current)' : ''}`}
                      >
                        {isComplete ? (
                          <svg viewBox="0 0 10 10" fill="none" className="size-3">
                            <path
                              d="M2 5l2.5 2.5L8 3"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        ) : (
                          <span>{idx + 1}</span>
                        )}
                      </div>
                      <p className="mt-1.5 px-1 text-center text-[10px] leading-tight font-medium text-muted-foreground">
                        {stage.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Meta details */}
            <div className="border-b border-border px-5 py-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                    Applied
                  </p>
                  <p className="mt-0.5 text-[13px] font-semibold text-foreground">
                    {application.appliedAt}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                    Last Update
                  </p>
                  <p className="mt-0.5 text-[13px] font-semibold text-foreground">
                    {application.updatedAt}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                    Location
                  </p>
                  <p className="mt-0.5 text-[13px] font-semibold text-foreground">
                    {application.location}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                    Salary
                  </p>
                  <p className="mt-0.5 text-[13px] font-semibold text-brand-emerald">
                    {application.salary}
                  </p>
                </div>
              </div>
            </div>

            {/* Cover letter */}
            {application.coverLetter !== undefined && (
              <div className="border-b border-border px-5 py-4">
                <p className="mb-2 text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                  Cover Letter
                </p>
                <p className="text-[13px] leading-relaxed text-foreground">
                  {application.coverLetter}
                </p>
              </div>
            )}

            {/* Resume */}
            <div className="border-b border-border px-5 py-4">
              <p className="mb-2 text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                Resume Used
              </p>
              <div className="flex items-center justify-between rounded-lg border border-border bg-muted p-3">
                <span className="text-[12px] font-medium text-foreground">resume_2025.pdf</span>
                {application.resumeUrl !== undefined ? (
                  <a
                    href={application.resumeUrl}
                    download
                    className="rounded p-1 text-muted-foreground hover:text-foreground"
                    aria-label="Download resume"
                  >
                    <DownloadIcon className="size-4" />
                  </a>
                ) : (
                  <DownloadIcon className="size-4 text-muted-foreground/40" />
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-auto border-t border-border p-5">
              <div className="flex flex-col gap-2.5">
                <Link
                  href={{ pathname: `/jobs/${application.jobSlug}` }}
                  target="_blank"
                  rel="noopener"
                >
                  <Button variant="outline" className="w-full rounded-xl font-semibold">
                    View Job Posting
                  </Button>
                </Link>
                {(application.status === 'APPLIED' || application.status === 'UNDER_REVIEW') && (
                  <Button
                    variant="ghost"
                    className="w-full rounded-xl font-semibold text-brand-red hover:bg-brand-red/10 hover:text-brand-red"
                  >
                    Withdraw Application
                  </Button>
                )}
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
