import type { IOrgJobDetail } from '@app-types/org/org.job-detail';

import { OrgStatCard } from '../../../_components/shared';
import { deadlineLabel } from '../../_components/job-format.utils';

interface OrgJobDetailStatsProps {
  job: IOrgJobDetail;
}

export function OrgJobDetailStats({ job }: OrgJobDetailStatsProps): React.JSX.Element {
  const deadline = deadlineLabel(job);

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <OrgStatCard
        label="Applications"
        value={job.applicationsCount}
        icon="ti-file-text"
        accent="purple"
      />
      <OrgStatCard label="Views" value={job.views.toLocaleString()} icon="ti-eye" accent="sky" />
      <OrgStatCard label="Vacancies" value={job.vacancies} icon="ti-users" accent="emerald" />
      <OrgStatCard
        label="Status Detail"
        value={job.status === 'DRAFT' ? '—' : deadline.text.split(' ').slice(0, 2).join(' ')}
        trend={{
          value: deadline.text,
          direction: deadline.isUrgent ? 'down' : 'neutral',
        }}
        icon="ti-calendar-event"
        accent={deadline.isUrgent ? 'red' : 'amber'}
      />
    </div>
  );
}
