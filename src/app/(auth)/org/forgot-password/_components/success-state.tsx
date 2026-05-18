import { motion } from 'framer-motion';
import Link from 'next/link';

interface SuccessStateProps {
  email: string;
  onRetry: () => void;
}

export function SuccessState({ email, onRetry }: SuccessStateProps): React.JSX.Element {
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
            d="M10 16.5 L14 20.5 L22 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
          Check your work email
        </h1>
        <p className="text-[15px] leading-relaxed text-muted-foreground">
          We&apos;ve sent a password reset link to{' '}
          <span className="font-semibold text-foreground">{email}</span>.
        </p>
        <p className="text-sm text-muted-foreground">
          The link expires in <span className="font-semibold text-foreground">1 hour</span>.
          Didn&apos;t receive it? Check your spam or{' '}
          <button
            type="button"
            onClick={onRetry}
            className="font-semibold text-brand-sky hover:underline"
          >
            try another email
          </button>
          .
        </p>
      </div>

      {/* Next steps */}
      <div className="w-full rounded-xl border border-border bg-muted/40 p-4 text-left">
        <p className="mb-3 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
          Next steps
        </p>
        <ul className="space-y-2">
          {[
            'Open the email from CareerArch in your work inbox',
            'Click the "Reset Password" button inside',
            'Create your new employer account password',
          ].map((step, i) => (
            <li key={step} className="flex items-start gap-2.5">
              <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-brand-sky/15 text-[9px] font-bold text-brand-sky">
                {i + 1}
              </span>
              <span className="text-xs leading-relaxed text-muted-foreground">{step}</span>
            </li>
          ))}
        </ul>
      </div>

      <Link
        href={{ pathname: '/org/login' }}
        className="mt-1 text-sm font-bold text-foreground transition-colors hover:text-brand-sky"
      >
        ← Back to employer sign in
      </Link>
    </motion.div>
  );
}
