'use client';

import { motion, type Variants } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

import { IconBookmark, IconCalendar, IconEye, IconSend } from '@assets/icons/custom';
import { useApplicationStats } from '@queries/use-applications';

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

interface StatCardProps {
  label: string;
  value: string | number;
  sub: string;
  color: string;
  accentColor: string;
  icon: React.JSX.Element;
}

function StatCard({
  label,
  value,
  sub,
  color,
  accentColor,
  icon,
}: StatCardProps): React.JSX.Element {
  return (
    <div className="stat-card">
      <div className="stat-card-accent" style={{ background: accentColor }} aria-hidden="true" />
      <div className="relative z-10">
        <div className="mb-3 flex items-start justify-between">
          <div
            className="flex size-9 items-center justify-center rounded-lg"
            style={{ background: `${accentColor}20` }}
          >
            <span style={{ color }}>{icon}</span>
          </div>
          <span className="rounded-full bg-brand-emerald/10 px-2 py-0.5 text-[11px] font-bold text-brand-emerald">
            {sub}
          </span>
        </div>
        <p
          className="text-2xl font-black tracking-tight text-foreground lg:text-3xl"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {value}
        </p>
        <p className="mt-0.5 text-[12px] font-medium text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

export function StatsRow(): React.JSX.Element {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { data } = useApplicationStats();

  const stats: StatCardProps[] = [
    {
      label: 'Applications Sent',
      value: data?.total ?? 28,
      sub: '+5 this week',
      color: 'var(--brand-sky)',
      accentColor: 'var(--brand-sky)',
      icon: <IconSend />,
    },
    {
      label: 'Interview Invites',
      value: data?.interviews ?? 3,
      sub: '2 need response',
      color: 'var(--brand-emerald)',
      accentColor: 'var(--brand-emerald)',
      icon: <IconCalendar />,
    },
    {
      label: 'Profile Views',
      value: 147,
      sub: '↑ 23% this week',
      color: 'var(--brand-amber)',
      accentColor: 'var(--brand-amber)',
      icon: <IconEye />,
    },
    {
      label: 'Saved Jobs',
      value: data?.saved ?? 12,
      sub: '8 new since visit',
      color: 'var(--brand-purple)',
      accentColor: 'var(--brand-purple)',
      icon: <IconBookmark />,
    },
  ];

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className="grid grid-cols-2 gap-4 lg:grid-cols-4"
    >
      {stats.map((s) => (
        <motion.div key={s.label} variants={itemVariants}>
          <StatCard {...s} />
        </motion.div>
      ))}
    </motion.div>
  );
}
