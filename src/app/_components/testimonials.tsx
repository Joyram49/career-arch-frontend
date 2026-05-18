'use client';

import { motion, type Variants } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

const TESTIMONIALS = [
  {
    id: '1',
    quote:
      "CareerArch's matching algorithm is exceptionally refined. I transitioned to my current leadership role at Stripe in record time. The architectural approach to talent matching is unmatched.",
    name: 'Sarah Chen',
    role: 'Staff Systems Lead @ Stripe',
    initials: 'SC',
    color: 'bg-brand-sky',
    rating: 5,
  },
  {
    id: '2',
    quote:
      'The Executive coaching program provided me with the data and strategy needed to negotiate a 20% compensation increase. This is the gold standard for career development.',
    name: 'Marcus Rodriguez',
    role: 'Staff Strategist @ Notion',
    initials: 'MR',
    color: 'bg-brand-emerald',
    rating: 5,
  },
] as const;

export function Testimonials(): React.JSX.Element {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });

  return (
    <section className="testimonials-bg relative py-20 lg:py-28" ref={ref}>
      <div className="testimonials-grid pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-5xl px-5 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center"
        >
          <h2
            className="text-3xl font-black tracking-tight text-foreground lg:text-5xl"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Growth Journeys
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid gap-6 lg:grid-cols-2"
        >
          {TESTIMONIALS.map((testimonial) => (
            <motion.blockquote
              key={testimonial.id}
              variants={itemVariants}
              className="testimonial-card flex flex-col gap-6 rounded-2xl p-8"
            >
              {/* Stars */}
              <div className="flex gap-1" aria-label={`${testimonial.rating} out of 5 stars`}>
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <svg
                    key={i}
                    viewBox="0 0 14 14"
                    className="size-4 text-brand-amber"
                    aria-hidden="true"
                  >
                    <path
                      d="M7 1L8.8 5.3L13.5 5.8L10 9.1L11 13.5L7 11.5L3 13.5L4 9.1L0.5 5.8L5.2 5.3L7 1Z"
                      fill="currentColor"
                    />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <p className="flex-1 text-[15px] leading-relaxed text-slate-300 italic">
                &ldquo;{testimonial.quote}&rdquo;
              </p>

              {/* Author */}
              <footer className="flex items-center gap-3">
                <div
                  className={`flex size-10 shrink-0 items-center justify-center rounded-full text-xs font-black text-white ${testimonial.color}`}
                >
                  {testimonial.initials}
                </div>
                <div>
                  <cite className="text-sm font-bold text-foreground not-italic">
                    {testimonial.name}
                  </cite>
                  <p className="testimonial-role text-xs">{testimonial.role}</p>
                </div>
              </footer>
            </motion.blockquote>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
