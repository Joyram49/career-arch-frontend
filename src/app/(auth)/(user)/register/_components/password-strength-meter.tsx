'use client';

// ── Password Strength Meter ─────────────────────────────────────
// Renders a segmented bar + criteria checklist below the password field.

interface PasswordCriteria {
  met: boolean;
  label: string;
}

interface PasswordStrengthProps {
  password: string;
}

function getStrengthLevel(password: string): {
  score: number; // 0–4
  label: string;
  color: string;
} {
  if (!password) return { score: 0, label: '', color: '' };

  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const levels = [
    { score: 1, label: 'WEAK SECURITY', color: 'bg-brand-red' },
    { score: 2, label: 'MODERATE SECURITY', color: 'bg-brand-amber' },
    { score: 3, label: 'GOOD SECURITY', color: 'bg-brand-sky' },
    { score: 4, label: 'STRONG SECURITY', color: 'bg-brand-emerald' },
  ];

  return levels[score - 1] ?? { score: 0, label: '', color: '' };
}

export function PasswordStrengthMeter({ password }: PasswordStrengthProps): React.JSX.Element {
  const { score, label, color } = getStrengthLevel(password);

  const criteria: PasswordCriteria[] = [
    { met: password.length >= 8, label: 'At least 8 characters' },
    { met: /[A-Z]/.test(password), label: 'One uppercase letter' },
    { met: /[0-9]/.test(password), label: 'One number' },
    { met: /[^A-Za-z0-9]/.test(password), label: 'One special character (!@#$)' },
  ];

  if (!password) return <></>;

  return (
    <div className="mt-2.5 space-y-2.5">
      {/* Segmented strength bar */}
      <div className="flex items-center gap-1.5">
        {[1, 2, 3, 4].map((seg) => (
          <div
            key={seg}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              seg <= score ? color : 'bg-border'
            }`}
          />
        ))}
      </div>

      {/* Strength label */}
      {label && (
        <p
          className={`text-[10px] font-bold tracking-widest uppercase transition-colors ${
            score === 1
              ? 'text-brand-red'
              : score === 2
                ? 'text-brand-amber'
                : score === 3
                  ? 'text-brand-sky'
                  : 'text-brand-emerald'
          }`}
        >
          {label}
        </p>
      )}

      {/* Criteria checklist — 2 column grid on desktop */}
      <ul
        className="grid grid-cols-1 gap-y-1.5 sm:grid-cols-2"
        role="list"
        aria-label="Password requirements"
      >
        {criteria.map((c) => (
          <li key={c.label} className="flex items-center gap-2">
            {c.met ? (
              <svg
                viewBox="0 0 16 16"
                fill="none"
                className="size-4 shrink-0 text-brand-emerald"
                aria-hidden="true"
              >
                <circle cx="8" cy="8" r="7.25" stroke="currentColor" strokeWidth="1.25" />
                <path
                  d="M5 8.5L7 10.5L11 6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg
                viewBox="0 0 16 16"
                fill="none"
                className="size-4 shrink-0 text-muted-foreground/40"
                aria-hidden="true"
              >
                <circle cx="8" cy="8" r="7.25" stroke="currentColor" strokeWidth="1.25" />
              </svg>
            )}
            <span
              className={`text-xs font-medium transition-colors ${
                c.met ? 'text-brand-emerald' : 'text-muted-foreground'
              }`}
            >
              {c.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
