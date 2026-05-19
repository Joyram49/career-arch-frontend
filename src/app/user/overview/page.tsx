import type { Metadata } from 'next';
import { ActivityFeed } from './_components/activity-feed';
import { ApplicationPipeline } from './_components/application-pipeline';
import { RecommendedJobs } from './_components/recommended-jobs';
import { StatsRow } from './_components/stats-row';
import { WelcomeBanner } from './_components/welcome-banner';

export const metadata: Metadata = { title: 'Overview' };

export default function DashboardOverviewPage(): React.JSX.Element {
  return (
    <div className="flex flex-col gap-6">
      <WelcomeBanner />
      <StatsRow />
      <ApplicationPipeline />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecommendedJobs />
        </div>
        <div>
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
}
