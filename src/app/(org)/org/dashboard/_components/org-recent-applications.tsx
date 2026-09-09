'use client';

import { useOrgRecentApplications } from '@queries/org/use-org-dashboard';
import { Button } from '@ui/button';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function ApplicationsSkeleton(): React.JSX.Element {
  return (
    <div className="space-y-3 p-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex animate-pulse items-center gap-3">
          <div className="size-8 shrink-0 rounded-full bg-muted" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3 w-28 rounded bg-muted" />
            <div className="h-2.5 w-36 rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function OrgRecentApplications(): React.JSX.Element {
  const { data: applicants, isLoading, isError, refetch } = useOrgRecentApplications();

  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h3 className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
          Recent Applications
        </h3>
        <Link
          href="/org/applications"
          className="text-xs font-medium text-brand-sky hover:underline"
        >
          View all
        </Link>
      </div>

      {isLoading ? (
        <ApplicationsSkeleton />
      ) : isError ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 p-6 text-center">
          <span className="text-xs text-muted-foreground">Couldn&apos;t load applications.</span>
          <Button variant="outline" size="sm" onClick={refetch}>
            Retry
          </Button>
        </div>
      ) : applicants && applicants.length > 0 ? (
        <ul className="flex-1 divide-y divide-border overflow-y-auto">
          {applicants.map((a) => (
            <li key={a.id} className="flex items-center gap-3 px-4 py-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-sky/15 text-xs font-bold text-brand-sky">
                {getInitials(a.candidateName)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-foreground">{a.candidateName}</p>
                <p className="truncate text-[11px] text-muted-foreground">
                  applied to <span className="font-medium">{a.jobTitle}</span>
                </p>
              </div>
              <span className="shrink-0 text-[10px] text-muted-foreground">
                {formatDistanceToNow(new Date(a.appliedAt), { addSuffix: true })}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-1 p-6 text-center">
          <i className="ti ti-inbox text-xl text-muted-foreground" aria-hidden="true" />
          <p className="text-xs text-muted-foreground">No applications yet.</p>
        </div>
      )}
    </div>
  );
}
