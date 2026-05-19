'use client';

import { motion, type Variants } from 'framer-motion';
import Link from 'next/link';
import { useInView } from 'react-intersection-observer';

import { Button } from '@ui/button';

/* Demo jobs — replace with useRecommendedJobs() TanStack hook */
const RECOMMENDED = [
  {
    id: '1',
    slug: 'senior-backend-engineer-stripe',
    title: 'Senior Backend Engineer',
    company: 'Stripe',
    location: 'Remote',
    salaryMin: '$140k',
    salaryMax: '$180k',
    plan: 'BASIC' as const,
    initials: 'S',
    color: '#7c3aed',
    match: 94,
  },
  {
    id: '2',
    slug: 'staff-product-engineer-notion',
    title: 'Staff Product Engineer',
    company: 'Notion',
    location: 'San Francisco, CA',
    salaryMin: '$160k',
    salaryMax: '$210k',
    plan: 'PREMIUM' as const,
    initials: 'N',
    color: '#18181b',
    match: 88,
  },
  {
    id: '3',
    slug: 'engineering-manager-linear',
    title: 'Engineering Manager',
    company: 'Linear',
    location: 'Remote',
    salaryMin: '$170k',
    salaryMax: '$220k',
    plan: 'PREMIUM' as const,
    initials: 'L',
    color: '#4f46e5',
    match: 81,
  },
];

const PLAN_STYLES = {
  FREE: 'badge-plan-free',
  BASIC: 'badge-plan-basic',
  PREMIUM: 'badge-plan-premium',
} as const;

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export function RecommendedJobs(): React.JSX.Element {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref}>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-[15px] font-bold text-foreground">Recommended for You</h2>
        <Link
          href={{ pathname: '/jobs' }}
          className="text-[12px] font-semibold text-brand-sky hover:underline"
        >
          Browse all →
        </Link>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        className="flex flex-col gap-3"
      >
        {RECOMMENDED.map((job) => (
          <motion.article
            key={job.id}
            variants={itemVariants}
            className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-sky/30 hover:shadow-md"
          >
            {/* Company avatar */}
            <div
              className="flex size-11 shrink-0 items-center justify-center rounded-xl text-sm font-black text-white"
              style={{ background: job.color }}
            >
              {job.initials}
            </div>

            {/* Job info */}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-[14px] font-bold text-foreground">{job.title}</h3>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase ${PLAN_STYLES[job.plan]}`}
                >
                  {job.plan}
                </span>
              </div>
              <p className="mt-0.5 text-[12px] text-muted-foreground">
                {job.company} · {job.location}
              </p>
            </div>

            {/* Salary + match + CTA */}
            <div className="flex shrink-0 flex-col items-end gap-2">
              <span className="text-[13px] font-bold text-brand-emerald">
                {job.salaryMin}–{job.salaryMax}
              </span>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-brand-emerald/10 px-2 py-0.5 text-[10px] font-bold text-brand-emerald">
                  {job.match}% match
                </span>
                <Link href={{ pathname: `/jobs/${job.slug}` }}>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 rounded-lg px-3 text-[11px] font-bold hover:border-brand-sky hover:text-brand-sky"
                  >
                    View
                  </Button>
                </Link>
              </div>
            </div>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}
