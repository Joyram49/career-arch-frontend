import type { Metadata } from 'next';
import { SubscriptionClient } from './_components/subscription-client';

export const metadata: Metadata = { title: 'Subscription' };

export default function SubscriptionPage(): React.JSX.Element {
  return <SubscriptionClient />;
}
