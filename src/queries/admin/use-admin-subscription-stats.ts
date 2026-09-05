/* eslint-disable @typescript-eslint/explicit-function-return-type */
'use client';

import { APIKit } from '@lib/axios';
import { useQuery } from '@tanstack/react-query';

export function useAdminSubscriptionStats() {
  return useQuery({
    queryKey: ['admin-subscription-stats'],
    queryFn: async () => {
      const response = await APIKit.admin.subscriptions.getStats();
      return response.data.data?.stats;
    },
    // Stats don't need to be second-by-second fresh — 1 min stale time avoids
    // refetching on every list-page filter change (list query is separate).
    staleTime: 1000 * 60,
  });
}
