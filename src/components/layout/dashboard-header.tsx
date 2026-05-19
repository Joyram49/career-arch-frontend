'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { BellIcon, HamburgerIcon } from '@assets/icons/custom';
import { useAuthStore } from '@lib/store/auth.store';
import { useUiStore } from '@lib/store/ui.store';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@ui/dropdown-menu';

/* ── Breadcrumb helper ── */
const ROUTE_LABELS: Record<string, string> = {
  '/user/overview': 'Overview',
  '/user/applications': 'My Applications',
  '/user/saved-jobs': 'Saved Jobs',
  '/user/profile': 'My Profile',
  '/user/subscription': 'Subscription',
  '/user/notifications': 'Notifications',
  '/user/settings': 'Settings',
  '/user/settings/account': 'Account Settings',
  '/user/settings/password': 'Change Password',
  '/user/settings/notifications': 'Notification Settings',
  '/user/settings/privacy': 'Privacy Settings',
};

export function DashboardHeader(): React.JSX.Element {
  const pathname = usePathname();
  const { getUser, plan } = useAuthStore();
  const { setSidebarOpen } = useUiStore();
  const user = getUser();

  const pageLabel = ROUTE_LABELS[pathname] ?? 'Dashboard';
  const firstName = user?.profile?.firstName ?? 'User';
  const lastName = user?.profile?.lastName ?? '';
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  return (
    <header className="dashboard-header-bar">
      {/* Mobile hamburger */}
      <button
        type="button"
        onClick={() => setSidebarOpen(true)}
        className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:hidden"
        aria-label="Open navigation menu"
      >
        <HamburgerIcon className="size-5" />
      </button>

      {/* Page title */}
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-[15px] font-bold text-foreground lg:text-base">{pageLabel}</h1>
      </div>

      {/* Right actions */}
      <div className="flex shrink-0 items-center gap-1.5">
        {/* Notifications */}
        <Link
          href={{ pathname: '/user/notifications' }}
          className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="View notifications (3 unread)"
        >
          <BellIcon className="size-5" />
          <span
            className="absolute top-1.5 right-1.5 flex size-2 rounded-full bg-brand-red"
            aria-hidden="true"
          />
        </Link>

        {/* Avatar dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex size-8 items-center justify-center rounded-full bg-brand-sky text-xs font-black text-white transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              aria-label="Open account menu"
            >
              {initials}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col gap-0.5">
                <p className="text-sm font-bold">
                  {firstName} {lastName}
                </p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
                <span className="mt-1 inline-flex w-fit rounded-full bg-brand-sky/10 px-2 py-0.5 text-[10px] font-bold text-brand-sky uppercase">
                  {plan ?? 'FREE'} Plan
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={{ pathname: '/user/profile' }}>My Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={{ pathname: '/user/subscription' }}>Subscription</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={{ pathname: '/user/settings' }}>Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/" className="text-muted-foreground">
                Back to site
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
