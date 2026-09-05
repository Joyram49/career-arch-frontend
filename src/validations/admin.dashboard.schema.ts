import z from 'zod';

export const adminUsersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),

  limit: z.coerce.number().int().min(1).max(100).default(10),

  search: z.string().trim().optional(),

  isActive: z
    .enum(['true', 'false'])
    .transform((v) => v === 'true')
    .optional(),

  isEmailVerified: z
    .enum(['true', 'false'])
    .transform((v) => v === 'true')
    .optional(),

  plan: z.enum(['FREE', 'BASIC', 'PREMIUM']).optional(),

  sortBy: z.enum(['createdAt', 'email', 'lastLoginAt']).default('createdAt'),

  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type AdminUsersQueryParams = z.infer<typeof adminUsersQuerySchema>;

// ── Admin: Organizations query params ──────────────────────────────────────

export const adminOrganizationsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  // Keyword search — email, companyName, location, country
  search: z.string().trim().optional(),
  // Location filter — matches profile.location OR profile.country
  // e.g. ?location=Dhaka or ?location=Bangladesh
  location: z.string().trim().optional(),
  isActive: z
    .enum(['true', 'false'])
    .transform((v) => v === 'true')
    .optional(),
  isEmailVerified: z
    .enum(['true', 'false'])
    .transform((v) => v === 'true')
    .optional(),
  isApproved: z
    .enum(['true', 'false'])
    .transform((v) => v === 'true')
    .optional(),
  isPaymentMethodOnFile: z
    .enum(['true', 'false'])
    .transform((v) => v === 'true')
    .optional(),
  hasUnpaidIncentives: z
    .enum(['true', 'false'])
    .transform((v) => v === 'true')
    .optional(),
  sortBy: z.enum(['createdAt', 'email', 'lastLoginAt', 'foundedYear']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type AdminOrganizationsQueryParams = z.infer<typeof adminOrganizationsQuerySchema>;

// ── Admin Jobs Query Schema ──────────────────────────────────────────────

export const adminJobsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'CLOSED', 'ARCHIVED']).optional(),
  jobType: z
    .enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'FREELANCE', 'REMOTE'])
    .optional(),
  category: z.string().trim().optional(),
  orgId: z.string().uuid().optional(),
  salaryMin: z.coerce.number().min(0).default(0),
  salaryMax: z.coerce.number().min(0).default(10_000_000),
  deadlineStatus: z.enum(['active', 'expired', 'all']).default('all'),
  sortBy: z
    .enum(['createdAt', 'publishedAt', 'views', 'title', 'salaryMin', 'salaryMax'])
    .default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type AdminJobsQueryParams = z.infer<typeof adminJobsQuerySchema>;

// ── Admin Subscriptions Query Schema ──────────────────────────────────────────────
export const adminSubscriptionsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  plan: z.enum(['FREE', 'BASIC', 'PREMIUM']).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'CANCELLED', 'PAST_DUE']).optional(),
  search: z.string().trim().min(1).optional(),
});

export type AdminSubscriptionsQueryParams = z.infer<typeof adminSubscriptionsQuerySchema>;
