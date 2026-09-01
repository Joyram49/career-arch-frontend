import type { Metadata } from 'next';
import { AdminAuthGate } from './_components/admin-auth-gate';

export const metadata: Metadata = {
  title: { template: '%s | CareerArch Admin', default: 'Admin | CareerArch' },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return <AdminAuthGate>{children}</AdminAuthGate>;
}
