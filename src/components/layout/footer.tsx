import { LogoIcon } from '@assets/icons/custom';
import Link from 'next/link';

const FOOTER_LINKS = {
  Infrastructure: [
    { label: 'Opportunities', href: '/jobs' },
    { label: 'Growth Partners', href: '/companies' },
    { label: 'Intelligence Hub', href: '/salary-guide' },
    { label: 'Architecture App', href: '#' },
  ],
  'The Studio': [
    { label: 'Philosophy', href: '#' },
    { label: 'Open Roles', href: '/jobs' },
    { label: 'Insights', href: '#' },
    { label: 'Connect', href: '#' },
  ],
  Protocols: [
    { label: 'Privacy Framework', href: '/privacy' },
    { label: 'Service Agreement', href: '/terms' },
    { label: 'Data Governance', href: '#' },
  ],
  Concierge: [
    { label: 'Help Center', href: '#' },
    { label: 'Trust Registry', href: '#' },
  ],
} as const;

export function PublicFooter(): React.JSX.Element {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
        <div className="grid grid-cols-2 gap-10 lg:grid-cols-6">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="mb-4 flex items-center gap-2.5" aria-label="CareerArch home">
              <div className="flex size-8 items-center justify-center rounded-lg bg-brand-sky/10 ring-1 ring-border">
                <LogoIcon className="size-5 text-brand-sky" />
              </div>
              <span className="text-base font-bold text-foreground">CareerArch</span>
            </Link>

            <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
              Engineering high-impact professional futures through precision intelligence and
              curated access.
            </p>

            <p className="text-xs text-muted-foreground">v1.0 · Foundation Release</p>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <p className="mb-4 text-xs font-bold tracking-widest text-muted-foreground uppercase">
                {category}
              </p>

              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={{ pathname: link.href }}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} CareerArch Foundation. Architecture of Your Future.
          </p>

          <div className="flex items-center gap-1">
            <LogoIcon className="size-4 text-muted-foreground" aria-hidden="true" />
            <span className="text-xs text-muted-foreground">CareerArch</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
