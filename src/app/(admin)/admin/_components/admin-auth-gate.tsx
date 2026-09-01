'use client';

import { useAuth } from '@hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { AdminSidebar } from './admin-sidebar';

export function AdminAuthGate({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element | null {
  const router = useRouter();
  const { isHydrated, isAdmin, currentAdmin } = useAuth();

  const isAuthorized = isHydrated && isAdmin && !!currentAdmin;

  useEffect(() => {
    if (!isHydrated) return;
    if (!isAuthorized) {
      router.replace('/admin-login');
    }
  }, [isHydrated, isAuthorized, router]);

  if (!isAuthorized) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AdminSidebar />
      <main className="flex flex-1 flex-col overflow-hidden">{children}</main>
    </div>
  );
}
