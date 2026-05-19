'use client';

import { verifyEmail } from '@services/org/auth.service';
import { useEffect, useState } from 'react';
import { EmailVerificationErrorCard } from './email-verification-error-card';
import { EmailVerificationLoadingCard } from './email-verification-loading-card';
import { EmailVerifiedCard } from './email-verified-card';

interface Props {
  token?: string;
}
type Status = 'loading' | 'success' | 'error';

export function EmailVerifyOrgStatus({ token }: Props): React.JSX.Element {
  const [status, setStatus] = useState<Status>('loading');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    async function executeVerification(): Promise<void> {
      if (!token) {
        setStatus('error');
        setMessage('Verification token is missing or invalid.');
        return;
      }
      const result = await verifyEmail({
        token,
      });

      if (!result.success) {
        setStatus('error');
        setMessage(result.message);
        return;
      }
      setStatus('success');
    }
    void executeVerification();
  }, [token]);

  if (status === 'loading') return <EmailVerificationLoadingCard />;
  if (status === 'error') return <EmailVerificationErrorCard message={message} />;
  return <EmailVerifiedCard />;
}
