/* ─────────────────────────────────────────────
   Type-safe route constants
   Use these everywhere instead of raw strings.
   ──────────────────────────────────────────── */

export const routes = {
  /* ── Public ── */
  home: '/',
  jobs: '/jobs',
  jobDetail: (slug: string) => `/jobs/${slug}`,
  companies: '/companies',
  companyDetail: (id: string) => `/companies/${id}`,
  pricing: '/pricing',
  salaryGuide: '/salary-guide',

  /* ── Auth ── */
  login: '/login',
  register: '/register',
  registerOrg: '/register-org',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  verifyEmail: '/verify-email',
  twoFaVerify: '/2fa/verify',
  twoFaSetup: '/2fa/setup',

  /* ── User Dashboard ── */
  dashboard: '/dashboard',
  applications: '/dashboard/applications',
  savedJobs: '/dashboard/saved-jobs',
  profile: '/dashboard/profile',
  subscription: '/dashboard/subscription',
  notifications: '/dashboard/notifications',
  settings: {
    root: '/dashboard/settings',
    account: '/dashboard/settings/account',
    password: '/dashboard/settings/password',
    notificationSettings: '/dashboard/settings/notifications',
    privacy: '/dashboard/settings/privacy',
  },

  /* ── Org Dashboard ── */
  org: {
    dashboard: '/org/dashboard',
    jobs: '/org/jobs',
    jobNew: '/org/jobs/new',
    jobEdit: (id: string) => `/org/jobs/${id}/edit`,
    jobApplications: (id: string) => `/org/jobs/${id}/applications`,
    applications: '/org/applications',
    incentives: '/org/incentives',
    companyProfile: '/org/profile',
    billing: '/org/billing',
    settings: '/org/settings',
  },

  /* ── Admin Dashboard ── */
  admin: {
    dashboard: '/admin/dashboard',
    users: '/admin/users',
    userDetail: (id: string) => `/admin/users/${id}`,
    organizations: '/admin/organizations',
    orgDetail: (id: string) => `/admin/organizations/${id}`,
    jobs: '/admin/jobs',
    subscriptions: '/admin/subscriptions',
    incentives: '/admin/incentives',
    transactions: '/admin/transactions',
    plans: '/admin/plans',
  },
} as const;
