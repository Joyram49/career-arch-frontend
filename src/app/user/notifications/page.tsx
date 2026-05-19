'use client';

import { motion, type Variants } from 'framer-motion';
import { useState } from 'react';
import { toast } from 'sonner';

import { cn } from '@lib/utils';
import { Button } from '@ui/button';

/* ── Types ── */
type NotifType = 'application' | 'interview' | 'match' | 'profile' | 'billing' | 'system';
type FilterTab = 'all' | 'applications' | 'jobs' | 'account' | 'billing';

interface Notification {
  id: string;
  type: NotifType;
  message: string;
  time: string;
  read: boolean;
  filter: FilterTab;
}

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'applications', label: 'Applications' },
  { key: 'jobs', label: 'Jobs' },
  { key: 'account', label: 'Account' },
  { key: 'billing', label: 'Billing' },
];

const NOTIF_META: Record<NotifType, { color: string; bg: string; icon: React.JSX.Element }> = {
  application: {
    color: 'var(--brand-emerald)',
    bg: 'rgba(16,185,129,0.12)',
    icon: (
      <svg viewBox="0 0 16 16" fill="none" className="size-4">
        <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.4" />
        <path
          d="M5 8l2 2 4-4"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  interview: {
    color: 'var(--brand-sky)',
    bg: 'rgba(14,165,233,0.12)',
    icon: (
      <svg viewBox="0 0 16 16" fill="none" className="size-4">
        <rect x="2" y="2.5" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.4" />
        <path
          d="M5 1.5V3.5M11 1.5V3.5M2 6.5h12"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  match: {
    color: 'var(--brand-amber)',
    bg: 'rgba(245,158,11,0.12)',
    icon: (
      <svg viewBox="0 0 16 16" fill="none" className="size-4">
        <rect x="2" y="3" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
        <path d="M5 6.5h6M5 9h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
  },
  profile: {
    color: 'var(--brand-purple)',
    bg: 'rgba(139,92,246,0.12)',
    icon: (
      <svg viewBox="0 0 16 16" fill="none" className="size-4">
        <circle cx="8" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.4" />
        <path
          d="M2.5 14c0-3 2.5-5 5.5-5s5.5 2 5.5 5"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  billing: {
    color: 'var(--muted-foreground)',
    bg: 'var(--muted)',
    icon: (
      <svg viewBox="0 0 16 16" fill="none" className="size-4">
        <rect
          x="1.5"
          y="3.5"
          width="13"
          height="9"
          rx="1.5"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <path d="M1.5 7h13" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    ),
  },
  system: {
    color: 'var(--brand-red)',
    bg: 'rgba(239,68,68,0.1)',
    icon: (
      <svg viewBox="0 0 16 16" fill="none" className="size-4">
        <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.4" />
        <path
          d="M8 5v3.5M8 10.5v.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
};

const DEMO_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'application',
    message: 'Your application at Stripe was shortlisted — congrats!',
    time: '5 min ago',
    read: false,
    filter: 'applications',
  },
  {
    id: '2',
    type: 'interview',
    message: 'Interview scheduled with Acme Inc. — Friday 3 PM EST',
    time: '2h ago',
    read: false,
    filter: 'applications',
  },
  {
    id: '3',
    type: 'match',
    message: 'New job match: Senior Dev at Vercel ($155k) — 92% match',
    time: '5h ago',
    read: false,
    filter: 'jobs',
  },
  {
    id: '4',
    type: 'profile',
    message: 'Your profile was viewed by 12 recruiters this week',
    time: '1d ago',
    read: true,
    filter: 'account',
  },
  {
    id: '5',
    type: 'application',
    message: 'Application to Figma was rejected. Keep going! 💪',
    time: '2d ago',
    read: true,
    filter: 'applications',
  },
  {
    id: '6',
    type: 'match',
    message: 'New premium listing: Staff Engineer at Linear ($200k)',
    time: '3d ago',
    read: true,
    filter: 'jobs',
  },
  {
    id: '7',
    type: 'billing',
    message: 'Professional Plan renewed — $9.99 charged to Visa ****4242',
    time: '4d ago',
    read: true,
    filter: 'billing',
  },
  {
    id: '8',
    type: 'system',
    message: 'Verify your email address to unlock all features',
    time: '1w ago',
    read: true,
    filter: 'account',
  },
];

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};
const itemVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.32, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export default function NotificationsPage(): React.JSX.Element {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [notifs, setNotifs] = useState<Notification[]>(DEMO_NOTIFICATIONS);

  const filtered = notifs.filter((n) => activeFilter === 'all' || n.filter === activeFilter);
  const unreadCount = notifs.filter((n) => !n.read).length;

  const markAllRead = (): void => {
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  const markRead = (id: string): void => {
    setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const }}
      className="mx-auto max-w-2xl"
    >
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-[17px] font-black text-foreground">Notifications</h1>
          {unreadCount > 0 && (
            <p className="mt-0.5 text-[12px] text-muted-foreground">
              {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={markAllRead}
            className="h-8 rounded-lg px-3 text-[12px] font-semibold text-brand-sky hover:bg-brand-sky/10"
          >
            Mark all as read
          </Button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        {FILTER_TABS.map((tab) => {
          const count =
            tab.key === 'all'
              ? notifs.filter((n) => !n.read).length
              : notifs.filter((n) => n.filter === tab.key && !n.read).length;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveFilter(tab.key)}
              className={cn(
                'relative rounded-full px-3 py-1.5 text-[12px] font-semibold transition-all',
                activeFilter === tab.key
                  ? 'bg-brand-navy text-white'
                  : 'bg-muted text-muted-foreground hover:text-foreground',
              )}
            >
              {tab.label}
              {count > 0 && (
                <span className="ml-1.5 inline-flex size-4 items-center justify-center rounded-full bg-brand-red text-[9px] font-black text-white">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Notification list */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-muted">
              <svg viewBox="0 0 28 28" fill="none" className="size-7 text-muted-foreground">
                <path
                  d="M14 3a8 8 0 018 8v4l2 3H4l2-3v-4a8 8 0 018-8z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <path d="M11 22a3 3 0 006 0" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </div>
            <p className="text-[14px] font-bold text-foreground">You're all caught up!</p>
            <p className="mt-1 text-[12px] text-muted-foreground">
              No notifications in this category
            </p>
          </div>
        ) : (
          <motion.ul variants={containerVariants} initial="hidden" animate="visible">
            {filtered.map((notif, idx) => {
              const meta = NOTIF_META[notif.type];
              return (
                <motion.li
                  key={notif.id}
                  variants={itemVariants}
                  onClick={() => markRead(notif.id)}
                  className={cn(
                    'activity-item cursor-pointer px-4 transition-colors hover:bg-muted/40',
                    idx === 0 && 'pt-4',
                    idx === filtered.length - 1 && 'border-b-0 pb-4',
                  )}
                >
                  {/* Unread dot */}
                  <div className="relative shrink-0">
                    <div
                      className="activity-icon"
                      style={{ background: meta.bg, color: meta.color }}
                      aria-hidden="true"
                    >
                      {meta.icon}
                    </div>
                    {!notif.read && (
                      <span
                        className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-brand-sky"
                        aria-label="Unread"
                      />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p
                      className={cn(
                        'text-[13px] leading-snug',
                        notif.read
                          ? 'font-normal text-muted-foreground'
                          : 'font-semibold text-foreground',
                      )}
                    >
                      {notif.message}
                    </p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">{notif.time}</p>
                  </div>
                </motion.li>
              );
            })}
          </motion.ul>
        )}
      </div>
    </motion.div>
  );
}
