'use client';

import { QueryParamsProvider } from '@providers/query-params-provider';
import { adminSubscriptionsQuerySchema } from '@validations/admin.dashboard.schema';
import AdminSubscriptionsContainer from './_components/admin-subscriptions-container';

export default function AdminSubscriptionsPage(): React.JSX.Element {
  return (
    <QueryParamsProvider schema={adminSubscriptionsQuerySchema}>
      <AdminSubscriptionsContainer />
    </QueryParamsProvider>
  );
}
