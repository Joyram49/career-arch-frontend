import { type IAdminOrgProfile } from '@app-types/admin/admin.dashboard.orgs';

export function formatCents(cents: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
}

export function orgInitials(name: string): string {
  return name.slice(0, 2).toUpperCase();
}

export function orgLocationLabel(profile: IAdminOrgProfile | null | undefined): string {
  if (!profile) return '—';
  return [profile.location, profile.country].filter(Boolean).join(', ') || '—';
}
