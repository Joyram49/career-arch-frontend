'use client';

import { QueryParamsProvider } from '@providers/query-params-provider';
import { adminIncentivesQuerySchema } from '@validations/admin.dashboard.schema';
import AdminIncentivesContainer from './_components/admin-incentives-container';

export default function AdminIncentivesPage(): React.JSX.Element {
  return (
    <QueryParamsProvider schema={adminIncentivesQuerySchema}>
      <AdminIncentivesContainer />
    </QueryParamsProvider>
  );
  ``;
}
