export function formatPriceCents(cents: number): string {
  if (cents === 0) return 'Free';
  return `$${(cents / 100).toFixed(2)}`;
}

export function formatLimit(value: number, unitSingular: string, unitPlural?: string): string {
  if (value === -1) return 'Unlimited';
  const unit = value === 1 ? unitSingular : (unitPlural ?? `${unitSingular}s`);
  return `${value} ${unit}`;
}
