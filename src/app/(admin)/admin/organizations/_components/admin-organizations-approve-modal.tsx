'use client';

import { type IAdminOrgListItem } from '@app-types/admin/admin.dashboard.orgs';
import { GeneralModal } from '@components/shared/general-modal';

interface AdminOrganizationApproveModalProps {
  organization: IAdminOrgListItem | null;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: (id: string) => void;
}

export function AdminOrganizationApproveModal({
  organization,
  isSubmitting,
  onClose,
  onConfirm,
}: AdminOrganizationApproveModalProps): React.JSX.Element {
  return (
    <GeneralModal
      open={organization !== null}
      onOpenChange={(open) => !open && onClose()}
      title={`Approve ${organization?.profile?.companyName ?? ''}?`}
      description="This creates a Stripe customer for the organization and grants full access to post jobs immediately."
      size="sm"
      actions={[
        { label: 'Cancel', variant: 'outline', onClick: onClose },
        {
          label: isSubmitting ? 'Approving…' : 'Approve Organization',
          className: 'bg-brand-emerald text-white hover:bg-brand-emerald/90',
          onClick: () => {
            if (isSubmitting || !organization) return;
            onConfirm(organization.id);
          },
        },
      ]}
    >
      <p className="text-sm text-muted-foreground">
        Once approved, the organization can be suspended again at any time, but re-approval is not
        needed after that.
      </p>
    </GeneralModal>
  );
}
