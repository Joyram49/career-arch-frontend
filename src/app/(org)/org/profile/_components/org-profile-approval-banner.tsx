import Link from 'next/link';

import type { IOrgProfile } from '@app-types/org/org.profile';

interface OrgProfileApprovalBannerProps {
  profile: IOrgProfile;
}

export function OrgProfileApprovalBanner({
  profile,
}: OrgProfileApprovalBannerProps): React.JSX.Element | null {
  if (!profile.isApproved) {
    return (
      <div className="mx-6 mt-4 flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        <i className="ti ti-clock shrink-0 text-base" aria-hidden="true" />
        <p>
          Your organization is <strong>pending approval</strong>. Feel free to complete your profile
          now — it goes live once our team approves your account, usually within 1–2 business days.
        </p>
      </div>
    );
  }

  if (!profile.isPaymentMethodOnFile) {
    return (
      <div className="mx-6 mt-4 flex items-center justify-between gap-3 rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-800">
        <p>
          <i className="ti ti-credit-card mr-1.5" aria-hidden="true" />
          Add a payment method to unlock job posting and pay hiring incentives.
        </p>
        <Link href="/org/billing" className="shrink-0 font-medium underline">
          Go to Billing
        </Link>
      </div>
    );
  }

  return null;
}
