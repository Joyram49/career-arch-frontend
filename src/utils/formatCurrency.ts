/* ── Currency formatting ── */
export function formatCurrency(amount: number, currency = 'USD', compact = false): string {
  if (compact) {
    if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
    if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`;
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatSalaryRange(min: number, max: number): string {
  return `${formatCurrency(min, 'USD', true)} – ${formatCurrency(max, 'USD', true)} / yr`;
}
