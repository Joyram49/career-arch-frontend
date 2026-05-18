import { motion } from 'framer-motion';

interface StrengthBarProps {
  password: string;
}

interface StrengthMeta {
  score: number;
  label: string;
  percent: number;
  colorClass: string;
  textClass: string;
}

function getStrengthMeta(password: string): StrengthMeta {
  if (!password) {
    return {
      score: 0,
      label: '',
      percent: 0,
      colorClass: 'bg-border',
      textClass: 'text-muted-foreground',
    };
  }

  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const meta: Omit<StrengthMeta, 'score'>[] = [
    { label: 'WEAK', percent: 25, colorClass: 'bg-brand-red', textClass: 'text-brand-red' },
    { label: 'MODERATE', percent: 50, colorClass: 'bg-brand-amber', textClass: 'text-brand-amber' },
    { label: 'PROFESSIONAL', percent: 75, colorClass: 'bg-brand-sky', textClass: 'text-brand-sky' },
    {
      label: 'STRONG',
      percent: 100,
      colorClass: 'bg-brand-emerald',
      textClass: 'text-brand-emerald',
    },
  ];

  const result = meta[score - 1]!;
  return { score, ...result };
}

export function InlineStrengthBar({ password }: StrengthBarProps): React.JSX.Element {
  const { label, percent, colorClass, textClass } = getStrengthMeta(password);

  if (!password) return <></>;

  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
          Strength: <span className={textClass}>{label}</span>
        </span>
        <span className={`text-[11px] font-bold ${textClass}`}>{percent}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
        <motion.div
          className={`h-full rounded-full ${colorClass}`}
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const }}
        />
      </div>
    </div>
  );
}
