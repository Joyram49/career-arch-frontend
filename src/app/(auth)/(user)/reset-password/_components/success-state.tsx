import { motion } from 'framer-motion';
import Link from 'next/link';

export function SuccessState(): React.JSX.Element {
  return (
    <motion.div
      className="flex flex-col items-center gap-5 text-center"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const }}
    >
      {/* Success icon */}
      <div className="flex size-16 items-center justify-center rounded-2xl bg-brand-emerald/10">
        <svg
          viewBox="0 0 32 32"
          fill="none"
          className="size-8 text-brand-emerald"
          aria-hidden="true"
        >
          <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="1.8" />
          <path
            d="M10 16.5L14 20.5L22 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Password reset!</h1>
        <p className="text-[15px] leading-relaxed text-muted-foreground">
          Your password has been updated successfully. You can now sign in with your new
          credentials.
        </p>
      </div>

      {/* Security note */}
      <div className="w-full rounded-xl border border-brand-emerald/20 bg-brand-emerald/5 p-4 text-left">
        <div className="flex items-start gap-3">
          <svg
            viewBox="0 0 20 20"
            fill="none"
            className="mt-0.5 size-4 shrink-0 text-brand-emerald"
            aria-hidden="true"
          >
            <path
              d="M10 2L3 5V9.5c0 4.1 3 7.9 7 8.5 4-.6 7-4.4 7-8.5V5L10 2Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M7 10.5L9.5 13L13 8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="text-xs leading-relaxed text-muted-foreground">
            All existing sessions have been revoked for your security. You will need to sign in
            again on all devices.
          </p>
        </div>
      </div>

      <Link
        href={{ pathname: '/login' }}
        className="mt-1 flex h-12 w-full items-center justify-center rounded-xl bg-brand-navy text-[15px] font-bold text-white transition-all duration-150 hover:-translate-y-px hover:bg-brand-navy/90 hover:shadow-card active:translate-y-0"
      >
        Sign In Now
      </Link>
    </motion.div>
  );
}
