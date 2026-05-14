'use client';

import ContainerLayout from '@components/layout/ContainerLayout';
import { useState } from 'react';

// ─── Main Login Page ──────────────────────────────────────────────────────────
export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <ContainerLayout className="px-8">
      <div className="w-full"></div>
    </ContainerLayout>
  );
}
