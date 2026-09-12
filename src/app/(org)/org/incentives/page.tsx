'use client';

import { QueryParamsProvider } from '@providers/query-params-provider';
import { orgIncentivesQuerySchema } from '@validations/org.incentives.schema';
import OrgIncentivesContainer from './_components/org-incentives-container';

export default function OrgIncentivesPage(): React.JSX.Element {
  return (
    <QueryParamsProvider schema={orgIncentivesQuerySchema}>
      <OrgIncentivesContainer />
    </QueryParamsProvider>
  );
}
