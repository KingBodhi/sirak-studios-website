'use client'

import Image from 'next/image'
import Link from 'next/link'
import { SITE, SERVICES, STRATEGIC_SERVICES, PROCESS_STEPS, PORTFOLIO_ITEMS, TESTIMONIALS, CLIENT_LOGOS } from '@/data/content'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

const TRUST_ITEMS = [
  'BRAND STRATEGY',
  'WEBSITE & SEO',
  'SOCIAL MEDIA',
  'PHOTOGRAPHY',
  'VIDEOGRAPHY',
  'MUSIC PRODUCTION',
  'DRONE SERVICES',
]

const STATS = [
  { value: '500+', label: 'Projects Delivered' },
  { value: '30+', label: 'Brands Built' },
  { value: 'Since 2019', label: 'Founded' },
  { value: 'Miami, FL', label: 'Headquarters' },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`h-4 w-4 ${i < rating ? 'text-sirak-red' : 'text-sirak-text-tertiary'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export default function HomePage() {
  const featuredPortfolio = PORTFOLIO_ITEMS.filter((item) => item.featured)
  const marqueeText = TRUST_ITEMS.join(' \u2022 ') + ' \u2022 '

  return (
    <main>
      {/* ===== HERO ===== */}
      <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
        {/* Video Background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/images/g0j5XrrhGCoktAeAqFsRY6fqk8.png"
          className="absolute inset-0 h-full w-full object-cover"
          aria-hidden="true"
        >
          <source src="/videos/sirak-showreel.mp4" type="video/mp4" />
        </video>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-sirak-black/70 via-sirak-black/50 to-sirak-black" />

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto animate-fade-in-up">
          <h1
            className="font-[family-name:var(--font-teko)] uppercase leading-[0.95] tracking-wide text-sirak-white mb-6"
            style={{ fontSize: 'clamp(3.5rem, 10vw, 8rem)' }}
          >
            {SITE.tagline.split('.').filter(Boolean).map((word, i) => (
              <span key={i}>
                {word.trim()}
                {i < 2 && <span className="text-sirak-red">.</span>}
                {i < 2 && <br className="sm:hidden" />}
                {i < 2 && <span className="hidden sm:inline"> </span>}
              </span>
            ))}
          </h1>

          <p className="text-sirak-text-secondary text-lg sm:text-xl md:text-2xl mb-10 tracking-wide">
            Miami Creative Agency &amp; Production Studio
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-block bg-sirak-red text-white font-semibold px-8 py-4 rounded-sm text-lg uppercase tracking-wider hover:brightness-110 transition-all animate-pulse-glow"
            >
              Book a Consultation
            </Link>
            <Link
              href="/portfolio"
              className="inline-block border border-sirak-white/30 text-white font-semibold px-8 py-4 rounded-sm text-lg uppercase tracking-wider hover:border-sirak-red hover:text-sirak-red transition-all"
            >
              View Our Work
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <svg
            className="w-8 h-8 text-sirak-text-tertiary"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ===== TRUST BAR ===== */}
      <section className="overflow-hidden border-y border-sirak-border py-5 bg-sirak-surface">
        <div className="flex whitespace-nowrap">
          <div className="animate-marquee flex shrink-0">
            {[0, 1].map((copy) => (
              <span
                key={copy}
                className="font-[family-name:var(--font-teko)] uppercase text-2xl sm:text-3xl md:text-4xl text-sirak-text-tertiary tracking-widest px-4"
              >
                {marqueeText}
              </span>
            ))}
          </div>
          <div className="animate-marquee flex shrink-0" aria-hidden="true">
            {[0, 1].map((copy) => (
              <span
                key={copy}
                className="font-[family-name:var(--font-teko)] uppercase text-2xl sm:text-3xl md:text-4xl text-sirak-text-tertiary tracking-widest px-4"
              >
                {marqueeText}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TRUSTED BY ===== */}
      <section className="py-16 md:py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <p className="text-sirak-text-tertiary text-xs uppercase tracking-[0.3em] text-center mb-10">
              Trusted by leading brands &amp; artists
            </p>
          </ScrollReveal>
          <ScrollReveal>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-8 items-center justify-items-center opacity-60">
              {CLIENT_LOGOS.map((client) => (
                <div key={client.name} className="w-full max-w-[120px] h-12 relative flex items-center justify-center hover:opacity-100 transition-opacity">
                  <Image
                    src={client.image}
                    alt={client.name}
                    fill
                    className="object-contain filter brightness-0 invert"
                    sizes="120px"
                  />
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== HOW WE WORK (PIPELINE) ===== */}
      <section className="py-20 md:py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <h2 className="font-[family-name:var(--font-teko)] uppercase text-5xl sm:text-6xl md:text-7xl text-center mb-4 leading-[0.95]">
              How We <span className="text-sirak-red">Work</span>
            </h2>
            <p className="text-sirak-text-secondary text-center text-lg mb-14 max-w-2xl mx-auto">
              We don&apos;t just create content — we build the strategy behind it.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROCESS_STEPS.map((step, i) => (
              <ScrollReveal key={step.step} delay={i * 120}>
                <div className="glass rounded-xl p-6 h-full relative group hover:border-t-2 hover:border-t-sirak-red transition-all duration-300">
                  <div className="font-[family-name:var(--font-teko)] text-6xl font-bold text-sirak-red/20 absolute top-4 right-4 leading-none">
                    {String(step.step).padStart(2, '0')}
                  </div>
                  <h3 className="font-[family-name:var(--font-teko)] uppercase text-3xl text-white mb-1 leading-[0.95]">
                    {step.title}
                  </h3>
                  <p className="text-sirak-red text-xs font-semibold uppercase tracking-widest mb-3">
                    {step.subtitle}
                  </p>
                  <p className="text-sirak-text-secondary text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== STRATEGIC SERVICES ===== */}
      <section className="py-20 md:py-28 px-6 bg-sirak-surface">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <p className="text-sirak-red text-xs font-semibold uppercase tracking-[0.3em] text-center mb-3">
              Agency &amp; Consulting
            </p>
            <h2 className="font-[family-name:var(--font-teko)] uppercase text-5xl sm:text-6xl md:text-7xl text-center mb-4 leading-[0.95]">
              Build Your <span className="text-sirak-red">Brand</span>
            </h2>
            <p className="text-sirak-text-secondary text-center text-lg mb-14 max-w-2xl mx-auto">
              Strategy and digital presence that drive real business. This is where every great project starts.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {STRATEGIC_SERVICES.map((service, i) => (
              <ScrollReveal key={service.id} delay={i * 100}>
                <Link
                  href={`/services#${service.id}`}
                  className="group glass rounded-xl p-8 h-full flex flex-col hover:border-t-2 hover:border-t-sirak-red transition-all duration-300"
                >
                  <h3 className="font-[family-name:var(--font-teko)] uppercase text-3xl md:text-4xl text-white mb-2 leading-[0.95]">
                    {service.title}
                  </h3>
                  <p className="text-sirak-red text-xs font-semibold uppercase tracking-widest mb-4">
                    {service.subtitle}
                  </p>
                  <p className="text-sirak-text-secondary text-sm leading-relaxed mb-6 flex-1">
                    {service.description}
                  </p>
                  <span className="text-sirak-cyan text-sm font-semibold uppercase tracking-wider group-hover:text-white transition-colors flex items-center gap-2">
                    Learn More
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRODUCTION SERVICES ===== */}
      <section className="py-20 md:py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <p className="text-sirak-red text-xs font-semibold uppercase tracking-[0.3em] text-center mb-3">
              Production &amp; Content
            </p>
            <h2 className="font-[family-name:var(--font-teko)] uppercase text-5xl sm:text-6xl md:text-7xl text-center mb-4 leading-[0.95]">
              Create the <span className="text-sirak-red">Content</span>
            </h2>
            <p className="text-sirak-text-secondary text-center text-lg mb-14 max-w-2xl mx-auto">
              Full-scale production from our Miami studio. The execution arm of every brand we build.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map((service, i) => (
              <ScrollReveal key={service.id} delay={i * 100}>
                <Link
                  href={`/services#${service.id}`}
                  className="group relative block h-80 rounded-lg overflow-hidden border border-transparent hover:border-t-sirak-red hover:border-t-2 transition-all duration-300"
                >
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-sirak-black via-sirak-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="font-[family-name:var(--font-teko)] uppercase text-3xl md:text-4xl text-white mb-1 leading-[0.95]">
                      {service.title}
                    </h3>
                    <p className="text-sirak-text-secondary text-sm mb-2">
                      {service.subtitle}
                    </p>
                    <p className="text-sirak-red font-semibold text-sm">
                      Starting at ${service.startingAt}
                    </p>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PORTFOLIO PREVIEW ===== */}
      <section className="py-20 md:py-28 px-6 bg-sirak-surface">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <h2 className="font-[family-name:var(--font-teko)] uppercase text-5xl sm:text-6xl md:text-7xl text-center mb-4 leading-[0.95]">
              Selected <span className="text-sirak-red">Work</span>
            </h2>
            <p className="text-sirak-text-secondary text-center text-lg mb-14 max-w-2xl mx-auto">
              A curated selection of recent projects across our services.
            </p>
          </ScrollReveal>

          <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
            {featuredPortfolio.map((item, i) => (
              <ScrollReveal key={item.id} delay={i * 100}>
                <div className="group relative break-inside-avoid overflow-hidden rounded-lg cursor-pointer">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={600}
                    height={i % 2 === 0 ? 400 : 500}
                    className="w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-sirak-black/0 group-hover:bg-sirak-black/50 transition-all duration-300 flex items-end">
                    <div className="p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <span className="text-xs uppercase tracking-widest text-sirak-red font-semibold">
                        {item.category}
                      </span>
                      <h3 className="font-[family-name:var(--font-teko)] uppercase text-2xl text-white leading-[0.95] mt-1">
                        {item.title}
                      </h3>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal>
            <div className="text-center mt-14">
              <Link
                href="/portfolio"
                className="inline-block border border-sirak-white/30 text-white font-semibold px-8 py-4 rounded-sm text-lg uppercase tracking-wider hover:border-sirak-red hover:text-sirak-red transition-all"
              >
                View All Work
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-20 md:py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <h2 className="font-[family-name:var(--font-teko)] uppercase text-5xl sm:text-6xl md:text-7xl text-center mb-4 leading-[0.95]">
              What Clients <span className="text-sirak-red">Say</span>
            </h2>
            <p className="text-sirak-text-secondary text-center text-lg mb-14 max-w-2xl mx-auto">
              Hear from the people we have worked with.
            </p>
          </ScrollReveal>

          {/* Horizontal scroll on mobile, grid on desktop */}
          <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-visible md:pb-0 scrollbar-hide">
            {TESTIMONIALS.map((testimonial, i) => (
              <ScrollReveal key={i} delay={i * 100} className="min-w-[300px] md:min-w-0 snap-start">
                <div className="glass rounded-lg p-6 h-full flex flex-col justify-between">
                  <div>
                    <StarRating rating={testimonial.rating} />
                    <p className="text-sirak-text italic mt-4 text-sm leading-relaxed">
                      &ldquo;{testimonial.quote}&rdquo;
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-sirak-border">
                    <p className="text-white font-semibold text-sm">{testimonial.name}</p>
                    <p className="text-sirak-text-tertiary text-xs">{testimonial.role}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== STATS BAR ===== */}
      <section className="relative py-16 border-y border-sirak-border bg-sirak-surface overflow-hidden">
        {/* Red accent line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-sirak-red" />

        <ScrollReveal>
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {STATS.map((stat, i) => (
              <div key={i}>
                <div className="font-[family-name:var(--font-teko)] uppercase text-4xl sm:text-5xl md:text-6xl text-white leading-[0.95]">
                  {stat.value}
                </div>
                <div className="text-sirak-text-tertiary text-sm uppercase tracking-wider mt-2">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="relative py-24 md:py-32 px-6 overflow-hidden">
        {/* Subtle red gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-sirak-red/10 via-sirak-black to-sirak-black" />

        <ScrollReveal>
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <h2
              className="font-[family-name:var(--font-teko)] uppercase leading-[0.95] text-white mb-6"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
            >
              Ready to Build Your{' '}
              <span className="text-sirak-red">Brand</span>?
            </h2>

            <p className="text-sirak-text-secondary text-lg md:text-xl mb-10 max-w-2xl mx-auto">
              From brand strategy to content production — let&apos;s map out your growth. Free consultation.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link
                href="/contact"
                className="inline-block bg-sirak-red text-white font-semibold px-8 py-4 rounded-sm text-lg uppercase tracking-wider hover:brightness-110 transition-all animate-pulse-glow"
              >
                Book a Consultation
              </Link>
              <Link
                href="/contact?type=quote"
                className="inline-block border border-sirak-white/30 text-white font-semibold px-8 py-4 rounded-sm text-lg uppercase tracking-wider hover:border-sirak-red hover:text-sirak-red transition-all"
              >
                Get a Quote
              </Link>
            </div>

            <a
              href={`tel:${SITE.phone.replace(/\D/g, '')}`}
              className="text-sirak-text-secondary hover:text-sirak-cyan transition-colors text-lg tracking-wide"
            >
              {SITE.phone}
            </a>
          </div>
        </ScrollReveal>
      </section>
    </main>
  )
}
