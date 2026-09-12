'use client';

import { QueryParamsProvider } from '@providers/query-params-provider';
import { orgApplicationsQuerySchema } from '@validations/org.applications.schema';
import OrgApplicationsContainer from './_components/org-applications-container';

export default function OrgApplicationsPage(): React.JSX.Element {
  return (
    <QueryParamsProvider schema={orgApplicationsQuerySchema}>
      <OrgApplicationsContainer />
    </QueryParamsProvider>
  );
}
