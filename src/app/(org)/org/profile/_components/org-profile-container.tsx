'use client';

import { useOrgProfile } from '@queries/org/use-org-profile';

import { OrgPageHeader } from '../../_components/shared';
import { OrgProfileApprovalBanner } from './org-profile-approval-banner';
import { OrgProfileForm } from './org-profile-form';
import { OrgProfileLogoUpload } from './org-profile-logo-upload';
import { OrgProfilePreview } from './org-profile-preview';
import { OrgProfileSkeleton } from './org-profile-skeleton';

export default function OrgProfileContainer(): React.JSX.Element {
  const { data: profile, isLoading, isError, refetch } = useOrgProfile();

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <OrgPageHeader
        title="Company Profile"
        description="This is how your company appears to candidates across CareerArch"
      />

      {isLoading ? (
        <OrgProfileSkeleton />
      ) : isError || !profile ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
          <p className="text-sm text-muted-foreground">Couldn&apos;t load your company profile.</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="text-xs font-medium text-brand-sky underline"
          >
            Try again
          </button>
        </div>
      ) : (
        <>
          <OrgProfileApprovalBanner profile={profile} />

          <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-[320px_1fr]">
            <div className="flex flex-col gap-4">
              <div className="rounded-xl border border-border bg-card p-4">
                <OrgProfileLogoUpload logoUrl={profile.logoUrl} companyName={profile.companyName} />
              </div>
              <OrgProfilePreview profile={profile} />
            </div>

            <OrgProfileForm profile={profile} />
          </div>
        </>
      )}
    </div>
  );
}
