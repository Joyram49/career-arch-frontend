'use client';

import { type IAdminTransactionListItem } from '@app-types/admin/admin.dashboard.transactions';
import { GeneralModal } from '@components/shared/general-modal';
import { APIKit } from '@lib/axios';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { StatusBadge } from '../../_components/shared';
import { formatCents } from './admin-transactions-utils';

interface AdminTransactionDetailModalProps {
  transaction: IAdminTransactionListItem | null;
  onClose: () => void;
}

export function AdminTransactionDetailModal({
  transaction,
  onClose,
}: AdminTransactionDetailModalProps): React.JSX.Element {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-transaction', transaction?.id],
    queryFn: async () => {
      const response = await APIKit.admin.transactions.getById(transaction?.id as string);
      return response.data;
    },
    enabled: transaction !== null,
  });

  const detail = data?.data?.transaction ?? transaction;

  return (
    <GeneralModal
      open={transaction !== null}
      onOpenChange={(open) => !open && onClose()}
      title="Transaction Detail"
      size="md"
    >
      {detail && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-muted-foreground">Amount</span>
              <p className="font-medium text-foreground">{formatCents(detail.amountCents)}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Status</span>
              <p className="mt-0.5">
                <StatusBadge
                  status={
                    detail.status.toLowerCase() as 'succeeded' | 'pending' | 'failed' | 'refunded'
                  }
                />
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Type</span>
              <p className="font-medium text-foreground capitalize">{detail.type.toLowerCase()}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Currency</span>
              <p className="font-medium text-foreground uppercase">{detail.currency}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Party</span>
              <p className="font-medium text-foreground">
                {detail.user?.name ?? detail.organization?.companyName ?? '—'}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Date</span>
              <p className="font-medium text-foreground">
                {format(new Date(detail.createdAt), 'dd MMM yyyy, HH:mm')}
              </p>
            </div>
            <div className="col-span-2">
              <span className="text-muted-foreground">Description</span>
              <p className="font-medium text-foreground">{detail.description ?? '—'}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Payment Intent</span>
              <p className="font-mono text-xs text-foreground">
                {detail.stripePaymentIntentId ?? '—'}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Refund ID</span>
              <p className="font-mono text-xs text-foreground">{detail.stripeRefundId ?? '—'}</p>
            </div>
          </div>

          {'metaData' in detail && detail.metaData !== null && detail.metaData !== undefined && (
            <div>
              <span className="text-xs text-muted-foreground">Raw Metadata</span>
              <pre className="mt-1 max-h-40 overflow-auto rounded-lg border border-border bg-muted/40 p-3 text-[11px] text-foreground">
                {JSON.stringify(detail.metaData, null, 2)}
              </pre>
            </div>
          )}

          {isLoading && <p className="text-xs text-muted-foreground">Loading full details…</p>}
        </div>
      )}
    </GeneralModal>
  );
}
