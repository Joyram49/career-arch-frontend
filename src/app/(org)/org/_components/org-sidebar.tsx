'use client';

import { LogoIcon } from '@assets/icons/custom';
import { useAuth } from '@hooks/use-auth';
import { cn } from '@lib/utils';
import { motion, type Variants } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type UrlObject } from 'url';

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

// NOTE: "Job Listings" (not "My Jobs") — deliberate product-copy choice.
const NAV: NavItem[] = [
  { label: 'Dashboard', href: '/org/dashboard', icon: 'ti-layout-dashboard' },
  { label: 'Job Listings', href: '/org/jobs', icon: 'ti-briefcase' },
  { label: 'Post a Job', href: '/org/jobs/new', icon: 'ti-plus' },
  { label: 'Applications', href: '/org/applications', icon: 'ti-inbox' },
  { label: 'Incentives', href: '/org/incentives', icon: 'ti-coin' },
  { label: 'Company Profile', href: '/org/profile', icon: 'ti-building' },
  { label: 'Billing', href: '/org/billing', icon: 'ti-credit-card' },
  { label: 'Settings', href: '/org/settings', icon: 'ti-settings' },
];

const sidebarVariants: Variants = {
  hidden: { x: -16, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export function OrgSidebar(): React.JSX.Element {
  const pathname = usePathname();
  const { currentOrg } = useAuth();

  const companyName = currentOrg?.profile?.companyName ?? 'Your Company';
  const isApproved = currentOrg?.isApproved ?? false;

  return (
    <motion.aside
      variants={sidebarVariants}
      initial="hidden"
      animate="visible"
      className="flex h-full w-55 shrink-0 flex-col overflow-y-auto border-r border-[#293548]"
      style={{ background: '#1e293b' }}
      aria-label="Organization navigation"
    >
      {/* Logo + company identity */}
      <div className="flex items-center gap-2.5 border-b border-[#293548] px-5 py-3.75">
        <div className="flex size-8 items-center justify-center rounded-lg bg-brand-sky/20">
          <LogoIcon className="size-4 text-brand-sky" />
        </div>
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-sm leading-none font-bold tracking-tight text-white">
            {companyName}
          </span>
          <span
            className={cn(
              'mt-1 w-fit rounded px-1.5 py-0.5 text-[9px] font-bold tracking-wider uppercase',
            )}
            style={
              isApproved
                ? { background: 'rgba(16,185,129,0.18)', color: '#34d399' }
                : { background: 'rgba(245,158,11,0.18)', color: '#fbbf24' }
            }
          >
            {isApproved ? 'Approved' : 'Pending Approval'}
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-0.5 px-3 py-3">
        {NAV.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href as unknown as UrlObject}
              className={cn(
                'group relative flex items-center gap-2.5 rounded-lg px-3 py-1.75 text-[13px] font-medium transition-all duration-150',
                isActive
                  ? 'bg-brand-sky/15 text-brand-sky'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200',
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              {isActive && (
                <span className="absolute top-1/2 left-0 h-4 w-0.5 -translate-y-1/2 rounded-r-full bg-brand-sky" />
              )}
              <i className={cn('ti', item.icon, 'text-[15px]')} aria-hidden="true" />
              <span className="flex-1">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className="border-t border-[#293548] p-3">
        <button
          type="button"
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-slate-400 transition-all hover:bg-red-500/10 hover:text-red-400"
          aria-label="Sign out of organization dashboard"
        >
          <i className="ti ti-logout text-[15px]" aria-hidden="true" />
          Sign Out
        </button>
      </div>
    </motion.aside>
  );
}
