'use client';

import { GoogleIcon, LinkedInIcon } from '@assets/icons/custom';
import { Button } from '@ui/button';
import { Separator } from '@ui/separator';

export function SocialAuth(): React.JSX.Element {
  function handleGoogleAuth(): void {
    // TODO: Trigger Google OAuth — Phase 5
    console.warn('Google OAuth coming in Phase 5');
  }

  function handleLinkedInAuth(): void {
    // TODO: Trigger LinkedIn OAuth — Phase 5
    console.warn('LinkedIn OAuth coming in Phase 5');
  }

  return (
    <div className="space-y-3">
      {/* Desktop: side-by-side — Mobile: stacked (Google outline, LinkedIn filled) */}
      <div className="flex flex-col gap-3 sm:flex-row">
        {/* Google — outline style */}
        <Button
          type="button"
          variant="outline"
          className="h-12 w-full cursor-pointer gap-2.5 border-border font-semibold transition-all duration-150 hover:bg-muted/60 sm:flex-1"
          onClick={handleGoogleAuth}
          aria-label="Continue with Google"
        >
          <GoogleIcon className="size-[18px] shrink-0" />
          <span>Continue with Google</span>
        </Button>

        {/* LinkedIn — filled navy style (matches Figma mobile) */}
        <Button
          type="button"
          className="h-12 w-full cursor-pointer gap-2.5 bg-brand-navy font-semibold text-white transition-all duration-150 hover:bg-brand-navy/90 sm:flex-1"
          onClick={handleLinkedInAuth}
          aria-label="Continue with LinkedIn"
        >
          <LinkedInIcon className="size-[18px] shrink-0" />
          <span>Continue with LinkedIn</span>
        </Button>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 py-1">
        <Separator className="flex-1" />
        <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
          OR CONTINUE WITH EMAIL
        </span>
        <Separator className="flex-1" />
      </div>
    </div>
  );
}
