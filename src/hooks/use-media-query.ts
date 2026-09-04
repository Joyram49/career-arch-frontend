// src/hooks/use-media-query.ts
'use client';

import { useSyncExternalStore } from 'react';

/**
 * SSR-safe media query hook. Defaults to `false` on the server and during
 * the first client render to avoid a hydration mismatch, then syncs on
 * mount. If this file already exists in the repo (it's listed in the
 * README's hooks/ section), skip this one and just reuse yours — the
 * ResponsiveModal only needs the `(query: string) => boolean` signature.
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onStoreChange) => {
      const mediaQueryList = window.matchMedia(query);
      const listener = (): void => onStoreChange();

      mediaQueryList.addEventListener('change', listener);
      return () => mediaQueryList.removeEventListener('change', listener);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}
