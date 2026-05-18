'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ModeToggle(): React.JSX.Element {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-9 w-20 rounded-full border border-border bg-background/50" />;
  }

  const current = theme === 'system' ? resolvedTheme : theme;

  const isDark = current === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="relative flex h-9 w-20 rotate-90 items-center rounded-full border border-border bg-background p-1 transition-colors"
      aria-label="Toggle theme"
    >
      {/* slider */}
      <div
        className={[
          'absolute top-1 left-1 h-7 w-9 rounded-full transition-all duration-300',
          isDark ? 'translate-x-9 bg-brand-navy' : 'translate-x-0 bg-brand-sky',
        ].join(' ')}
      />

      {/* icons */}
      <div className="relative z-10 flex w-full items-center justify-between px-2">
        <Sun
          className={[
            'h-4 w-4 transition-colors',
            !isDark ? 'text-white' : 'text-muted-foreground',
          ].join(' ')}
        />
        <Moon
          className={[
            'h-4 w-4 transition-colors',
            isDark ? 'text-white' : 'text-muted-foreground',
          ].join(' ')}
        />
      </div>
    </button>
  );
}
