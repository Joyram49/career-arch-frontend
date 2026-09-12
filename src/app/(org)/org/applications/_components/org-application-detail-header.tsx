import { Button } from '@ui/button';
import { format, formatDistanceToNow } from 'date-fns';

import type { IOrgApplicationDetail } from '@app-types/org/org.applications';

import { ApplicationStatusBadge } from './application-status-badge';

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

interface OrgApplicationDetailHeaderProps {
  application: IOrgApplicationDetail;
}

export function OrgApplicationDetailHeader({
  application,
}: OrgApplicationDetailHeaderProps): React.JSX.Element {
  return (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-sky/15 text-sm font-bold text-brand-sky">
            {getInitials(application.candidateName)}
          </div>
          <div>
            {application.candidateHeadline && (
              <p className="text-xs text-muted-foreground">{application.candidateHeadline}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Applied to <span className="font-medium text-foreground">{application.jobTitle}</span>
            </p>
          </div>
        </div>
        <ApplicationStatusBadge status={application.status} className="shrink-0" />
      </div>

      <div className="grid grid-cols-2 gap-3 rounded-lg border border-border bg-muted/30 p-3 text-xs sm:grid-cols-4">
        <div>
          <p className="text-muted-foreground">Applied</p>
          <p
            className="mt-0.5 font-medium text-foreground"
            title={format(new Date(application.appliedAt), 'PPP')}
          >
            {formatDistanceToNow(new Date(application.appliedAt), { addSuffix: true })}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground">Email</p>
          <p className="mt-0.5 truncate font-medium text-foreground">
            {application.candidateEmail}
          </p>
        </div>
        {application.candidateExperienceYears != null && (
          <div>
            <p className="text-muted-foreground">Experience</p>
            <p className="mt-0.5 font-medium text-foreground">
              {application.candidateExperienceYears} yrs
            </p>
          </div>
        )}
        {application.candidateLocation && (
          <div>
            <p className="text-muted-foreground">Location</p>
            <p className="mt-0.5 font-medium text-foreground">{application.candidateLocation}</p>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {application.resumeUrl && (
          <Button asChild size="sm" variant="outline">
            <a href={application.resumeUrl} target="_blank" rel="noopener noreferrer">
              <i className="ti ti-file-text mr-1.5" aria-hidden="true" />
              Resume
            </a>
          </Button>
        )}
        {application.candidateLinkedinUrl && (
          <Button asChild size="sm" variant="outline">
            <a href={application.candidateLinkedinUrl} target="_blank" rel="noopener noreferrer">
              <i className="ti ti-brand-linkedin mr-1.5" aria-hidden="true" />
              LinkedIn
            </a>
          </Button>
        )}
        {application.candidateGithubUrl && (
          <Button asChild size="sm" variant="outline">
            <a href={application.candidateGithubUrl} target="_blank" rel="noopener noreferrer">
              <i className="ti ti-brand-github mr-1.5" aria-hidden="true" />
              GitHub
            </a>
          </Button>
        )}
        {application.candidatePortfolioUrl && (
          <Button asChild size="sm" variant="outline">
            <a href={application.candidatePortfolioUrl} target="_blank" rel="noopener noreferrer">
              <i className="ti ti-world mr-1.5" aria-hidden="true" />
              Portfolio
            </a>
          </Button>
        )}
      </div>
    </>
  );
}
