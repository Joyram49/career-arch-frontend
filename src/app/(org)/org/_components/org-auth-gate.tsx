'use client';

import { useAuth } from '@hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { OrgSidebar } from './org-sidebar';

export function OrgAuthGate({ children }: { children: React.ReactNode }): React.JSX.Element | null {
  const router = useRouter();
  const { isHydrated, isOrg, currentOrg } = useAuth();

  const isAuthorized = isHydrated && isOrg && !!currentOrg;

  useEffect(() => {
    if (!isHydrated) return;
    if (!isAuthorized) {
      router.replace('/org/login');
    }
  }, [isHydrated, isAuthorized, router]);

  if (!isAuthorized) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <OrgSidebar />
      <main className="flex flex-1 flex-col overflow-hidden">{children}</main>
    </div>
  );
}
