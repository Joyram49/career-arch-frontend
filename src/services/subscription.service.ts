import api from '@lib/axios';

export async function getMySubscription() {
  const { data } = await api.get('/subscription/my');
  return data.data as {
    plan: string;
    status: string;
    applyCountThisMonth: number;
    savedJobCount: number;
    nextBillingDate?: string;
    stripeSubscriptionId?: string;
  };
}

export async function getInvoices() {
  const { data } = await api.get('/subscription/invoices');
  return data.data as {
    invoices: Array<{
      id: string;
      date: string;
      description: string;
      amount: string;
      status: 'PAID' | 'FAILED' | 'PENDING';
      invoiceUrl?: string;
    }>;
  };
}

export async function createCheckoutSession(planId: string) {
  const { data } = await api.post('/subscription/checkout', { planId });
  return data.data as { checkoutUrl: string };
}

export async function cancelSubscription() {
  const { data } = await api.post('/subscription/cancel');
  return data;
}

export async function reactivateSubscription() {
  const { data } = await api.post('/subscription/reactivate');
  return data;
}

export async function getPlans() {
  const { data } = await api.get('/subscription/plans');
  return data.data as { plans: unknown[] };
}
