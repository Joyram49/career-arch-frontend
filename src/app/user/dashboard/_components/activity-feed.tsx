'use client';

import { IconBriefcase, IconCalendar, IconCard, IconCheck, IconView } from '@assets/icons/custom';
import { motion, type Variants } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface ActivityEvent {
  id: string;
  type: 'view' | 'interview' | 'match' | 'status' | 'billing';
  message: string;
  time: string;
  color: string;
  bg: string;
  icon: React.JSX.Element;
}

const EVENTS: ActivityEvent[] = [
  {
    id: '1',
    type: 'view',
    message: 'TechCorp viewed your application',
    time: '5 min ago',
    color: 'var(--brand-sky)',
    bg: 'rgba(14,165,233,0.12)',
    icon: <IconView />,
  },
  {
    id: '2',
    type: 'interview',
    message: 'Interview scheduled with Acme Inc.',
    time: '2h ago',
    color: 'var(--brand-emerald)',
    bg: 'rgba(16,185,129,0.12)',
    icon: <IconCalendar />,
  },
  {
    id: '3',
    type: 'match',
    message: 'New match: Senior Dev at Stripe ($130k)',
    time: '5h ago',
    color: 'var(--brand-amber)',
    bg: 'rgba(245,158,11,0.12)',
    icon: <IconBriefcase />,
  },
  {
    id: '4',
    type: 'status',
    message: 'Your Spotify application was shortlisted',
    time: '1d ago',
    color: 'var(--brand-purple)',
    bg: 'rgba(139,92,246,0.12)',
    icon: <IconCheck />,
  },
  {
    id: '5',
    type: 'billing',
    message: 'Subscription renewed — $9.99 charged',
    time: '3d ago',
    color: 'var(--muted-foreground)',
    bg: 'var(--muted)',
    icon: <IconCard />,
  },
];

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};
const itemVariants: Variants = {
  hidden: { opacity: 0, x: 12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export function ActivityFeed(): React.JSX.Element {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="h-full rounded-2xl border border-border bg-card p-4 shadow-card">
      <h2 className="mb-4 text-[15px] font-bold text-foreground">Recent Activity</h2>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
      >
        {EVENTS.map((evt) => (
          <motion.div key={evt.id} variants={itemVariants} className="activity-item">
            <div
              className="activity-icon"
              style={{ background: evt.bg, color: evt.color }}
              aria-hidden="true"
            >
              {evt.icon}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] leading-snug font-medium text-foreground">{evt.message}</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">{evt.time}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
