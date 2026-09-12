import { z } from 'zod';

export const orgIncentivesQuerySchema = z.object({
  status: z.enum(['PENDING', 'PAID', 'WAIVED', 'DISPUTED', 'OVERDUE']).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.enum(['createdAt', 'dueAt', 'paidAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type OrgIncentivesQueryParams = z.infer<typeof orgIncentivesQuerySchema>;

// Mirrors disputeIncentiveSchema.shape.body — same min(20)/max(500) the
// backend actually enforces, so the client never shows a false "success"
// state that the server would then reject.
export const disputeIncentiveFormSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(20, 'Please provide a detailed reason (minimum 20 characters)')
    .max(500, 'Reason must be at most 500 characters'),
});

export type DisputeIncentiveFormInput = z.infer<typeof disputeIncentiveFormSchema>;
