// src/app/(dashboard)/dashboard/page.tsx
import { headers } from 'next/headers';

export default async function DashboardPage(): Promise<React.JSX.Element> {
  const h = await headers();
  const refreshed = h.get('x-refreshed-access-token');
  console.log('[Dashboard] x-refreshed-access-token:', refreshed ? 'PRESENT ✅' : 'ABSENT');

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Dashboard</h1>
      <p>Token was refreshed: {refreshed ? 'YES ✅' : 'NO'}</p>
    </div>
  );
}
