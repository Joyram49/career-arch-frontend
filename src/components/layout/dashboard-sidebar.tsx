'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import {
  IconApplications,
  IconClose,
  IconNotification,
  IconOverview,
  IconProfile,
  IconSaved,
  IconSettings,
  IconSignOut,
  IconSubscription,
} from '@assets/icons/custom';
import { useAuthStore } from '@lib/store/auth.store';
import { useUiStore } from '@lib/store/ui.store';
import { cn } from '@lib/utils';
import { logoutUser } from '@services/user/auth.service';

/* ── Types ── */
interface NavItem {
  href: string;
  label: string;
  icon: React.JSX.Element;
  badge?: number;
}

/* ── Plan badge map ── */
const PLAN_BADGE: Record<string, { label: string; cls: string }> = {
  FREE: { label: 'Free', cls: 'bg-muted text-muted-foreground' },
  BASIC: { label: 'Basic', cls: 'bg-brand-sky/15 text-brand-sky' },
  PREMIUM: { label: 'Premium', cls: 'bg-brand-amber/15 text-brand-amber' },
};

/* ── Component ── */
export function DashboardSidebar(): React.JSX.Element {
  const pathname = usePathname();
  const router = useRouter();
  const { getUser, plan, clearAuth, isUser } = useAuthStore();
  const { sidebarOpen, setSidebarOpen } = useUiStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const navItems: NavItem[] = [
    {
      href: '/user/overview',
      label: 'Overview',
      icon: <IconOverview className="size-[18px]" />,
    },
    {
      href: '/user/applications',
      label: 'My Applications',
      icon: <IconApplications className="size-[18px]" />,
    },
    {
      href: '/user/saved-jobs',
      label: 'Saved Jobs',
      icon: <IconSaved className="size-[18px]" />,
    },
    {
      href: '/user/profile',
      label: 'My Profile',
      icon: <IconProfile className="size-[18px]" />,
    },
    {
      href: '/user/subscription',
      label: 'Subscription',
      icon: <IconSubscription className="size-[18px]" />,
    },
    {
      href: '/user/notifications',
      label: 'Notifications',
      icon: <IconNotification className="size-[18px]" />,
      badge: 3,
    },
    {
      href: '/user/settings',
      label: 'Settings',
      icon: <IconSettings className="size-[18px]" />,
    },
  ];

  const handleSignOut = useCallback(async (): Promise<void> => {
    setIsLoggingOut(true);
    try {
      await logoutUser();
    } catch {
      // proceed even on error
    }
    clearAuth();
    toast.success('Signed out successfully');
    router.push('/login');
  }, [clearAuth, router]);
  const user = getUser();

  const planMeta = PLAN_BADGE[plan ?? 'FREE'] ?? PLAN_BADGE['FREE']!;
  const firstName = user?.profile?.firstName ?? '';
  const lastName = user?.profile?.lastName ?? '';
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  const email = user?.email ?? '';

  const SidebarContent = (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-(--header-height) shrink-0 items-center gap-2.5 border-b border-sidebar-border px-5">
        <div className="flex size-8 items-center justify-center rounded-lg bg-brand-sky">
          <svg viewBox="0 0 24 24" fill="none" className="size-5 text-white">
            <path
              d="M12 3L20 7.5V16.5L12 21L4 16.5V7.5L12 3Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <path d="M12 3v18M4 7.5l8 4.5 8-4.5" stroke="currentColor" strokeWidth="1.8" />
          </svg>
        </div>
        <span
          className="text-[15px] font-black tracking-tight text-white"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          CareerArch
        </span>
      </div>

      {/* User info */}
      <div className="flex items-center gap-3 border-b border-sidebar-border px-4 py-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-sky text-sm font-black text-white">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="truncate text-[13px] font-bold text-white">
            {firstName} {lastName}
          </p>
          <p className="truncate text-[11px] text-sidebar-muted">{email}</p>
        </div>
        <span
          className={cn(
            'ml-auto shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase',
            planMeta.cls,
          )}
        >
          {planMeta.label}
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-3" aria-label="Dashboard navigation">
        <ul className="flex flex-col gap-0.5">
          {navItems.map((item) => {
            const isActive =
              item.href === '/user' ? pathname === '/user' : pathname.startsWith(item.href);

            return (
              <li key={item.href}>
                <Link
                  href={{ pathname: item.href }}
                  onClick={() => setSidebarOpen(false)}
                  className={cn('nav-item relative', isActive && 'active')}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.icon}
                  <span className="text-[13px] font-semibold">{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="ml-auto flex size-5 items-center justify-center rounded-full bg-brand-red text-[10px] font-bold text-white">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Sign out */}
      <div className="border-t border-sidebar-border p-3">
        <button
          type="button"
          onClick={() => void handleSignOut()}
          disabled={isLoggingOut}
          className="nav-item w-full text-brand-red hover:bg-brand-red/10 hover:text-brand-red disabled:opacity-50"
          aria-label="Sign out of your account"
        >
          <IconSignOut className="size-[18px]" />
          <span className="text-[13px] font-semibold">
            {isLoggingOut ? 'Signing out…' : 'Sign Out'}
          </span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="dashboard-sidebar hidden lg:block" aria-label="Sidebar">
        {SidebarContent}
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          'dashboard-sidebar lg:hidden',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          'transition-transform duration-300',
        )}
        aria-label="Mobile sidebar"
        aria-hidden={!sidebarOpen}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 rounded-lg p-1.5 text-sidebar-muted hover:text-white"
          aria-label="Close sidebar"
        >
          <IconClose className="size-5" />
        </button>
        {SidebarContent}
      </aside>
    </>
  );
}
