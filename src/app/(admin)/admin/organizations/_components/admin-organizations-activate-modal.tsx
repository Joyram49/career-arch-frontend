'use client';

import { type IAdminOrgListItem } from '@app-types/admin/admin.dashboard.orgs';
import { GeneralModal } from '@components/shared/general-modal';

interface AdminOrganizationActivateModalProps {
  organization: IAdminOrgListItem | null;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: (id: string) => void;
}

export function AdminOrganizationActivateModal({
  organization,
  isSubmitting,
  onClose,
  onConfirm,
}: AdminOrganizationActivateModalProps): React.JSX.Element {
  return (
    <GeneralModal
      open={organization !== null}
      onOpenChange={(open) => !open && onClose()}
      title={`Reactivate ${organization?.profile?.companyName ?? ''}?`}
      description="This organization will immediately regain the ability to post jobs and access billing."
      size="sm"
      actions={[
        { label: 'Cancel', variant: 'outline', onClick: onClose },
        {
          label: isSubmitting ? 'Activating…' : 'Reactivate Organization',
          className: 'bg-brand-emerald text-white hover:bg-brand-emerald/90',
          onClick: () => {
            if (isSubmitting || !organization) return;
            onConfirm(organization.id);
          },
        },
      ]}
    >
      <p className="text-sm text-muted-foreground">
        This reverses a suspension — no additional review is required.
      </p>
    </GeneralModal>
  );
}
