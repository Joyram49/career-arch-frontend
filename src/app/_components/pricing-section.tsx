'use client';

import { Button } from '@ui/button';
import { motion, type Variants } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { useInView } from 'react-intersection-observer';

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

const PLANS = [
  {
    id: 'free',
    name: 'Standard',
    badge: null,
    price: { monthly: 0, yearly: 0 },
    description: 'For getting started',
    features: [
      { label: '5 Engagements / Month', included: true },
      { label: 'Basic Sector Alerts', included: true },
      { label: 'Public Professional ID', included: true },
      { label: 'Priority Intelligence Rank', included: false },
      { label: 'Skill Architecture Audit', included: false },
      { label: 'Partner Messaging Access', included: false },
    ],
    cta: 'Get Started',
    ctaVariant: 'outline' as const,
    highlight: false,
    borderClass: 'border-border',
    badgeClass: '',
  },
  {
    id: 'basic',
    name: 'Professional',
    badge: 'RECOMMENDED',
    price: { monthly: 14.99, yearly: 11.99 },
    description: 'For serious career architects',
    features: [
      { label: 'Unlimited Expressions', included: true },
      { label: 'Priority Intelligence Rank', included: true },
      { label: 'Skill Architecture Audit', included: true },
      { label: 'Partner Messaging Access', included: true },
      { label: 'AI Blueprint Enhancement', included: false },
      { label: 'Personal Growth Architect', included: false },
    ],
    cta: 'Go Professional',
    ctaVariant: 'default' as const,
    highlight: true,
    borderClass: 'border-brand-sky/40',
    badgeClass: 'bg-brand-sky text-white',
  },
  {
    id: 'premium',
    name: 'Executive',
    badge: null,
    price: { monthly: 39.99, yearly: 31.99 },
    description: 'For elite professionals',
    features: [
      { label: 'Full Professional Features', included: true },
      { label: 'AI Blueprint Enhancement', included: true },
      { label: 'Personal Growth Architect', included: true },
      { label: 'First-Look Confidential Roles', included: true },
      { label: 'White-Glove Placement', included: true },
      { label: 'Executive Network Access', included: true },
    ],
    cta: 'Go Executive',
    ctaVariant: 'outline' as const,
    highlight: false,
    borderClass: 'border-border',
    badgeClass: '',
  },
] as const;

export function PricingSection(): React.JSX.Element {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const [yearly, setYearly] = useState(false);

  return (
    <section className="bg-background py-20 lg:py-28" ref={ref}>
      <div className="mx-auto max-w-5xl px-5 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2
            className="mb-3 text-3xl font-black tracking-tight text-foreground lg:text-5xl"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Strategic Access Plans
          </h2>
          <p className="text-base text-muted-foreground">
            Accelerate your professional evolution with tools designed for high-stakes career moves.
          </p>

          {/* Billing toggle */}
          <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-border bg-muted p-1">
            <button
              type="button"
              onClick={() => setYearly(false)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-all ${
                !yearly
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setYearly(true)}
              className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold transition-all ${
                yearly
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Yearly
              <span className="rounded-full bg-brand-emerald px-2 py-0.5 text-[10px] font-bold text-white">
                Save 20%
              </span>
            </button>
          </div>
        </motion.div>

        {/* Plan cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid gap-5 lg:grid-cols-3"
        >
          {PLANS.map((plan) => (
            <motion.div
              key={plan.id}
              variants={itemVariants}
              className={`relative flex flex-col rounded-2xl border bg-card p-7 ${plan.borderClass} ${
                plan.highlight
                  ? 'shadow-modal scale-[1.02] ring-1 ring-brand-sky/20'
                  : 'shadow-card'
              }`}
            >
              {/* Recommended badge */}
              {plan.badge !== null && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span
                    className={`rounded-full px-4 py-1 text-xs font-bold tracking-widest uppercase ${plan.badgeClass}`}
                  >
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Plan name + price */}
              <div className="mb-6">
                <p className="mb-1 text-xs font-bold tracking-widest text-muted-foreground uppercase">
                  {plan.name}
                </p>
                <div className="flex items-end gap-1">
                  <span
                    className="text-4xl font-black text-foreground"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    ${yearly ? plan.price.yearly : plan.price.monthly}
                  </span>
                  <span className="mb-1 text-sm text-muted-foreground">/mo</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{plan.description}</p>
              </div>

              {/* Features */}
              <ul className="mb-7 flex flex-col gap-3">
                {plan.features.map((feature) => (
                  <li key={feature.label} className="flex items-center gap-2.5">
                    {feature.included ? (
                      <svg
                        viewBox="0 0 16 16"
                        className="size-4 shrink-0 text-brand-emerald"
                        aria-hidden="true"
                      >
                        <circle cx="8" cy="8" r="7" fill="currentColor" opacity="0.15" />
                        <path
                          d="M5 8L7 10L11 6"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      <svg
                        viewBox="0 0 16 16"
                        className="size-4 shrink-0 text-muted-foreground/40"
                        aria-hidden="true"
                      >
                        <circle
                          cx="8"
                          cy="8"
                          r="7"
                          stroke="currentColor"
                          strokeWidth="1"
                          opacity="0.4"
                        />
                        <path
                          d="M5.5 10.5L10.5 5.5M5.5 5.5L10.5 10.5"
                          stroke="currentColor"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                          opacity="0.4"
                        />
                      </svg>
                    )}
                    <span
                      className={`text-sm font-medium ${
                        feature.included
                          ? 'text-foreground'
                          : 'text-muted-foreground/50 line-through'
                      }`}
                    >
                      {feature.label}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href={{ pathname: plan.id === 'free' ? '/register' : `/pricing?plan=${plan.id}` }}
                className="mt-auto"
              >
                <Button
                  variant={plan.highlight ? 'default' : 'outline'}
                  className={`w-full rounded-xl font-bold ${
                    plan.highlight
                      ? 'bg-brand-navy text-white hover:bg-brand-navy/90'
                      : 'border-border hover:border-brand-sky/40 hover:text-brand-sky'
                  }`}
                >
                  {plan.cta}
                </Button>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
