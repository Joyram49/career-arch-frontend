import { IJobFilters } from '@app-types/job';

/* ─────────────────────────────────────────────
   Query key factories
   Pattern: ['domain', 'action', ...identifiers]
   Using functions ensures keys are consistent and
   easy to invalidate at any granularity.
   ──────────────────────────────────────────── */
export const queryKeys = {
  /* ── Auth ── */
  auth: {
    me: (role: string | null) => ['auth', 'me', role] as const,
  },

  /* ── Jobs (public) ── */
  jobs: {
    all: () => ['jobs'] as const,
    list: (filters: Partial<IJobFilters>) => ['jobs', 'list', filters] as const,
    detail: (slug: string) => ['jobs', 'detail', slug] as const,
    categories: () => ['jobs', 'categories'] as const,
    saved: () => ['jobs', 'saved'] as const,
  },

  /* ── Applications (user) ── */
  applications: {
    all: () => ['applications'] as const,
    list: (filters?: Record<string, unknown>) => ['applications', 'list', filters] as const,
    detail: (id: string) => ['applications', 'detail', id] as const,
  },

  /* ── Profile ── */
  profile: {
    me: () => ['profile', 'me'] as const,
    org: (id: string) => ['profile', 'org', id] as const,
  },

  /* ── Subscription ── */
  subscription: {
    my: () => ['subscription', 'my'] as const,
    plans: () => ['subscription', 'plans'] as const,
    invoices: () => ['subscription', 'invoices'] as const,
  },

  /* ── Notifications ── */
  notifications: {
    all: (filters?: Record<string, unknown>) => ['notifications', filters] as const,
    unreadCount: () => ['notifications', 'unread-count'] as const,
  },

  /* ── Org jobs ── */
  orgJobs: {
    all: () => ['org', 'jobs'] as const,
    list: (filters?: Record<string, unknown>) => ['org', 'jobs', 'list', filters] as const,
    detail: (id: string) => ['org', 'jobs', 'detail', id] as const,
    deleted: () => ['org', 'jobs', 'deleted'] as const,
  },

  /* ── Org applications ── */
  orgApplications: {
    all: () => ['org', 'applications'] as const,
    byJob: (jobId: string, filters?: Record<string, unknown>) =>
      ['org', 'applications', jobId, filters] as const,
    detail: (id: string) => ['org', 'applications', 'detail', id] as const,
  },

  /* ── Org incentives ── */
  orgIncentives: {
    all: () => ['org', 'incentives'] as const,
    list: (filters?: Record<string, unknown>) => ['org', 'incentives', 'list', filters] as const,
    detail: (id: string) => ['org', 'incentives', 'detail', id] as const,
  },

  /* ── Org billing ── */
  orgBilling: {
    info: () => ['org', 'billing'] as const,
  },

  /* ── Org profile ── */
  orgProfile: {
    my: () => ['org', 'profile', 'my'] as const,
  },

  /* ── Admin ── */
  admin: {
    stats: () => ['admin', 'stats'] as const,
    users: {
      list: (filters?: Record<string, unknown>) => ['admin', 'users', 'list', filters] as const,
      detail: (id: string) => ['admin', 'users', 'detail', id] as const,
    },
    orgs: {
      list: (filters?: Record<string, unknown>) => ['admin', 'orgs', 'list', filters] as const,
      detail: (id: string) => ['admin', 'orgs', 'detail', id] as const,
    },
    jobs: {
      list: (filters?: Record<string, unknown>) => ['admin', 'jobs', 'list', filters] as const,
    },
    plans: {
      all: () => ['admin', 'plans'] as const,
      detail: (id: string) => ['admin', 'plans', 'detail', id] as const,
    },
    subscriptions: {
      list: (filters?: Record<string, unknown>) =>
        ['admin', 'subscriptions', 'list', filters] as const,
      stats: () => ['admin', 'subscriptions', 'stats'] as const,
    },
    incentives: {
      list: (filters?: Record<string, unknown>) =>
        ['admin', 'incentives', 'list', filters] as const,
      stats: () => ['admin', 'incentives', 'stats'] as const,
    },
  },
} as const;
