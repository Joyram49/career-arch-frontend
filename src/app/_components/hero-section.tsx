'use client';

import { Button } from '@ui/button';
import { motion, type Variants } from 'framer-motion';
import Link from 'next/link';

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

const TOP_SECTORS = [
  'Systems Architecture',
  'FinTech Engineering',
  'Growth Marketing',
  'Product Strategy',
] as const;

const SOCIAL_PROOF_AVATARS = ['JD', 'MR', 'SC', 'AK', 'TL'] as const;

const AVATAR_COLORS = [
  'bg-brand-sky',
  'bg-brand-emerald',
  'bg-brand-amber',
  'bg-purple-500',
  'bg-pink-500',
] as const;

export function HeroSection(): React.JSX.Element {
  return (
    <section className="hero-bg relative flex min-h-[90vh] items-center justify-center overflow-hidden">
      {/* Dot grid pattern */}
      <div className="dot-grid pointer-events-none absolute inset-0" aria-hidden="true" />

      {/* Ambient glow orbs */}
      <div className="hero-orbs pointer-events-none absolute inset-0" aria-hidden="true" />

      {/* Subtle horizontal light beam */}
      <div
        className="hero-beam pointer-events-none absolute top-1/2 left-0 h-px w-full -translate-y-1/2"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-5 py-32 text-center lg:py-40">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center gap-8"
        >
          {/* Badge */}
          <motion.div variants={itemVariants}>
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-sky/20 bg-brand-sky/10 px-4 py-1.5">
              <span className="size-1.5 rounded-full bg-brand-emerald" />
              <span className="text-xs font-semibold tracking-widest text-brand-sky uppercase">
                Precision Career Intelligence
              </span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.div variants={itemVariants} className="space-y-2">
            <h1
              className="text-5xl leading-[1.05] font-black tracking-tight text-foreground sm:text-6xl lg:text-7xl xl:text-8xl"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Architect the Career
            </h1>
            <h1
              className="text-5xl leading-[1.05] font-black tracking-tight sm:text-6xl lg:text-7xl xl:text-8xl"
              style={{
                fontFamily: 'var(--font-display)',
                background: 'linear-gradient(135deg, #0ea5e9 0%, #10b981 60%, #f59e0b 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              You Deserve
            </h1>
          </motion.div>

          {/* SubHeadline */}
          <motion.p
            variants={itemVariants}
            className="max-w-xl text-lg leading-relaxed text-muted-foreground"
          >
            Precision matching for elite professionals. Access 50,000+ high-growth opportunities
            from the world&apos;s most innovative firms.
          </motion.p>

          {/* Search Bar */}
          <motion.div variants={itemVariants} className="w-full max-w-2xl">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="hero-glass flex flex-1 items-center gap-3 rounded-xl px-4 py-3 backdrop-blur-sm transition-all focus-within:border-brand-sky/40 focus-within:bg-white/8">
                <svg
                  viewBox="0 0 20 20"
                  fill="none"
                  className="size-4 shrink-0 text-slate-500"
                  aria-hidden="true"
                >
                  <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5" />
                  <path
                    d="M15 15L18 18"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Professional role or expertise"
                  className="flex-1 bg-transparent text-sm outline-none"
                  aria-label="Job title or keyword"
                />
              </div>
              <div className="hero-glass flex items-center gap-3 rounded-xl px-4 py-3 backdrop-blur-sm transition-all focus-within:border-brand-sky/40 sm:w-52">
                <svg
                  viewBox="0 0 20 20"
                  fill="none"
                  className="size-4 shrink-0 text-slate-500"
                  aria-hidden="true"
                >
                  <path
                    d="M10 11.5C11.933 11.5 13.5 9.933 13.5 8C13.5 6.067 11.933 4.5 10 4.5C8.067 4.5 6.5 6.067 6.5 8C6.5 9.933 8.067 11.5 10 11.5Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M10 2C6.134 2 3 5.134 3 9C3 13.5 10 19 10 19C10 19 17 13.5 17 9C17 5.134 13.866 2 10 2Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Global or Remote"
                  className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  aria-label="Location"
                />
              </div>
              <Link href={{ pathname: '/jobs' }}>
                <Button className="h-12 w-full rounded-xl bg-brand-sky px-6 font-bold text-white hover:bg-brand-sky/90 sm:w-auto">
                  Discover Roles
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Top Sectors */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center justify-center gap-2"
          >
            <span className="text-xs font-semibold tracking-widest text-slate-600 uppercase">
              Top Sectors:
            </span>
            {TOP_SECTORS.map((sector) => (
              <Link
                key={sector}
                href={{ pathname: `/jobs?category=${encodeURIComponent(sector)}` }}
                className="hero-glass rounded-xl px-3.5 py-1.5 text-xs font-semibold text-slate-400 transition-all hover:border-brand-sky/30 hover:bg-brand-sky/10 hover:text-brand-sky"
              >
                {sector}
              </Link>
            ))}
          </motion.div>

          {/* Social proof */}
          <motion.div variants={itemVariants} className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {SOCIAL_PROOF_AVATARS.map((initials, i) => (
                <div
                  key={initials}
                  className={`flex size-8 items-center justify-center rounded-full text-xs font-bold text-white ring-2 ring-[#0d0d1a] ${AVATAR_COLORS[i]}`}
                >
                  {initials.charAt(0)}
                </div>
              ))}
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    viewBox="0 0 12 12"
                    className="size-3 text-brand-amber"
                    aria-hidden="true"
                  >
                    <path
                      d="M6 1L7.5 4.5L11 5L8.5 7.5L9 11L6 9.5L3 11L3.5 7.5L1 5L4.5 4.5L6 1Z"
                      fill="currentColor"
                    />
                  </svg>
                ))}
              </div>
              <p className="text-xs text-slate-500">
                Join <span className="font-semibold text-slate-300">2.4M+</span> high-impact
                professionals
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div
        className="hero-bottom-fade pointer-events-none absolute right-0 bottom-0 left-0 h-32"
        aria-hidden="true"
      />
    </section>
  );
}
