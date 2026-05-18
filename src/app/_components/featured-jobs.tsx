'use client';

import { Button } from '@ui/button';
import { motion, type Variants } from 'framer-motion';
import Link from 'next/link';
import { useInView } from 'react-intersection-observer';

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

const FEATURED_JOBS = [
  {
    id: '1',
    slug: 'senior-product-architect-stripe',
    title: 'Senior Product Architect',
    company: 'Stripe',
    location: 'Global Remote',
    type: 'Remote',
    salaryMin: '$160k',
    salaryMax: '$215k',
    skills: ['Precision Tools'],
    plan: 'PREMIUM' as const,
    initials: 'S',
    color: 'bg-violet-600',
    verified: true,
  },
  {
    id: '2',
    slug: 'staff-infrastructure-lead-airbnb',
    title: 'Staff Infrastructure Lead',
    company: 'Airbnb',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salaryMin: '$190k',
    salaryMax: '$245k',
    skills: ['Leadership'],
    plan: 'PREMIUM' as const,
    initials: 'A',
    color: 'bg-rose-500',
    verified: true,
  },
  {
    id: '3',
    slug: 'growth-strategy-director-spotify',
    title: 'Growth Strategy Director',
    company: 'Spotify',
    location: 'New York City',
    type: 'Hybrid',
    salaryMin: '$145k',
    salaryMax: '$195k',
    skills: ['Leadership'],
    plan: 'BASIC' as const,
    initials: 'S',
    color: 'bg-emerald-600',
    verified: true,
  },
] as const;

const PLAN_STYLES = {
  FREE: 'bg-muted text-muted-foreground',
  BASIC: 'bg-brand-sky/10 text-brand-sky',
  PREMIUM: 'bg-brand-amber/10 text-brand-amber',
} as const;

export function FeaturedJobs(): React.JSX.Element {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className="bg-background py-20 lg:py-28" ref={ref}>
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        {/* Section header */}
        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const }}
          >
            <p className="mb-2 text-xs font-bold tracking-widest text-brand-sky uppercase">
              Curated Roles
            </p>
            <h2
              className="text-3xl font-black tracking-tight text-foreground lg:text-4xl"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Premium Career Opportunities
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Link
              href={{ pathname: '/jobs' }}
              className="flex items-center gap-1.5 text-sm font-semibold text-brand-sky hover:underline"
            >
              View Intelligence Dashboard
              <svg viewBox="0 0 16 16" fill="none" className="size-4" aria-hidden="true">
                <path
                  d="M3 8H13M9 4L13 8L9 12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </motion.div>
        </div>

        {/* Job cards grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {FEATURED_JOBS.map((job) => (
            <motion.article
              key={job.id}
              variants={itemVariants}
              className="group hover:shadow-dropdown relative flex flex-col rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-200 hover:-translate-y-1 hover:border-brand-sky/30"
            >
              {/* Verified badge */}
              {job.verified && (
                <div className="absolute top-4 right-4 flex items-center gap-1 rounded-full bg-brand-emerald/10 px-2.5 py-1">
                  <svg viewBox="0 0 12 12" className="size-3 text-brand-emerald" aria-hidden="true">
                    <path
                      d="M2 6L5 9L10 3"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-[10px] font-bold text-brand-emerald">Validated</span>
                </div>
              )}

              {/* Company identity */}
              <div className="mb-4 flex items-center gap-3">
                <div
                  className={`flex size-11 shrink-0 items-center justify-center rounded-xl text-sm font-black text-white ${job.color}`}
                >
                  {job.initials}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-muted-foreground">{job.company}</p>
                  <p className="truncate text-sm font-bold text-foreground">{job.location}</p>
                </div>
              </div>

              {/* Job title */}
              <h3 className="mb-3 text-lg leading-snug font-black tracking-tight text-foreground transition-colors group-hover:text-brand-sky">
                {job.title}
              </h3>

              {/* Meta row */}
              <div className="mb-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                  {job.type}
                </span>
                {job.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-brand-sky/8 px-2.5 py-1 text-xs font-semibold text-brand-sky"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Salary + plan */}
              <div className="mb-5 flex items-center justify-between">
                <span className="text-base font-black text-brand-emerald">
                  {job.salaryMin} – {job.salaryMax}
                </span>
                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase ${PLAN_STYLES[job.plan]}`}
                >
                  {job.plan}
                </span>
              </div>

              {/* CTA */}
              <Link href={{ pathname: `/jobs/${job.slug}` }} className="mt-auto">
                <Button
                  variant="outline"
                  className="w-full rounded-xl border-border font-semibold transition-all group-hover:border-brand-sky group-hover:text-brand-sky"
                >
                  Submit Expression
                </Button>
              </Link>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
