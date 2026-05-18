'use client';

import { LogoIcon } from '@assets/icons/custom';
import { ModeToggle } from '@components/shared/theme-toggler-mobile';
import { Button } from '@ui/button';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const NAV_LINKS = [
  { label: 'Opportunities', href: '/jobs' },
  { label: 'Network', href: '/companies' },
  { label: 'Intelligence', href: '/salary-guide' },
  { label: 'Enterprise', href: '/enterprise' },
] as const;

const mobileMenuVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -10,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.25,
      ease: [0.25, 0.46, 0.45, 0.94],
      when: 'beforeChildren',
      staggerChildren: 0.06,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.98,
    transition: {
      duration: 0.2,
    },
  },
};

const linkVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 },
};

const navVariants: Variants = {
  hidden: { opacity: 0, y: -16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export function PublicNavbar(): React.JSX.Element {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function onScroll(): void {
      setScrolled(window.scrollY > 24);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      variants={navVariants}
      initial="hidden"
      animate="visible"
      className={[
        'fixed top-0 right-0 left-0 z-50 transition-all duration-300',
        scrolled
          ? 'border-b border-border bg-background/80 backdrop-blur-lg'
          : 'border-b border-transparent bg-transparent',
      ].join(' ')}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5" aria-label="CareerArch home">
          <div className="flex size-8 items-center justify-center rounded-lg bg-brand-sky/10 ring-1 ring-border">
            <LogoIcon className="size-5 text-brand-sky" />
          </div>
          <span className="text-base font-bold tracking-tight text-foreground">CareerArch</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {NAV_LINKS.map((link, i) => (
            <Link
              key={link.href}
              href={{ pathname: link.href }}
              className={[
                'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                i === 0
                  ? 'border-b-2 border-brand-sky text-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              ].join(' ')}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA buttons */}
        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/login">
            <Button
              variant="ghost"
              className="h-9 px-4 text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              Log In
            </Button>
          </Link>

          <Link href="/register">
            <Button className="h-9 rounded-full bg-brand-sky px-5 text-sm font-bold text-white hover:bg-brand-sky/90">
              Join Now
            </Button>
          </Link>
        </div>

        {/* Mobile hamburger */}

        <div className="flex items-center gap-x-2 lg:hidden">
          <ModeToggle />

          <button
            type="button"
            className="flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            <svg viewBox="0 0 24 24" fill="none" className="size-5" aria-hidden="true">
              {mobileOpen ? (
                <path
                  d="M6 6L18 18M6 18L18 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M4 8H20M4 16H20"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              key="mobile-menu"
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="absolute top-16 right-0 w-full rounded-3xl border border-border bg-background/95 shadow-lg backdrop-blur-lg lg:hidden"
            >
              <nav className="flex flex-col gap-1 px-5 py-4" aria-label="Mobile navigation">
                {NAV_LINKS.map((link) => (
                  <motion.div key={link.href} variants={linkVariants}>
                    <Link
                      href={{ pathname: link.href }}
                      className="rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}

                <motion.div
                  variants={linkVariants}
                  className="mt-3 flex flex-col gap-2 border-t border-border pt-3"
                >
                  <Link href="/login" onClick={() => setMobileOpen(false)}>
                    <Button
                      variant="ghost"
                      className="h-11 w-full text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      Log In
                    </Button>
                  </Link>

                  <Link href="/register" onClick={() => setMobileOpen(false)}>
                    <Button className="h-11 w-full rounded-xl bg-brand-sky font-bold text-white hover:bg-brand-sky/90">
                      Join Now
                    </Button>
                  </Link>
                </motion.div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
