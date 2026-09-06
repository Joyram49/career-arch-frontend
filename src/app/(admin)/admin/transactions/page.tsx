'use client';
import { QueryParamsProvider } from '@providers/query-params-provider';
import { adminTransactionsQuerySchema } from '@validations/admin.dashboard.schema';
import AdminTransactionsContainer from './_components/admin-transactions-container';

export default function AdminTransactionsPage(): React.JSX.Element {
  return (
    <QueryParamsProvider schema={adminTransactionsQuerySchema}>
      <AdminTransactionsContainer />
    </QueryParamsProvider>
  );
}
