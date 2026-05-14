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
    <div className="space-y-4">
      {/* Divider */}
      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
          OR
        </span>
        <Separator className="flex-1" />
      </div>

      {/* OAuth Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="outline"
          className="h-12 w-full cursor-pointer gap-2 border-border font-semibold transition-all duration-150 hover:bg-muted/60"
          onClick={handleGoogleAuth}
          aria-label="Continue with Google"
        >
          <GoogleIcon className="size-4 shrink-0" />
          Google
        </Button>

        <Button
          type="button"
          variant="outline"
          className="h-12 w-full cursor-pointer gap-2 border-border font-semibold transition-all duration-150 hover:bg-muted/60"
          onClick={handleLinkedInAuth}
          aria-label="Continue with LinkedIn"
        >
          <LinkedInIcon className="size-4 shrink-0" />
          LinkedIn
        </Button>
      </div>
    </div>
  );
}
