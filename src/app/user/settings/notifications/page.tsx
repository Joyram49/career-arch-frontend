'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@ui/button';
import { Separator } from '@ui/separator';
import { Switch } from '@ui/switch';

interface ToggleRowProps {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}
function ToggleRow({
  id,
  label,
  description,
  checked,
  onChange,
}: ToggleRowProps): React.JSX.Element {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="min-w-0">
        <p className="text-[13px] font-semibold text-foreground">{label}</p>
        <p className="mt-0.5 text-[11px] text-muted-foreground">{description}</p>
      </div>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onChange}
        className="shrink-0 data-[state=checked]:bg-brand-sky"
      />
    </div>
  );
}

type Prefs = {
  email: { applications: boolean; matches: boolean; profileViews: boolean; weeklyDigest: boolean };
  push: { applications: boolean; matches: boolean; profileViews: boolean };
  frequency: 'immediate' | 'daily' | 'weekly';
};

const DEFAULT_PREFS: Prefs = {
  email: { applications: true, matches: true, profileViews: false, weeklyDigest: true },
  push: { applications: true, matches: false, profileViews: false },
  frequency: 'immediate',
};

export default function NotificationSettingsPage(): React.JSX.Element {
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS);

  function setEmail(key: keyof Prefs['email'], val: boolean): void {
    setPrefs((p) => ({ ...p, email: { ...p.email, [key]: val } }));
  }
  function setPush(key: keyof Prefs['push'], val: boolean): void {
    setPrefs((p) => ({ ...p, push: { ...p.push, [key]: val } }));
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col gap-4"
    >
      {/* Email notifications */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
        <h2 className="mb-0.5 text-[14px] font-bold text-foreground">Email Notifications</h2>
        <p className="mb-2 text-[12px] text-muted-foreground">
          Choose which emails you'd like to receive
        </p>
        <Separator className="mb-1" />
        <ToggleRow
          id="email-apps"
          label="Application updates"
          description="Status changes on your applications"
          checked={prefs.email.applications}
          onChange={(v) => setEmail('applications', v)}
        />
        <ToggleRow
          id="email-matches"
          label="New job matches"
          description="Jobs that match your profile and skills"
          checked={prefs.email.matches}
          onChange={(v) => setEmail('matches', v)}
        />
        <ToggleRow
          id="email-views"
          label="Profile views"
          description="When recruiters view your profile"
          checked={prefs.email.profileViews}
          onChange={(v) => setEmail('profileViews', v)}
        />
        <ToggleRow
          id="email-digest"
          label="Weekly digest"
          description="A weekly summary of your activity"
          checked={prefs.email.weeklyDigest}
          onChange={(v) => setEmail('weeklyDigest', v)}
        />
      </div>

      {/* Push notifications */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
        <h2 className="mb-0.5 text-[14px] font-bold text-foreground">Push Notifications</h2>
        <p className="mb-2 text-[12px] text-muted-foreground">In-app and browser notifications</p>
        <Separator className="mb-1" />
        <ToggleRow
          id="push-apps"
          label="Application updates"
          description="Real-time application status alerts"
          checked={prefs.push.applications}
          onChange={(v) => setPush('applications', v)}
        />
        <ToggleRow
          id="push-matches"
          label="New job matches"
          description="Instant alerts for matching roles"
          checked={prefs.push.matches}
          onChange={(v) => setPush('matches', v)}
        />
        <ToggleRow
          id="push-views"
          label="Profile views"
          description="When recruiters view your profile"
          checked={prefs.push.profileViews}
          onChange={(v) => setPush('profileViews', v)}
        />
      </div>

      {/* Frequency */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
        <h2 className="mb-3 text-[14px] font-bold text-foreground">Email Frequency</h2>
        <div className="flex flex-col gap-2">
          {(['immediate', 'daily', 'weekly'] as const).map((opt) => (
            <label
              key={opt}
              className="flex cursor-pointer items-center gap-3 rounded-xl border border-border p-3 hover:bg-muted/40 has-checked:border-brand-sky has-checked:bg-brand-sky/5"
            >
              <input
                type="radio"
                name="frequency"
                value={opt}
                checked={prefs.frequency === opt}
                onChange={() => setPrefs((p) => ({ ...p, frequency: opt }))}
                className="size-4 accent-brand-sky"
              />
              <div>
                <p className="text-[13px] font-semibold text-foreground capitalize">{opt}</p>
                <p className="text-[11px] text-muted-foreground">
                  {opt === 'immediate'
                    ? 'Get notified as events happen'
                    : opt === 'daily'
                      ? 'One summary email per day'
                      : 'One summary email per week'}
                </p>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={() => toast.success('Notification preferences saved')}
          className="rounded-xl bg-brand-navy font-bold text-white hover:bg-brand-navy/90"
        >
          Save Preferences
        </Button>
      </div>
    </motion.div>
  );
}
