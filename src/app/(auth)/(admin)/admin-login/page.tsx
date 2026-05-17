import type { Metadata } from 'next';

import { AdminLoginForm } from './_components/admin-login-form';
import { TerminalGrid } from './_components/terminal-grid';

// ── Metadata ────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: 'Admin Access | CareerArch',
  description: 'Restricted administrative portal. Authorized personnel only.',
  robots: { index: false, follow: false },
};

// ── Page (RSC) ──────────────────────────────────────────────────
export default function AdminLoginPage() {
  return (
    <main
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden"
      style={{ background: 'var(--admin-bg)' }}
    >
      {/* ── Ambient layers ── */}
      <TerminalGrid />

      {/* ── Content ── */}
      <div className="relative z-10 flex w-full flex-col items-center justify-center px-4 py-12">
        <AdminLoginForm />
      </div>
    </main>
  );
}
