/* eslint-disable @typescript-eslint/explicit-function-return-type */
'use client';

import { APIKit } from '@lib/axios';
import { useQuery } from '@tanstack/react-query';

export function useAdminIncentiveStats() {
  return useQuery({
    queryKey: ['admin-incentive-stats'],
    queryFn: async () => {
      const response = await APIKit.admin.incentives.getStats();
      return response.data.data?.stats;
    },
    // Stats don't need to be second-by-second fresh — 1 min stale time avoids
    // refetching on every list-page filter/pagination change (list query is separate).
    staleTime: 1000 * 60,
  });
}
