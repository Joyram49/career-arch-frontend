'use client';

import { motion, type Variants } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

const STEPS = [
  {
    number: '01',
    title: 'Define Blueprint',
    description:
      'Construct your professional profile using our AI-driven architecture tools to spotlight high-value competencies.',
    color: 'from-brand-sky/20 to-brand-sky/5',
    borderColor: 'border-brand-sky/20',
    numberColor: 'text-brand-sky',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="size-7 text-brand-sky" aria-hidden="true">
        <rect x="4" y="4" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <rect x="18" y="4" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <rect x="4" y="18" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M23 18V28M18 23H28"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Select Tier',
    description:
      'Choose the level of intelligence and coaching required to achieve your next professional milestone.',
    color: 'from-brand-emerald/20 to-brand-emerald/5',
    borderColor: 'border-brand-emerald/20',
    numberColor: 'text-brand-emerald',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="size-7 text-brand-emerald" aria-hidden="true">
        <path
          d="M16 4L20 12L28 13L22 19L23.5 28L16 24L8.5 28L10 19L4 13L12 12L16 4Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Execute Move',
    description:
      'Apply with one-click precision. Monitor every stage of the engagement with real-time analytics.',
    color: 'from-brand-amber/20 to-brand-amber/5',
    borderColor: 'border-brand-amber/20',
    numberColor: 'text-brand-amber',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="size-7 text-brand-amber" aria-hidden="true">
        <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M11 16.5L14.5 20L21 13"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
] as const;

export function HowItWorks(): React.JSX.Element {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });

  return (
    <section className="how-it-works-bg relative py-20 lg:py-28" ref={ref}>
      {/* Subtle grid */}
      <div className="how-it-works-grid pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const }}
          className="mb-16 text-center"
        >
          <h2
            className="text-3xl font-black tracking-tight text-foreground lg:text-5xl"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Precision Career Growth
          </h2>
          <p className="mt-4 text-base text-muted-foreground lg:text-lg">
            CareerArch utilizes advanced intelligence to map your professional trajectory with
            absolute precision.
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid gap-6 lg:grid-cols-3"
        >
          {STEPS.map((step) => (
            <motion.div
              key={step.number}
              variants={itemVariants}
              className={`how-it-works-card relative overflow-hidden rounded-2xl border bg-linear-to-br p-8 ${step.color} ${step.borderColor}`}
            >
              {/* Large step number */}
              <div
                className={`absolute top-4 right-6 text-7xl font-black opacity-10 ${step.numberColor}`}
                style={{ fontFamily: 'var(--font-display)' }}
                aria-hidden="true"
              >
                {step.number}
              </div>

              {/* Icon */}
              <div
                className={`how-it-works-icon mb-6 inline-flex items-center justify-center rounded-xl border p-3 ${step.borderColor}`}
              >
                {step.icon}
              </div>

              <h3
                className="mb-3 text-xl font-black tracking-tight text-foreground"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
