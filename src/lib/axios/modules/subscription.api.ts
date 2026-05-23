// src/lib/axios/modules/subscription.api.ts
import type { IApiResponse } from '@app-types/api';
import client from '../client';

const subscription = {
  getPlans: () => client.get<IApiResponse<{ plans: unknown[] }>>('/subscription/plans'),

  getMy: () => client.get<IApiResponse<{ subscription: unknown }>>('/subscription/my'),

  checkout: (payload: { planId: string; successUrl: string; cancelUrl: string }) =>
    client.post<IApiResponse<{ checkoutUrl: string }>>('/subscription/checkout', payload),

  cancel: () => client.post<IApiResponse<null>>('/subscription/cancel'),

  reactivate: () => client.post<IApiResponse<null>>('/subscription/reactivate'),

  getInvoices: (params?: Record<string, unknown>) =>
    client.get<IApiResponse<{ invoices: unknown[] }>>('/subscription/invoices', { params }),
};

export default subscription;
