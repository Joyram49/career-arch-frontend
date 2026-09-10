import { OrgPageHeader } from '../../_components/shared';
import { OrgJobForm } from '../_components/job-form/org-job-form';

export default function OrgNewJobPage(): React.JSX.Element {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <OrgPageHeader
        title="Post a Job"
        description="Fill in the details below — you can save as a draft at the last step"
      />
      <div className="flex flex-1 flex-col overflow-hidden p-6">
        <OrgJobForm mode="create" />
      </div>
    </div>
  );
}
