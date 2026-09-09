import { z } from 'zod';

export const orgJobsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(9),
  search: z.string().trim().min(1).optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'CLOSED', 'ARCHIVED']).optional(),
  jobType: z
    .enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'FREELANCE', 'REMOTE'])
    .optional(),
  sortBy: z.enum(['createdAt', 'deadline', 'applications']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type OrgJobsQueryParams = z.infer<typeof orgJobsQuerySchema>;
