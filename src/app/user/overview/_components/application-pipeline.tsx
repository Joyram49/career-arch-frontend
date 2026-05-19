'use client';

import { motion, type Variants } from 'framer-motion';
import Link from 'next/link';
import { useInView } from 'react-intersection-observer';

import { useApplications } from '@queries/use-applications';

const STAGES = [
  {
    key: 'APPLIED',
    label: 'Applied',
    color: 'var(--status-applied)',
    bg: 'var(--status-applied-bg)',
  },
  {
    key: 'UNDER_REVIEW',
    label: 'Under Review',
    color: 'var(--status-review)',
    bg: 'var(--status-review-bg)',
  },
  {
    key: 'SHORTLISTED',
    label: 'Shortlisted',
    color: 'var(--status-shortlisted)',
    bg: 'var(--status-shortlisted-bg)',
  },
  {
    key: 'INTERVIEW',
    label: 'Interview',
    color: 'var(--status-interview)',
    bg: 'var(--status-interview-bg)',
  },
  {
    key: 'OFFERED',
    label: 'Offer/Hired',
    color: 'var(--status-offered)',
    bg: 'var(--status-offered-bg)',
  },
] as const;

type StageKey = (typeof STAGES)[number]['key'];

/* Demo data shape — matches real API response */
interface PipelineApp {
  id: string;
  jobTitle: string;
  companyName: string;
  status: StageKey;
  appliedAt: string;
}

const DEMO_APPS: PipelineApp[] = [
  {
    id: '1',
    jobTitle: 'Senior Backend Eng.',
    companyName: 'Stripe',
    status: 'APPLIED',
    appliedAt: '2d ago',
  },
  {
    id: '2',
    jobTitle: 'Staff Engineer',
    companyName: 'Airbnb',
    status: 'UNDER_REVIEW',
    appliedAt: '5d ago',
  },
  {
    id: '3',
    jobTitle: 'Growth Director',
    companyName: 'Spotify',
    status: 'SHORTLISTED',
    appliedAt: '1w ago',
  },
  {
    id: '4',
    jobTitle: 'Product Lead',
    companyName: 'Notion',
    status: 'INTERVIEW',
    appliedAt: '2w ago',
  },
  {
    id: '5',
    jobTitle: 'Lead Architect',
    companyName: 'Vercel',
    status: 'OFFERED',
    appliedAt: '3w ago',
  },
];

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};
const colVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export function ApplicationPipeline(): React.JSX.Element {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { data } = useApplications();

  /* Use real data if available, else demo */
  const apps: PipelineApp[] = (data?.applications as PipelineApp[] | undefined) ?? DEMO_APPS;

  const byStatus = (key: StageKey): PipelineApp[] => apps.filter((a) => a.status === key);

  return (
    <section ref={ref}>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-[15px] font-bold text-foreground">Application Pipeline</h2>
        <Link
          href={{ pathname: `/user/applications` }}
          className="text-[12px] font-semibold text-brand-sky hover:underline"
        >
          View all →
        </Link>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        className="flex gap-3 overflow-x-auto pb-2"
        style={{ scrollbarWidth: 'none' }}
      >
        {STAGES.map((stage) => {
          const items = byStatus(stage.key);
          return (
            <motion.div key={stage.key} variants={colVariants} className="pipeline-column">
              <div className="pipeline-header">
                <span
                  className="text-[11px] font-bold tracking-wider uppercase"
                  style={{ color: stage.color }}
                >
                  {stage.label}
                </span>
                <span
                  className="pipeline-count"
                  style={{ color: stage.color, background: stage.bg }}
                >
                  {items.length}
                </span>
              </div>

              {items.length === 0 ? (
                <p className="py-4 text-center text-[11px] text-muted-foreground">Empty</p>
              ) : (
                items.map((app) => (
                  <Link href={{ pathname: `/user/applications` }} key={app.id}>
                    <div className="pipeline-job-card">
                      <p className="mb-0.5 text-[12px] leading-tight font-bold text-foreground">
                        {app.jobTitle}
                      </p>
                      <p className="text-[11px] text-muted-foreground">{app.companyName}</p>
                      <p className="mt-1.5 text-[10px] text-muted-foreground/70">{app.appliedAt}</p>
                    </div>
                  </Link>
                ))
              )}
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
