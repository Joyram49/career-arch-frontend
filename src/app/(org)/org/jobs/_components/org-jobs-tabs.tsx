'use client';

import { cn } from '@lib/utils';
import { useOrgJobsStatusCounts } from '@queries/org/use-org-jobs';

import type { OrgJobStatus } from '@app-types/org/org.jobs';

interface TabDef {
  label: string;
  value: OrgJobStatus | undefined;
  countKey: 'all' | 'draft' | 'published' | 'closed' | 'archived';
}

const TABS: TabDef[] = [
  { label: 'All', value: undefined, countKey: 'all' },
  { label: 'Published', value: 'PUBLISHED', countKey: 'published' },
  { label: 'Drafts', value: 'DRAFT', countKey: 'draft' },
  { label: 'Closed', value: 'CLOSED', countKey: 'closed' },
  { label: 'Archived', value: 'ARCHIVED', countKey: 'archived' },
];

interface OrgJobsTabsProps {
  activeStatus: OrgJobStatus | undefined;
  onChange: (status: OrgJobStatus | undefined) => void;
}

export function OrgJobsTabs({ activeStatus, onChange }: OrgJobsTabsProps): React.JSX.Element {
  const { data: counts } = useOrgJobsStatusCounts();

  return (
    <div className="flex items-center gap-1 border-b border-border bg-card px-6" role="tablist">
      {TABS.map((tab) => {
        const isActive = activeStatus === tab.value;
        const count = counts?.[tab.countKey];
        return (
          <button
            key={tab.label}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.value)}
            className={cn(
              'relative flex items-center gap-1.5 px-3 py-3 text-[13px] font-medium transition-colors',
              isActive ? 'text-brand-sky' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {tab.label}
            {count !== undefined && (
              <span
                className={cn(
                  'flex min-w-4.5 items-center justify-center rounded-full px-1 text-[10px] font-bold',
                  isActive ? 'bg-brand-sky/15 text-brand-sky' : 'bg-muted text-muted-foreground',
                )}
              >
                {count}
              </span>
            )}
            {isActive && (
              <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-t-full bg-brand-sky" />
            )}
          </button>
        );
      })}
    </div>
  );
}
