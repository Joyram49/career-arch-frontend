'use client';
import { QueryParamsProvider } from '@providers/query-params-provider';
import { adminOrganizationsQuerySchema } from '@validations/admin.dashboard.schema';
import AdminOrganizationsContainer from './_components/admin-organizations-container';

export default function AdminOrganizationsPage(): React.JSX.Element {
  return (
    <QueryParamsProvider schema={adminOrganizationsQuerySchema}>
      <AdminOrganizationsContainer />
    </QueryParamsProvider>
  );
}
