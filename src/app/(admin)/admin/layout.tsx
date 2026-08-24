import type { Metadata } from 'next';
import { AdminSidebar } from './_components/admin-sidebar';
import { useAuth } from '@hooks/use-auth';

export const metadata: Metadata = {
  title: { template: '%s | CareerArch Admin', default: 'Admin | CareerArch' },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const = useAuth()
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AdminSidebar />
      <main className="flex flex-1 flex-col overflow-hidden">{children}</main>
    </div>
  );
}
