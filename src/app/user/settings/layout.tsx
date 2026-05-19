'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@lib/utils';

const SETTINGS_NAV = [
  { href: '/user/settings/account', label: 'Account' },
  { href: '/user/settings/password', label: 'Password' },
  { href: '/user/settings/notifications', label: 'Notifications' },
  { href: '/user/settings/privacy', label: 'Privacy' },
] as const;

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const pathname = usePathname();

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-[17px] font-black text-foreground">Settings</h1>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Side nav */}
        <nav
          className="flex shrink-0 flex-row gap-1 overflow-x-auto lg:w-44 lg:flex-col"
          aria-label="Settings navigation"
        >
          {SETTINGS_NAV.map((item) => (
            <Link
              key={item.href}
              href={{ pathname: item.href }}
              className={cn(
                'rounded-xl px-3 py-2 text-[13px] font-semibold whitespace-nowrap transition-colors',
                pathname === item.href
                  ? 'bg-brand-navy text-white'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Content */}
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
