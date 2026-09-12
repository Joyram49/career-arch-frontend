/* eslint-disable @typescript-eslint/explicit-function-return-type */
// src/queries/org/use-org-incentives.ts
'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import type {
  IOrgIncentiveListItem,
  IOrgIncentiveStats,
  IOrgIncentivesFilters,
} from '@app-types/org/org.incentives';

/**
 * ── MOCK DATA LAYER — Phase 4B design pass ──────────────────────────────
 * Unlike most other org pages, the backend for Incentives is genuinely
 * complete already: `incentive.service.ts`, `org.incentive.controller.ts`,
 * and `org.incentive.routes.ts` implement GET /org/incentives,
 * GET /org/incentives/:id, POST /org/incentives/:id/pay, and
 * POST /org/incentives/:id/dispute. This mock layer mirrors that response
 * shape exactly (see IIncentiveResponse) — wiring the real API later is
 * close to a pure plumbing change. See README for the exact swap.
 */

async function mockDelay<T>(data: T, ms = 500): Promise<T> {
  await new Promise((resolve) => setTimeout(resolve, ms));
  return data;
}

// Toggle to false locally to see the real "no card on file" error path that
// incentive.service.ts's payIncentive() throws when isPaymentMethodOnFile is false.
const MOCK_HAS_PAYMENT_METHOD = true;

const NOW = Date.now();
const DAY = 86_400_000;

const MOCK_INCENTIVES: IOrgIncentiveListItem[] = [
  {
    id: 'inc-1',
    orgId: 'org-1',
    jobId: '1',
    applicationId: 'app-10',
    amount: 50,
    currency: 'USD',
    status: 'PENDING',
    dueAt: new Date(NOW + 5 * DAY).toISOString(),
    paidAt: null,
    hiredAt: new Date(NOW - 2 * DAY).toISOString(),
    stripePaymentIntentId: null,
    createdAt: new Date(NOW - 2 * DAY).toISOString(),
    updatedAt: new Date(NOW - 2 * DAY).toISOString(),
    candidate: { firstName: 'Grace', lastName: 'Okonkwo', email: 'grace@example.com' },
    job: { title: 'Senior Backend Engineer', slug: 'senior-backend-engineer' },
  },
  {
    id: 'inc-2',
    orgId: 'org-1',
    jobId: '2',
    applicationId: 'app-old-1',
    amount: 50,
    currency: 'USD',
    status: 'OVERDUE',
    dueAt: new Date(NOW - 3 * DAY).toISOString(),
    paidAt: null,
    hiredAt: new Date(NOW - 12 * DAY).toISOString(),
    stripePaymentIntentId: null,
    createdAt: new Date(NOW - 12 * DAY).toISOString(),
    updatedAt: new Date(NOW - 3 * DAY).toISOString(),
    candidate: { firstName: 'Noah', lastName: 'Kim', email: 'noah@example.com' },
    job: { title: 'Product Designer', slug: 'product-designer' },
  },
  {
    id: 'inc-3',
    orgId: 'org-1',
    jobId: '5',
    applicationId: 'app-old-2',
    amount: 50,
    currency: 'USD',
    status: 'PAID',
    dueAt: new Date(NOW - 20 * DAY).toISOString(),
    paidAt: new Date(NOW - 18 * DAY).toISOString(),
    hiredAt: new Date(NOW - 25 * DAY).toISOString(),
    stripePaymentIntentId: 'pi_mock_123',
    createdAt: new Date(NOW - 25 * DAY).toISOString(),
    updatedAt: new Date(NOW - 18 * DAY).toISOString(),
    candidate: { firstName: 'Elena', lastName: 'Petrova', email: 'elena@example.com' },
    job: { title: 'QA Automation Engineer', slug: 'qa-automation-engineer' },
  },
  {
    id: 'inc-4',
    orgId: 'org-1',
    jobId: '1',
    applicationId: 'app-old-3',
    amount: 50,
    currency: 'USD',
    status: 'DISPUTED',
    dueAt: new Date(NOW - 1 * DAY).toISOString(),
    paidAt: null,
    hiredAt: new Date(NOW - 10 * DAY).toISOString(),
    stripePaymentIntentId: null,
    createdAt: new Date(NOW - 10 * DAY).toISOString(),
    updatedAt: new Date(NOW - 1 * DAY).toISOString(),
    candidate: { firstName: 'Ravi', lastName: 'Patel', email: 'ravi@example.com' },
    job: { title: 'Senior Backend Engineer', slug: 'senior-backend-engineer' },
  },
  {
    id: 'inc-5',
    orgId: 'org-1',
    jobId: '2',
    applicationId: 'app-old-4',
    amount: 50,
    currency: 'USD',
    status: 'WAIVED',
    dueAt: new Date(NOW - 30 * DAY).toISOString(),
    paidAt: null,
    hiredAt: new Date(NOW - 35 * DAY).toISOString(),
    stripePaymentIntentId: null,
    createdAt: new Date(NOW - 35 * DAY).toISOString(),
    updatedAt: new Date(NOW - 28 * DAY).toISOString(),
    candidate: { firstName: 'Tomas', lastName: 'Novak', email: 'tomas@example.com' },
    job: { title: 'Product Designer', slug: 'product-designer' },
  },
];

