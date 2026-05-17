interface Requirement {
  met: boolean;
  label: string;
  badge: string;
}

export function RequirementsCard({ password }: { password: string }): React.JSX.Element {
  const requirements: Requirement[] = [
    { met: password.length >= 8, label: 'Minimum 8 characters', badge: 'MIN_8' },
    { met: /[A-Z]/.test(password), label: 'At least one uppercase letter', badge: 'A-Z' },
    { met: /[0-9]/.test(password), label: 'Includes at least one number', badge: '0-9' },
    {
      met: /[^A-Za-z0-9]/.test(password),
      label: 'Includes a special character (@, #, $)',
      badge: '!@#',
    },
  ];

  return (
    <div className="rounded-xl border border-border bg-muted/30 p-4">
      <p className="mb-3 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
        Password Requirements
      </p>
      <ul className="space-y-2.5" role="list" aria-label="Password requirements">
        {requirements.map((req) => (
          <li key={req.label} className="flex items-center gap-3">
            {req.met ? (
              <svg
                viewBox="0 0 20 20"
                fill="none"
                className="size-5 shrink-0 text-brand-emerald"
                aria-hidden="true"
              >
                <circle
                  cx="10"
                  cy="10"
                  r="9"
                  fill="currentColor"
                  fillOpacity="0.15"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M6.5 10.5L9 13L13.5 7.5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg
                viewBox="0 0 20 20"
                fill="none"
                className="size-5 shrink-0 text-muted-foreground/40"
                aria-hidden="true"
              >
                <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            )}
            <span
              className={`flex-1 text-sm font-medium ${req.met ? 'text-foreground' : 'text-muted-foreground'}`}
            >
              {req.label}
            </span>
            {/* Badge tag — mobile-style hidden on desktop, shown via responsive class */}
            <span
              className={`hidden rounded px-1.5 py-0.5 font-mono text-[10px] font-bold sm:block lg:hidden xl:block ${req.met ? 'bg-brand-emerald/10 text-brand-emerald' : 'bg-muted text-muted-foreground'}`}
            >
              {req.badge}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
