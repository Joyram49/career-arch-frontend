import { ReactQueryProvider } from '@providers/react-query-provider';
import type { Metadata, Viewport } from 'next';

import { ModeToggle } from '@components/shared/theme-toggler';
import { ThemeProvider } from '@providers/theme-provider';
import { JetBrains_Mono, Plus_Jakarta_Sans } from 'next/font/google';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Toaster } from 'sonner';
import './globals.css';

/* ── Fonts ── */
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono-loaded',
  weight: ['400', '500', '600'],
  display: 'swap',
});

/* ── Metadata ── */
export const metadata: Metadata = {
  title: {
    default: 'CareerArch — Find the Job That Moves You Forward',
    template: '%s | CareerArch',
  },
  description:
    'Search 50,000+ jobs from verified companies. Get matched, apply fast, land offers. The modern job portal for serious job seekers.',
  keywords: [
    'jobs',
    'careers',
    'job portal',
    'hiring',
    'remote work',
    'job search',
    'glassdoor alternative',
  ],
  authors: [{ name: 'CareerArch' }],
  creator: 'CareerArch',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'CareerArch',
    title: 'CareerArch — Find the Job That Moves You Forward',
    description: 'Search 50,000+ jobs from verified companies.',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CareerArch',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CareerArch — Find the Job That Moves You Forward',
    description: 'Search 50,000+ jobs from verified companies.',
    images: ['/images/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8fafc' },
    { media: '(prefers-color-scheme: dark)', color: '#0b0f1a' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

/* ── Root Layout ── */
export default function RootLayout({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${plusJakartaSans.variable} ${jetbrainsMono.variable}`}
    >
      <body className="font-sans antialiased">
        {/*
          ThemeProvider: sets [data-theme="dark"] on <html>.
          attribute="data-theme" matches our CSS selectors in globals.css.
          suppressHydrationWarning on <html> prevents Next.js hydration mismatch
          warnings caused by theme being set client-side.
        */}
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <ReactQueryProvider>
            <NuqsAdapter>{children}</NuqsAdapter>
            <Toaster
              position="top-right"
              richColors
              closeButton
              duration={4000}
              toastOptions={{
                style: {
                  background: 'var(--card)',
                  color: 'var(--card-foreground)',
                  border: '1px solid var(--border)',
                },
              }}
            />
          </ReactQueryProvider>
          <div className="fixed top-[50%] right-0 hidden lg:block">
            <ModeToggle />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
