/* eslint-disable @typescript-eslint/explicit-function-return-type */
'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import type { IOrgProfile } from '@app-types/org/org.profile';
import type { OrgProfileFormInput } from '@validations/org.profile.schema';

/**
 * ── MOCK DATA LAYER — Phase 4B design pass ──────────────────────────────
 * Real endpoints are fully implemented already: GET /org/profile,
 * PUT /org/profile, POST /org/profile/logo (org.profile.controller.ts /
 * org.profile.service.ts). This mock mirrors that exact response shape —
 * see README for the swap.
 */

async function mockDelay<T>(data: T, ms = 500): Promise<T> {
  await new Promise((resolve) => setTimeout(resolve, ms));
  return data;
}

let MOCK_PROFILE: IOrgProfile = {
  id: 'profile-1',
  orgId: 'org-1',
  companyName: 'TechCorp',
  logoUrl: null,
  website: 'https://techcorp.example.com',
  industry: 'Technology',
  companySize: '51-200',
  foundedYear: 2015,
  description:
    'TechCorp builds developer tools that help engineering teams ship faster with confidence. We are a remote-first company with a strong focus on craft, ownership, and thoughtful engineering.',
  location: 'San Francisco, CA',
  country: 'United States',
  linkedinUrl: 'https://linkedin.com/company/techcorp',
  twitterUrl: '',
  email: 'techcorp@careerarch.com',
  isApproved: true,
  isPaymentMethodOnFile: true,
  hasUnpaidIncentives: false,
  createdAt: new Date(Date.now() - 200 * 86_400_000).toISOString(),
  updatedAt: new Date(Date.now() - 5 * 86_400_000).toISOString(),
};

export function useOrgProfile() {
  return useQuery({
    queryKey: ['org-profile'],
    queryFn: () => mockDelay({ ...MOCK_PROFILE }),
    staleTime: 1000 * 60,
  });
}

export function useUpdateOrgProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: OrgProfileFormInput) => {
      MOCK_PROFILE = {
        ...MOCK_PROFILE,
        ...payload,
        website: payload.website ?? null,
        industry: payload.industry ?? null,
        companySize: payload.companySize ?? null,
        foundedYear: payload.foundedYear ?? null,
        location: payload.location ?? null,
        country: payload.country ?? null,
        linkedinUrl: payload.linkedinUrl ?? null,
        twitterUrl: payload.twitterUrl ?? null,
        updatedAt: new Date().toISOString(),
      };
      return mockDelay({ ...MOCK_PROFILE });
    },
    onSuccess: () => {
      toast.success('Company profile updated successfully');
      void qc.invalidateQueries({ queryKey: ['org-profile'] });
    },
    onError: () => toast.error('Failed to update profile'),
  });
}

export function useUploadOrgLogo() {
  const qc = useQueryClient();
  return useMutation({
    // Real endpoint: multipart/form-data POST with a `logo` field, returns
    // { logoUrl } from Cloudinary. Mock: a local object URL for preview.
    mutationFn: async (file: File) => {
      const logoUrl = URL.createObjectURL(file);
      MOCK_PROFILE = { ...MOCK_PROFILE, logoUrl };
      return mockDelay({ logoUrl }, 800);
    },
    onSuccess: () => {
      toast.success('Logo uploaded');
      void qc.invalidateQueries({ queryKey: ['org-profile'] });
    },
    onError: () => toast.error('Failed to upload logo'),
  });
}
