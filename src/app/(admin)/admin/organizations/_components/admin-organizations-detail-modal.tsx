'use client';

import { type IAdminOrgListItem } from '@app-types/admin/admin.dashboard.orgs';
import { GeneralModal, type ModalAction } from '@components/shared/general-modal';
import { format } from 'date-fns';
import { formatCents, orgLocationLabel } from './admin-organizations-utils';

interface AdminOrganizationDetailModalProps {
  organization: IAdminOrgListItem | null;
  onClose: () => void;
  onRequestApprove: (org: IAdminOrgListItem) => void;
  onRequestSuspend: (org: IAdminOrgListItem) => void;
  onRequestActivate: (org: IAdminOrgListItem) => void;
}

export function AdminOrganizationDetailModal({
  organization,
  onClose,
  onRequestApprove,
  onRequestSuspend,
  onRequestActivate,
}: AdminOrganizationDetailModalProps): React.JSX.Element {
  const actions: ModalAction[] = organization
    ? [
        ...(!organization.isApproved
          ? [
              {
                label: 'Approve',
                className: 'bg-brand-emerald text-white hover:bg-brand-emerald/90',
                onClick: () => {
                  onRequestApprove(organization);
                  onClose();
                },
              },
            ]
          : []),
        ...(organization.isActive
          ? [
              {
                label: 'Suspend',
                variant: 'outline' as const,
                className: 'border-amber-300 text-amber-700 hover:bg-amber-50',
                onClick: () => {
                  onRequestSuspend(organization);
                  onClose();
                },
              },
            ]
          : [
              {
                label: 'Activate',
                variant: 'outline' as const,
                className: 'border-emerald-300 text-emerald-700 hover:bg-emerald-50',
                onClick: () => {
                  onRequestActivate(organization);
                  onClose();
                },
              },
            ]),
      ]
    : [];

  return (
    <GeneralModal
      open={organization !== null}
      onOpenChange={(open) => !open && onClose()}
      title={organization?.profile?.companyName ?? ''}
      size="md"
      actions={actions}
    >
      {organization && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-muted-foreground">Email</span>
              <p className="font-medium text-foreground">{organization.email}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Industry</span>
              <p className="font-medium text-foreground">{organization.profile?.industry ?? '—'}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Company Size</span>
              <p className="font-medium text-foreground">
                {organization.profile?.companySize ?? '—'}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Location</span>
              <p className="font-medium text-foreground">
                {orgLocationLabel(organization.profile)}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Jobs Posted</span>
              <p className="font-medium text-foreground">{organization._count.jobs}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Total Hires</span>
              <p className="font-medium text-foreground">{organization.hiredCount}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Joined</span>
              <p className="font-medium text-foreground">
                {format(new Date(organization.createdAt), 'dd, MMM yyyy')}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Last Login</span>
              <p className="font-medium text-foreground">
                {organization.lastLoginAt
                  ? format(new Date(organization.lastLoginAt), 'dd, MMM yyyy')
                  : 'Never'}
              </p>
            </div>
          </div>

          {organization.incentives.unpaidAmountCents > 0 && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              <strong>Incentives unpaid:</strong>{' '}
              {formatCents(organization.incentives.unpaidAmountCents)} across{' '}
              {organization.incentives.unpaidCount} incentive
              {organization.incentives.unpaidCount === 1 ? '' : 's'}
            </div>
          )}
        </div>
      )}
    </GeneralModal>
  );
}
