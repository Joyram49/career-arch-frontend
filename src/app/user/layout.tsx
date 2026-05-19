import { DashboardHeader } from '@components/layout/dashboard-header';
import { DashboardSidebar } from '@components/layout/dashboard-sidebar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s — CareerArch Dashboard',
    default: 'User Dashboard — CareerArch',
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <div className="dashboard-layout">
      <DashboardSidebar />
      <div className="dashboard-main">
        <DashboardHeader />
        <main className="min-h-[calc(100dvh-var(--header-height))] p-5 lg:p-7">{children}</main>
      </div>
    </div>
  );
}
