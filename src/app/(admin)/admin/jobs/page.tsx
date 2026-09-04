'use client';

import { QueryParamsProvider } from '@providers/query-params-provider';
import { adminJobsQuerySchema } from '@validations/admin.dashboard.schema';
import AdminJobsContainer from './_components/admin-jobs-container';

export default function AdminJobsPage(): React.JSX.Element {
  return (
    <QueryParamsProvider schema={adminJobsQuerySchema}>
      <AdminJobsContainer />
    </QueryParamsProvider>
  );
}
