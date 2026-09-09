'use client';

import { useAuth } from '@hooks/use-auth';
import { useOrgDashboardStats, useOrgJobsPerformance } from '@queries/org/use-org-dashboard';
import { motion, type Variants } from 'framer-motion';

import { OrgPageHeader } from '../../_components/shared';
import { OrgDashboardStats } from './org-dashboard-stats';
import { OrgJobsPerformanceTable } from './org-jobs-performance-table';
import { OrgQuickActions } from './org-quick-actions';
import { OrgRecentApplications } from './org-recent-applications';
import { OrgWelcomeBanner } from './org-welcome-banner';

const pageVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export default function OrgDashboardContainer(): React.JSX.Element {
  const { currentOrg } = useAuth();
  const { data: stats } = useOrgDashboardStats();

  const { data, isLoading, isError, refetch } = useOrgJobsPerformance({ page: 1, limit: 5 });
  const jobs = data?.jobs ?? [];

  const companyName = currentOrg?.profile?.companyName ?? 'there';
  const pendingIncentiveCount = stats?.pendingIncentiveCount ?? 0;

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <OrgPageHeader title="Dashboard" description="Your hiring activity at a glance" />

      <motion.div
        className="flex flex-col gap-5 py-5"
        variants={pageVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="px-6">
          <OrgWelcomeBanner
            companyName={companyName}
            pendingIncentiveCount={pendingIncentiveCount}
          />
        </div>

        <OrgDashboardStats />

        <OrgQuickActions pendingIncentiveCount={pendingIncentiveCount} />

        <div className="grid grid-cols-1 gap-5 px-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                Job Listings Performance
              </h2>
            </div>
            <OrgJobsPerformanceTable
              jobs={jobs}
              isLoading={isLoading}
              isError={isError}
              limit={5}
              onRetry={refetch}
            />
          </div>

          <div className="lg:col-span-1">
            <OrgRecentApplications />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
