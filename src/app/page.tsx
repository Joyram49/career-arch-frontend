import { PublicFooter } from '@components/layout/footer';
import { PublicNavbar } from '@components/layout/navbar';
import type { Metadata } from 'next';
import { FeaturedJobs } from './_components/featured-jobs';
import { HeroSection } from './_components/hero-section';
import { HowItWorks } from './_components/how-it-works';
import { PricingSection } from './_components/pricing-section';
import { StatsBar } from './_components/stats-bar';
import { Testimonials } from './_components/testimonials';

export const metadata: Metadata = {
  title: 'CareerArch — Architect the Career You Deserve',
  description:
    "Precision matching for elite professionals. Access 50,000+ high-growth opportunities from the world's most innovative firms.",
  openGraph: {
    title: 'CareerArch — Architect the Career You Deserve',
    description:
      'Precision matching for elite professionals. Access 50,000+ high-growth opportunities.',
    type: 'website',
  },
};

export default function LandingPage(): React.JSX.Element {
  return (
    <>
      <PublicNavbar />
      <HeroSection />
      <StatsBar />
      <FeaturedJobs />
      <HowItWorks />
      <PricingSection />
      <Testimonials />
      <PublicFooter />
    </>
  );
}
