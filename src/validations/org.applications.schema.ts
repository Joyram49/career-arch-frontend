import { z } from 'zod';

export const orgApplicationsQuerySchema = z.object({
  view: z.enum(['kanban', 'list']).default('kanban'),
  jobId: z.string().optional(),
  status: z
    .enum([
      'PENDING',
      'UNDER_REVIEW',
      'SHORTLISTED',
      'INTERVIEW_SCHEDULED',
      'OFFERED',
      'HIRED',
      'REJECTED',
      'WITHDRAWN',
    ])
    .optional(),
  search: z.string().trim().min(1).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export type OrgApplicationsQueryParams = z.infer<typeof orgApplicationsQuerySchema>;
