'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { toast } from 'sonner';

import { cn } from '@lib/utils';
import { Button } from '@ui/button';
import { Separator } from '@ui/separator';
import { Switch } from '@ui/switch';

type Visibility = 'public' | 'registered' | 'hidden';

interface State {
  profileVisibility: Visibility;
  resumeVisibility: 'everyone' | 'verified' | 'nobody';
  showInSearch: boolean;
  showProfileViews: boolean;
  allowMessaging: boolean;
}

const VISIBILITY_OPTS: { value: Visibility; label: string; desc: string }[] = [
  { value: 'public', label: 'Public', desc: 'Anyone on the internet can see your profile' },
  {
    value: 'registered',
    label: 'Registered Users',
    desc: 'Only signed-in CareerArch members can view',
  },
  { value: 'hidden', label: 'Hidden', desc: 'Your profile is not visible to anyone' },
];

const RESUME_OPTS: { value: State['resumeVisibility']; label: string }[] = [
  { value: 'everyone', label: 'Everyone' },
  { value: 'verified', label: 'Verified companies only' },
  { value: 'nobody', label: 'Nobody (private)' },
];

export default function PrivacySettingsPage(): React.JSX.Element {
  const [state, setState] = useState<State>({
    profileVisibility: 'registered',
    resumeVisibility: 'verified',
    showInSearch: true,
    showProfileViews: true,
    allowMessaging: true,
  });

  function set<K extends keyof State>(key: K, val: State[K]): void {
    setState((p) => ({ ...p, [key]: val }));
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col gap-4"
    >
      {/* Profile visibility */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
        <h2 className="mb-1 text-[14px] font-bold text-foreground">Profile Visibility</h2>
        <p className="mb-4 text-[12px] text-muted-foreground">Control who can see your profile</p>
        <div className="flex flex-col gap-2">
          {VISIBILITY_OPTS.map((opt) => (
            <label
              key={opt.value}
              className={cn(
                'flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-colors hover:bg-muted/40',
                state.profileVisibility === opt.value
                  ? 'border-brand-sky bg-brand-sky/5'
                  : 'border-border',
              )}
            >
              <input
                type="radio"
                name="profileVisibility"
                value={opt.value}
                checked={state.profileVisibility === opt.value}
                onChange={() => set('profileVisibility', opt.value)}
                className="size-4 accent-brand-sky"
              />
              <div>
                <p className="text-[13px] font-semibold text-foreground">{opt.label}</p>
                <p className="text-[11px] text-muted-foreground">{opt.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Resume visibility */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
        <h2 className="mb-1 text-[14px] font-bold text-foreground">Resume Visibility</h2>
        <p className="mb-4 text-[12px] text-muted-foreground">Who can download your resume</p>
        <div className="flex flex-col gap-2">
          {RESUME_OPTS.map((opt) => (
            <label
              key={opt.value}
              className={cn(
                'flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-colors hover:bg-muted/40',
                state.resumeVisibility === opt.value
                  ? 'border-brand-sky bg-brand-sky/5'
                  : 'border-border',
              )}
            >
              <input
                type="radio"
                name="resumeVisibility"
                value={opt.value}
                checked={state.resumeVisibility === opt.value}
                onChange={() => set('resumeVisibility', opt.value)}
                className="size-4 accent-brand-sky"
              />
              <p className="text-[13px] font-semibold text-foreground">{opt.label}</p>
            </label>
          ))}
        </div>
      </div>

      {/* Other toggles */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
        <h2 className="mb-3 text-[14px] font-bold text-foreground">Other Privacy Settings</h2>
        <Separator className="mb-2" />
        {[
          {
            key: 'showInSearch' as const,
            label: 'Show me in recruiter searches',
            desc: 'Let recruiters find you through skill and experience searches',
          },
          {
            key: 'showProfileViews' as const,
            label: 'Profile view notifications',
            desc: 'Get notified when companies view your profile',
          },
          {
            key: 'allowMessaging' as const,
            label: 'Allow recruiter messaging',
            desc: 'Let verified companies send you direct messages',
          },
        ].map(({ key, label, desc }) => (
          <div key={key} className="flex items-center justify-between gap-4 py-3">
            <div>
              <p className="text-[13px] font-semibold text-foreground">{label}</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">{desc}</p>
            </div>
            <Switch
              checked={state[key] as boolean}
              onCheckedChange={(v) => set(key, v)}
              className="shrink-0 data-[state=checked]:bg-brand-sky"
            />
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <Button
          onClick={() => toast.success('Privacy settings saved')}
          className="rounded-xl bg-brand-navy font-bold text-white hover:bg-brand-navy/90"
        >
          Save Privacy Settings
        </Button>
      </div>
    </motion.div>
  );
}
