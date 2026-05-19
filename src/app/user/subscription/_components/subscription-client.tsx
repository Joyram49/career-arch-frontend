'use client';

import { motion, type Variants } from 'framer-motion';
import Link from 'next/link';

import { Button } from '@ui/button';
import { Separator } from '@ui/separator';
import { Skeleton } from '@ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@ui/table';

import { useAuthStore } from '@lib/store/auth.store';
import { cn } from '@lib/utils';
import { useInvoices, useSubscription } from '@queries/use-subscription';

/* ── Plan config ── */
const PLAN_INFO = {
  FREE: {
    label: 'Free',
    price: '$0',
    applyLimit: 5,
    saveLimit: 5,
    color: 'var(--plan-free)',
    glow: 'rgba(100,116,139,0.2)',
    features: ['5 applications/month', '5 saved jobs', 'Basic profile', 'Free-tier jobs only'],
  },
  BASIC: {
    label: 'Professional',
    price: '$9.99',
    applyLimit: 30,
    saveLimit: 50,
    color: 'var(--brand-sky)',
    glow: 'rgba(14,165,233,0.25)',
    features: ['30 applications/month', '50 saved jobs', 'Standard visibility', 'All jobs access'],
  },
  PREMIUM: {
    label: 'Executive',
    price: '$24.99',
    applyLimit: -1, // unlimited
    saveLimit: -1,
    color: 'var(--brand-amber)',
    glow: 'rgba(245,158,11,0.2)',
    features: [
      'Unlimited applications',
      'Unlimited saved jobs',
      'Featured profile',
      'AI resume tips',
    ],
  },
} as const;

/* ── Demo invoices ── */
const DEMO_INVOICES = [
  {
    id: 'inv_1',
    date: 'May 1, 2025',
    description: 'Professional Plan — Monthly',
    amount: '$9.99',
    status: 'PAID' as const,
  },
  {
    id: 'inv_2',
    date: 'Apr 1, 2025',
    description: 'Professional Plan — Monthly',
    amount: '$9.99',
    status: 'PAID' as const,
  },
  {
    id: 'inv_3',
    date: 'Mar 1, 2025',
    description: 'Professional Plan — Monthly',
    amount: '$9.99',
    status: 'PAID' as const,
  },
  {
    id: 'inv_4',
    date: 'Feb 1, 2025',
    description: 'Free Plan — Free',
    amount: '$0.00',
    status: 'PAID' as const,
  },
];

const STATUS_STYLES = {
  PAID: 'badge-status-offered',
  FAILED: 'badge-status-rejected',
  PENDING: 'badge-status-review',
} as const;