export function useOrgIncentivesList(filters: IOrgIncentivesFilters) {
  return useQuery({
    queryKey: ['org-incentives', filters],
    queryFn: () => {
      const filtered = MOCK_INCENTIVES.filter((i) =>
        filters.status ? i.status === filters.status : true,
      );
      const start = (filters.page - 1) * filters.limit;
      return mockDelay({
        incentives: filtered.slice(start, start + filters.limit),
        meta: {
          total: filtered.length,
          page: filters.page,
          limit: filters.limit,
          totalPages: Math.max(1, Math.ceil(filtered.length / filters.limit)),
          hasNextPage: false,
          hasPrevPage: false,
        },
      });
    },
    placeholderData: (prev) => prev,
  });
}

/** Stats reflect ALL incentives regardless of the table's current filter — same convention as Admin's dedicated stats endpoint. */
export function useOrgIncentiveStats() {
  return useQuery({
    queryKey: ['org-incentive-stats'],
    queryFn: () => {
      const pending = MOCK_INCENTIVES.filter((i) => i.status === 'PENDING');
      const overdue = MOCK_INCENTIVES.filter((i) => i.status === 'OVERDUE');
      const paid = MOCK_INCENTIVES.filter((i) => i.status === 'PAID');
      const disputed = MOCK_INCENTIVES.filter((i) => i.status === 'DISPUTED');

      const stats: IOrgIncentiveStats = {
        totalPending: pending.length,
        pendingAmount: pending.reduce((sum, i) => sum + i.amount, 0),
        totalOverdue: overdue.length,
        overdueAmount: overdue.reduce((sum, i) => sum + i.amount, 0),
        totalDisputed: disputed.length,
        totalPaid: paid.length,
        paidAmount: paid.reduce((sum, i) => sum + i.amount, 0),
      };
      return mockDelay(stats, 300);
    },
    staleTime: 1000 * 30,
  });
}

export function usePayIncentive() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!MOCK_HAS_PAYMENT_METHOD) {
        throw new Error(
          'No payment method on file. Please add a card at /org/billing before paying.',
        );
      }
      return mockDelay({ id }, 800);
    },
    onSuccess: () => {
      toast.success('Payment successful. Thank you!');
      void qc.invalidateQueries({ queryKey: ['org-incentives'] });
      void qc.invalidateQueries({ queryKey: ['org-incentive-stats'] });
    },
    onError: (error: Error) => toast.error(error.message || 'Payment failed'),
  });
}

export function useDisputeIncentive() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { id: string; reason: string }) => mockDelay(payload),
    onSuccess: () => {
      toast.success('Dispute filed. Our team will review within 2 business days.');
      void qc.invalidateQueries({ queryKey: ['org-incentives'] });
      void qc.invalidateQueries({ queryKey: ['org-incentive-stats'] });
    },
    onError: () => toast.error('Failed to file dispute'),
  });
}
