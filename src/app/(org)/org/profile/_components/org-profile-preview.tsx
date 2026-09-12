import Image from 'next/image';

import type { IOrgProfile } from '@app-types/org/org.profile';

interface OrgProfilePreviewProps {
  profile: IOrgProfile;
}

export function OrgProfilePreview({ profile }: OrgProfilePreviewProps): React.JSX.Element {
  const initials = profile.companyName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="profile-preview-card">
      <div className="profile-banner" />
      <div className="-mt-8 flex flex-col items-center px-5 pb-5 text-center">
        <div className="relative flex size-16 items-center justify-center overflow-hidden rounded-xl border-4 border-card bg-muted shadow-md">
          {profile.logoUrl ? (
            <Image
              src={profile.logoUrl}
              alt={`${profile.companyName} logo`}
              fill
              unoptimized
              className="object-cover"
            />
          ) : (
            <span className="text-lg font-bold text-muted-foreground">{initials || '?'}</span>
          )}
        </div>

        <div className="mt-2.5 flex items-center gap-1.5">
          <h3 className="text-sm font-bold text-foreground">
            {profile.companyName || 'Your Company'}
          </h3>
          {profile.isApproved && (
            <i
              className="ti ti-rosette-discount-check-filled text-brand-sky"
              aria-hidden="true"
              title="Verified Employer"
            />
          )}
        </div>
        {profile.industry && (
          <p className="mt-0.5 text-xs text-muted-foreground">{profile.industry}</p>
        )}

        <div className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
          {profile.location && (
            <span>
              <i className="ti ti-map-pin mr-1" aria-hidden="true" />
              {profile.location}
            </span>
          )}
          {profile.companySize && (
            <span>
              <i className="ti ti-users mr-1" aria-hidden="true" />
              {profile.companySize} employees
            </span>
          )}
          {profile.foundedYear && (
            <span>
              <i className="ti ti-calendar mr-1" aria-hidden="true" />
              Founded {profile.foundedYear}
            </span>
          )}
        </div>

        {profile.description && (
          <p className="mt-3 line-clamp-4 text-left text-xs text-muted-foreground">
            {profile.description}
          </p>
        )}

        {(profile.website || profile.linkedinUrl || profile.twitterUrl) && (
          <div className="mt-4 flex w-full flex-col gap-1.5 border-t border-border pt-3 text-left text-xs">
            {profile.website && (
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-brand-sky hover:underline"
              >
                <i className="ti ti-world" aria-hidden="true" />
                Website
              </a>
            )}
            {profile.linkedinUrl && (
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-brand-sky hover:underline"
              >
                <i className="ti ti-brand-linkedin" aria-hidden="true" />
                LinkedIn
              </a>
            )}
            {profile.twitterUrl && (
              <a
                href={profile.twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-brand-sky hover:underline"
              >
                <i className="ti ti-brand-x" aria-hidden="true" />
                Twitter / X
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
