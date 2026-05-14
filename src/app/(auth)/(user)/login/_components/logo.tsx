import Image from 'next/image';
import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3">
      <div className="flex size-10 items-center justify-center rounded-xl bg-brand-navy">
        <Image src="/Icon.svg" alt="CareerArch" width={24} height={24} priority />
      </div>

      <span className="text-lg font-bold tracking-tight text-white lg:text-xl">CareerArch</span>
    </Link>
  );
}
