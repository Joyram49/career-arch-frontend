import { Button } from '@ui/button';

import type { IOrgBillingInfo } from '@app-types/org/org.billing';

const BRAND_ICONS: Record<string, string> = {
  visa: 'ti-brand-visa',
  mastercard: 'ti-brand-mastercard',
};

interface OrgBillingCardDisplayProps {
  billing: IOrgBillingInfo;
  onAddCard: () => void;
  onRemoveCard: () => void;
}

export function OrgBillingCardDisplay({
  billing,
  onAddCard,
  onRemoveCard,
}: OrgBillingCardDisplayProps): React.JSX.Element {
  if (!billing.card) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card px-6 py-10 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
          <i className="ti ti-credit-card-off text-xl text-muted-foreground" aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">No payment method on file</p>
          <p className="mt-1 max-w-xs text-xs text-muted-foreground">
            Add a card to post jobs and pay hiring incentives automatically.
          </p>
        </div>
        <Button onClick={onAddCard} className="bg-brand-sky text-white hover:bg-brand-sky/90">
          <i className="ti ti-plus mr-1.5" aria-hidden="true" />
          Add Payment Method
        </Button>
      </div>
    );
  }

  const { brand, last4, expMonth, expYear } = billing.card;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-3">
        <div className="flex size-11 items-center justify-center rounded-lg bg-brand-navy text-white">
          <i
            className={`ti ${BRAND_ICONS[brand.toLowerCase()] ?? 'ti-credit-card'} text-xl`}
            aria-hidden="true"
          />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground capitalize">
            {brand} •••• {last4}
          </p>
          <p className="text-xs text-muted-foreground">
            Expires {expMonth}/{expYear}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onAddCard}>
          Replace
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="border-red-200 text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={onRemoveCard}
          disabled={billing.hasUnpaidIncentives}
          title={
            billing.hasUnpaidIncentives
              ? 'Pay outstanding incentives before removing your card'
              : undefined
          }
        >
          Remove
        </Button>
      </div>
    </div>
  );
}
