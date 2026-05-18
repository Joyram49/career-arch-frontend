'use client';

import { motion, type Variants } from 'framer-motion';
import Link from 'next/link';

import { Button } from '@ui/button';

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

function SuccessIconAnimated(): React.JSX.Element {
  return (
    <div className="relative mx-auto mb-6 flex size-20 items-center justify-center sm:size-24">
      <div className="absolute inset-0 hidden rounded-[28px] bg-brand-emerald sm:block" />
      <div className="relative flex size-20 items-center justify-center sm:hidden">
        <svg
          viewBox="0 0 80 80"
          className="absolute inset-0 size-full animate-[spin_8s_linear_infinite]"
          aria-hidden="true"
        >
          <circle
            cx="40"
            cy="40"
            r="36"
            fill="none"
            stroke="var(--brand-emerald)"
            strokeWidth="1.5"
            strokeDasharray="6 4"
            strokeLinecap="round"
            opacity="0.6"
          />
        </svg>
        <div className="bg-brand-emerald-light relative flex size-14 items-center justify-center rounded-full">
          <svg
            viewBox="0 0 28 28"
            fill="none"
            className="size-7 text-brand-emerald"
            aria-hidden="true"
          >
            <motion.path
              d="M6 14.5L11.5 20L22 8"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const }}
            />
          </svg>
        </div>
      </div>
      <svg
        viewBox="0 0 28 28"
        fill="none"
        className="relative hidden size-10 text-white sm:block"
        aria-hidden="true"
      >
        <motion.path
          d="M5 14.5L11.5 21L23 7"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.65, delay: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as const }}
        />
      </svg>
    </div>
  );
}

export function EmailVerifiedCard(): React.JSX.Element {
  return (
    <motion.div
      className="w-full max-w-sm sm:max-w-md"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        variants={itemVariants}
        className="shadow-modal relative overflow-hidden rounded-3xl border border-border bg-card p-7 sm:p-10"
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[2px] rounded-t-3xl"
          style={{
            background: 'linear-gradient(90deg, transparent, var(--brand-emerald), transparent)',
          }}
          aria-hidden="true"
        />

        <SuccessIconAnimated />

        <motion.div variants={itemVariants} className="mb-6 space-y-3 text-center">
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Organization verified!
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
            Your employer account is now active. Start posting jobs and building your team on{' '}
            <span className="font-bold text-brand-sky">CareerArch</span>.
          </p>
        </motion.div>

        {/* What's next */}
        <motion.div
          variants={itemVariants}
          className="mb-6 rounded-xl border border-brand-emerald/20 bg-brand-emerald/5 p-4"
        >
          <p className="mb-3 text-[11px] font-bold tracking-widest text-brand-emerald uppercase">
            What's next
          </p>
          <ul className="space-y-2.5">
            {[
              'Sign in to your employer dashboard',
              'Complete your company profile for better visibility',
              'Post your first job listing in minutes',
              'Review applicants in your hiring pipeline',
            ].map((step, i) => (
              <li key={step} className="flex items-start gap-2.5">
                <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-brand-emerald text-[9px] font-bold text-white">
                  {i + 1}
                </span>
                <span className="text-xs leading-relaxed text-muted-foreground">{step}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Link href={{ pathname: '/login-org' }} className="block">
            <Button
              type="button"
              className="h-12 w-full cursor-pointer rounded-xl bg-brand-navy text-[15px] font-bold text-white transition-all duration-150 hover:-translate-y-px hover:bg-brand-navy/90 hover:shadow-card active:translate-y-0"
            >
              Go to Employer Dashboard
            </Button>
          </Link>
        </motion.div>

        <div className="mt-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-[9px] font-bold tracking-[0.18em] text-muted-foreground/50 uppercase">
            Security Protocol V2.4
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>
      </motion.div>
    </motion.div>
  );
}
