'use client';

import { LogoIcon } from '@assets/icons/custom';
import { cn } from '@lib/utils';
import { motion, type Variants } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: number;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const NAV: NavSection[] = [
  {
    title: 'Platform',
    items: [{ label: 'Overview', href: '/admin/dashboard', icon: 'ti-layout-dashboard' }],
  },
  {
    title: 'Users & Orgs',
    items: [
      { label: 'Users', href: '/admin/users', icon: 'ti-users' },
      { label: 'Organizations', href: '/admin/organizations', icon: 'ti-building' },
    ],
  },
  {
    title: 'Content',
    items: [{ label: 'Jobs', href: '/admin/jobs', icon: 'ti-briefcase' }],
  },
  {
    title: 'Payments',
    items: [
      { label: 'Subscriptions', href: '/admin/subscriptions', icon: 'ti-credit-card' },
      { label: 'Incentives', href: '/admin/incentives', icon: 'ti-coin' },
      { label: 'Transactions', href: '/admin/transactions', icon: 'ti-receipt' },
    ],
  },
  {
    title: 'System',
    items: [
      { label: 'Plans', href: '/admin/plans', icon: 'ti-layout-list' },
      { label: 'Settings', href: '/admin/settings', icon: 'ti-settings' },
    ],
  },
];

const sidebarVariants: Variants = {
  hidden: { x: -16, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export function AdminSidebar(): React.JSX.Element {
  const pathname = usePathname();

  return (
    <motion.aside
      variants={sidebarVariants}
      initial="hidden"
      animate="visible"
      className="flex h-full w-55 shrink-0 flex-col overflow-y-auto border-r border-[#1e293b]"
      style={{ background: '#0f172a' }}
      aria-label="Admin navigation"
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 border-b border-[#1e293b] px-5 py-3.75">
        <div className="flex size-8 items-center justify-center rounded-lg bg-brand-sky/20">
          <LogoIcon className="size-4 text-brand-sky" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm leading-none font-bold tracking-tight text-white">
            CareerArch
          </span>
          <span
            className="mt-1 w-fit rounded px-1.5 py-0.5 text-[9px] font-bold tracking-wider uppercase"
            style={{ background: 'rgba(239,68,68,0.18)', color: '#f87171' }}
          >
            Super Admin
          </span>
        </div>
      </div>

      {/* Nav sections */}
      <nav className="flex flex-1 flex-col gap-0 px-3 py-3">
        {NAV.map((section) => (
          <div key={section.title} className="mb-4">
            <p className="mb-1 px-2 text-[9px] font-semibold tracking-[0.13em] text-slate-600 uppercase">
              {section.title}
            </p>
            {section.items.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
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
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="rounded-full bg-red-500/20 px-1.5 py-0.5 text-[9px] font-bold text-red-400">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Sign out */}
      <div className="border-t border-[#1e293b] p-3">
        <button
          type="button"
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-slate-400 transition-all hover:bg-red-500/10 hover:text-red-400"
          aria-label="Sign out of admin panel"
        >
          <i className="ti ti-logout text-[15px]" aria-hidden="true" />
          Sign Out
        </button>
      </div>
    </motion.aside>
  );
}
