'use client';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useMemo } from 'react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '');

interface StripeProviderProps {
  clientSecret: string;
  children: React.ReactNode;
}

export function StripeProvider({ clientSecret, children }: StripeProviderProps): React.JSX.Element {
  const options = useMemo(() => ({ clientSecret }), [clientSecret]);

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
}