/* ── Usage meter ── */
function UsageMeter({
  label,
  used,
  limit,
}: {
  label: string;
  used: number;
  limit: number;
}): React.JSX.Element {
  const isUnlimited = limit === -1;
  const pct = isUnlimited ? 100 : Math.min((used / limit) * 100, 100);
  const isWarning = !isUnlimited && pct >= 80;

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-[12px] font-semibold text-white/80">{label}</span>
        <span className="text-[12px] font-bold text-white">
          {isUnlimited ? (
            <span className="text-brand-emerald">Unlimited</span>
          ) : (
            <>
              {used} / {limit}
            </>
          )}
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: isUnlimited ? '100%' : `${pct}%`,
            background: isUnlimited
              ? 'var(--brand-emerald)'
              : isWarning
                ? 'var(--brand-amber)'
                : 'var(--brand-sky)',
          }}
        />
      </div>
      {isWarning && !isUnlimited && (
        <p className="mt-0.5 text-[10px] text-brand-amber">
          {limit - used} remaining this month — consider upgrading
        </p>
      )}
    </div>
  );
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export function SubscriptionClient(): React.JSX.Element {
  const { plan } = useAuthStore();
  const { data: sub, isLoading: subLoading } = useSubscription();
  const { data: invoicesData, isLoading: invLoading } = useInvoices();

  const currentPlan = (plan ?? 'FREE') as keyof typeof PLAN_INFO;
  const planInfo = PLAN_INFO[currentPlan];
  const invoices = (invoicesData?.invoices as typeof DEMO_INVOICES | undefined) ?? DEMO_INVOICES;

  /* Demo usage values */
  const applyUsed = sub?.applyCountThisMonth ?? 8;
  const saveUsed = sub?.savedJobCount ?? 3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const }}
      className="flex flex-col gap-6 lg:flex-row lg:items-start"
    >
      {/* Left col */}
      <div className="flex w-full flex-col gap-5 lg:max-w-sm">
        {/* Current plan card */}
        {subLoading ? (
          <Skeleton className="h-72 rounded-2xl" />
        ) : (
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="current-plan-card"
          >
            {/* Ambient glow */}
            <div
              className="plan-glow"
              style={{ width: 200, height: 200, background: planInfo.glow, top: -60, right: -60 }}
              aria-hidden="true"
            />

            <div className="relative z-10">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-[11px] font-bold tracking-widest text-white/60 uppercase">
                  Current Plan
                </span>
                <span
                  className="rounded-full px-3 py-1 text-[10px] font-black tracking-wider uppercase"
                  style={{ background: planInfo.glow, color: planInfo.color }}
                >
                  Active
                </span>
              </div>

              <h2
                className="mb-0.5 text-3xl font-black text-white"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {planInfo.label}
              </h2>
              <p className="mb-5 text-[13px] text-white/60">
                {currentPlan === 'FREE'
                  ? 'Free forever — no card required'
                  : `${planInfo.price}/month · Next billing ${sub?.nextBillingDate ?? 'Jun 1, 2025'}`}
              </p>

              <Separator className="mb-5 border-white/10" />

              {/* Usage */}
              <div className="flex flex-col gap-3">
                <UsageMeter
                  label="Applications this month"
                  used={applyUsed}
                  limit={planInfo.applyLimit}
                />
                <UsageMeter label="Saved jobs" used={saveUsed} limit={planInfo.saveLimit} />
              </div>

              {/* Features */}
              <ul className="mt-5 flex flex-col gap-2">
                {planInfo.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-[12px] text-white/80">
                    <svg
                      viewBox="0 0 14 14"
                      fill="none"
                      className="size-3.5 shrink-0 text-brand-emerald"
                    >
                      <circle cx="7" cy="7" r="6" fill="currentColor" opacity="0.2" />
                      <path
                        d="M4.5 7L6 8.5L9.5 5"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              {/* Actions */}
              <div className="mt-6 flex flex-col gap-2">
                {currentPlan !== 'PREMIUM' && (
                  <Link href={{ pathname: '/pricing' }}>
                    <Button className="w-full rounded-xl bg-brand-sky font-bold text-white hover:bg-brand-sky/90">
                      Upgrade Plan
                    </Button>
                  </Link>
                )}
                {currentPlan !== 'FREE' && (
                  <button
                    type="button"
                    className="text-center text-[12px] font-semibold text-white/50 underline-offset-2 hover:text-white/80 hover:underline"
                  >
                    Cancel Subscription
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Plan comparison teaser */}
        {currentPlan !== 'PREMIUM' && (
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="rounded-2xl border border-brand-sky/20 bg-brand-sky/5 p-4"
          >
            <p className="mb-1 text-[13px] font-bold text-foreground">
              {currentPlan === 'FREE'
                ? '🚀 Unlock 6× more applications with Basic'
                : '✨ Go Executive for unlimited everything'}
            </p>
            <p className="mb-3 text-[12px] text-muted-foreground">
              {currentPlan === 'FREE'
                ? 'Apply to 30 jobs/month + access all job tiers for just $9.99/mo'
                : 'Unlimited applications, AI resume tips, featured profile — $24.99/mo'}
            </p>
            <Link href={{ pathname: '/pricing' }}>
              <Button
                size="sm"
                variant="outline"
                className="w-full rounded-xl border-brand-sky/40 text-brand-sky hover:border-brand-sky hover:bg-brand-sky/10"
              >
                See All Plans
              </Button>
            </Link>
          </motion.div>
        )}
      </div>

      {/* Right col — Payment history */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 rounded-2xl border border-border bg-card shadow-card"
      >
        <div className="border-b border-border px-6 py-4">
          <h2 className="text-[15px] font-bold text-foreground">Payment History</h2>
          <p className="mt-0.5 text-[12px] text-muted-foreground">
            All subscription and payment records
          </p>
        </div>

        {invLoading ? (
          <div className="space-y-3 p-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-12 rounded-xl" />
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-border bg-muted/40 hover:bg-muted/40">
                <TableHead className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                  Date
                </TableHead>
                <TableHead className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                  Description
                </TableHead>
                <TableHead className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                  Amount
                </TableHead>
                <TableHead className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                  Status
                </TableHead>
                <TableHead className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                  Receipt
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((inv) => (
                <TableRow key={inv.id} className="border-border">
                  <TableCell className="text-[12px] text-muted-foreground">{inv.date}</TableCell>
                  <TableCell className="text-[13px] font-medium text-foreground">
                    {inv.description}
                  </TableCell>
                  <TableCell className="text-[13px] font-bold text-foreground">
                    {inv.amount}
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        'rounded-full px-2.5 py-1 text-[11px] font-bold',
                        STATUS_STYLES[inv.status],
                      )}
                    >
                      {inv.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <button
                      type="button"
                      className="rounded px-2 py-1 text-[11px] font-semibold text-brand-sky hover:underline"
                    >
                      Download
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {!invLoading && invoices.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-[13px] text-muted-foreground">No payment history yet</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
