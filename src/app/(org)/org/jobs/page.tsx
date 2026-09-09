'use client';

import { QueryParamsProvider } from '@providers/query-params-provider';
import { orgJobsQuerySchema } from '@validations/org.dashboard.schema';
import OrgJobsContainer from './_components/org-jobs-container';
export default function OrgJobsPage(): React.JSX.Element {
  return (
    <QueryParamsProvider schema={orgJobsQuerySchema}>
      <OrgJobsContainer />
    </QueryParamsProvider>
  );
}
