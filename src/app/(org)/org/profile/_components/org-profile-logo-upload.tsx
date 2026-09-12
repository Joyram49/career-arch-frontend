'use client';

import { useUploadOrgLogo } from '@queries/org/use-org-profile';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

const MAX_SIZE_BYTES = 2 * 1024 * 1024;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

interface OrgProfileLogoUploadProps {
  logoUrl: string | null;
  companyName: string;
}

export function OrgProfileLogoUpload({
  logoUrl,
  companyName,
}: OrgProfileLogoUploadProps): React.JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadLogo = useUploadOrgLogo();
  const [preview, setPreview] = useState<string | null>(logoUrl);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error('Please upload a JPEG, PNG, or WEBP image');
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      toast.error('Logo must be under 2MB');
      return;
    }

    setPreview(URL.createObjectURL(file));
    uploadLogo.mutate(file);
    e.target.value = '';
  }

  const initials = companyName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex items-center gap-4">
      <div className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-muted">
        {preview ? (
          <Image
            src={preview}
            alt={`${companyName} logo`}
            fill
            unoptimized
            className="object-cover"
          />
        ) : (
          <span className="text-lg font-bold text-muted-foreground">{initials || '?'}</span>
        )}
        {uploadLogo.isPending && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <i className="ti ti-loader-2 animate-spin text-white" aria-hidden="true" />
          </div>
        )}
      </div>
      <div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploadLogo.isPending}
          className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition hover:bg-muted disabled:opacity-50"
        >
          {logoUrl ? 'Change Logo' : 'Upload Logo'}
        </button>
        <p className="mt-1 text-[11px] text-muted-foreground">JPEG, PNG or WEBP — max 2MB</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}
