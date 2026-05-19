'use client';

import { motion, type Variants } from 'framer-motion';
import Link from 'next/link';

import { useAuthStore } from '@lib/store/auth.store';
import { Button } from '@ui/button';

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export function WelcomeBanner(): React.JSX.Element {
  const { getUser } = useAuthStore();
  const currentUser = getUser();
  const firstName = currentUser?.profile?.firstName ?? 'there';

  return (
    <motion.div
      className="welcome-banner"
      initial="hidden"
      animate="visible"
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
    >
      {/* Ambient orbs */}
      <div
        className="welcome-banner-orb"
        style={{
          width: 240,
          height: 240,
          background: 'rgba(14,165,233,0.15)',
          top: -60,
          right: -40,
        }}
        aria-hidden="true"
      />
      <div
        className="welcome-banner-orb"
        style={{
          width: 160,
          height: 160,
          background: 'rgba(16,185,129,0.1)',
          bottom: -40,
          left: 80,
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <motion.p
            variants={itemVariants}
            className="mb-1 text-[13px] font-semibold text-brand-sky"
          >
            {getGreeting()}, {firstName} 👋
          </motion.p>
          <motion.h2
            variants={itemVariants}
            className="text-xl font-black tracking-tight text-white lg:text-2xl"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            You have <span className="text-brand-sky">3 interview invitations</span> pending your
            response
          </motion.h2>
          <motion.p variants={itemVariants} className="mt-1 text-sm text-slate-400">
            Your profile was viewed by 12 recruiters this week — keep it updated!
          </motion.p>
        </div>

        <motion.div variants={itemVariants} className="flex shrink-0 flex-wrap gap-2">
          <Link href={{ pathname: '/user/applications' }}>
            <Button
              variant="outline"
              className="border-white/20 bg-white/10 text-white backdrop-blur-sm hover:border-white/40 hover:bg-white/15"
            >
              View Applications
            </Button>
          </Link>
          <Link href={{ pathname: '/jobs' }}>
            <Button className="bg-brand-sky font-bold text-white hover:bg-brand-sky/90">
              Find New Roles
            </Button>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}
