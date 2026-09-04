'use client';
import { QueryParamsProvider } from '@providers/query-params-provider';
import { adminUsersQuerySchema } from '@validations/admin.dashboard.schema';
import AdminUsersContainer from './_components/admin-users-container';

export default function AdminUsersPage(): React.JSX.Element {
  return (
    <QueryParamsProvider schema={adminUsersQuerySchema}>
      <AdminUsersContainer />
    </QueryParamsProvider>
  );
}
