import { motion } from 'framer-motion';
import Link from 'next/link';

export function ExpiredTokenState(): React.JSX.Element {
  return (
    <motion.div
      className="flex flex-col items-center gap-5 text-center"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const }}
    >
      {/* Warning icon */}
      <div className="flex size-16 items-center justify-center rounded-2xl bg-brand-amber/10">
        <svg viewBox="0 0 32 32" fill="none" className="size-8 text-brand-amber" aria-hidden="true">
          <path
            d="M16 3L2 27h28L16 3Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path d="M16 13v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="16" cy="23" r="1.2" fill="currentColor" />
        </svg>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
          Link expired or invalid
        </h1>
        <p className="text-[15px] leading-relaxed text-muted-foreground">
          This employer password reset link has already been used or has expired. Links are valid
          for only <span className="font-semibold text-foreground">1 hour</span>.
        </p>
      </div>

      <div className="w-full space-y-3">
        <Link
          href={{ pathname: '/forgot-password-org' }}
          className="flex h-12 w-full items-center justify-center rounded-xl bg-brand-navy text-[15px] font-bold text-white transition-all duration-150 hover:-translate-y-px hover:bg-brand-navy/90 hover:shadow-card active:translate-y-0"
        >
          Request a new link
        </Link>
        <Link
          href={{ pathname: '/login-org' }}
          className="flex h-11 w-full items-center justify-center rounded-xl border border-border text-sm font-semibold text-muted-foreground transition-colors hover:border-brand-sky/40 hover:text-foreground"
        >
          Back to employer sign in
        </Link>
      </div>

      <p className="text-sm text-muted-foreground">
        Still having trouble?{' '}
        <Link href={{ pathname: '/help' }} className="font-semibold text-brand-sky hover:underline">
          Contact support
        </Link>
      </p>
    </motion.div>
  );
}
