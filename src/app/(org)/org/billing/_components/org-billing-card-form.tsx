'use client';

import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { Button } from '@ui/button';
import { useState } from 'react';

// Stripe Elements render inside a sandboxed iframe and cannot read the host
// page's CSS custom properties (var(--foreground) etc. simply won't resolve
// in there) — colors must be literal values. These match the light-mode
// tokens from globals.css. Supporting dark mode would mean computing actual
// resolved colors via getComputedStyle and passing them here on theme change.
const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '14px',
      color: '#fff',
      '::placeholder': { color: '#94a3b8' },
    },
    invalid: { color: '#ef4444' },
  },
};

interface OrgBillingCardFormProps {
  clientSecret: string;
  isSaving: boolean;
  onSaved: (paymentMethodId: string) => void;
  onCancel: () => void;
}

export function OrgBillingCardForm({
  clientSecret,
  isSaving,
  onSaved,
  onCancel,
}: OrgBillingCardFormProps): React.JSX.Element {
  const stripe = useStripe();
  const elements = useElements();
  const [isConfirming, setIsConfirming] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    setIsConfirming(true);
    setCardError(null);

    const { error, setupIntent } = await stripe.confirmCardSetup(clientSecret, {
      payment_method: { card: cardElement },
    });

    setIsConfirming(false);

    if (error) {
      setCardError(error.message ?? 'Something went wrong confirming your card.');
      return;
    }

    const paymentMethodId =
      typeof setupIntent?.payment_method === 'string'
        ? setupIntent.payment_method
        : setupIntent?.payment_method?.id;

    if (!paymentMethodId) {
      setCardError('Could not confirm the card. Please try again.');
      return;
    }

    onSaved(paymentMethodId);
  }

  const isBusy = isConfirming || isSaving;

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="flex flex-col gap-4">
      <div className="rounded-lg border border-border bg-input px-3 py-2.5">
        <CardElement options={CARD_ELEMENT_OPTIONS} onChange={() => setCardError(null)} />
      </div>

      {cardError && <p className="text-xs text-destructive">{cardError}</p>}

      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <i className="ti ti-lock" aria-hidden="true" />
        Secured by Stripe — your card details never touch our servers.
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isBusy}>
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-brand-sky text-white hover:bg-brand-sky/90"
          disabled={!stripe || isBusy}
        >
          {isBusy ? 'Saving…' : 'Save Card'}
        </Button>
      </div>
    </form>
  );
}
