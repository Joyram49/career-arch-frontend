'use client';

import { motion, type Variants } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const STATS = [
  { value: '50k+', label: 'Active Placements' },
  { value: '12k+', label: 'Growth Partners' },
  { value: '2.4M+', label: 'Global Talent' },
  { value: '89%', label: 'Placement Accuracy' },
] as const;

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export function StatsBar(): React.JSX.Element {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section className="relative border-y border-border bg-card" ref={ref}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y divide-border lg:grid-cols-4 lg:divide-y-0"
      >
        {STATS.map((stat) => (
          <motion.div
            key={stat.label}
            variants={itemVariants}
            className="flex flex-col items-center justify-center gap-1 px-6 py-10 text-center"
          >
            <span
              className="text-3xl font-black tracking-tight text-foreground lg:text-4xl"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {stat.value}
            </span>
            <span className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
              {stat.label}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
