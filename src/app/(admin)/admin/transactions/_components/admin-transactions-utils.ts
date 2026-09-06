import { type TxType } from '@app-types/admin/admin.dashboard.transactions';

export function formatCents(cents: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
}

export function partyLabel(
  party: { name?: string | null; companyName?: string | null } | null,
): string {
  if (!party) return '—';
  return party.name ?? party.companyName ?? '—';
}

export function partyInitials(label: string): string {
  return label
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export const TX_TYPE_LABEL: Record<TxType, string> = {
  SUBSCRIPTION: 'Subscription',
  INCENTIVE: 'Incentive',
  REFUND: 'Refund',
  OTHER: 'Other',
};
