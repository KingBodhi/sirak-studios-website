'use client'

import Image from 'next/image'
import Link from 'next/link'
import { SERVICES, STRATEGIC_SERVICES } from '@/data/content'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

const PRODUCTION_INCLUDES: Record<string, string[]> = {
  photography: [
    'Professional lighting & composition',
    'High-resolution edited images',
    'Color grading & retouching',
    'Online delivery gallery',
    'Commercial usage rights',
    'Multiple outfit/scene changes',
  ],
  videography: [
    'Pre-production planning',
    'Professional camera & audio',
    'Color grading & editing',
    'Licensed music options',
    'Multiple format exports',
    'Social media cuts available',
  ],
  'music-production': [
    'Professional recording booth',
    'Engineer included in session',
    'Mixing & mastering',
    'Unlimited takes during session',
    'Digital delivery of finals',
    'Revision rounds included',
  ],
  'studio-rental': [
    'Full studio access',
    'Professional lighting grid',
    'Hair & makeup station',
    'Client lounge area',
    'Bay door for vehicle access',
    'Equipment add-ons available',
  ],
  'graphic-design': [
    'Initial concept mockups',
    'Multiple revision rounds',
    'Print & digital formats',
    'Source files included',
    'Brand guideline alignment',
    'Rush delivery available',
  ],
  drone: [
    'FAA-licensed pilot',
    '4K aerial footage',
    'Professional editing',
    'Multiple flight passes',
    'RAW & edited deliverables',
    'Location scouting support',
  ],
}

export default function ServicesPage() {
  return (
    <div className="min-h-screen pt-24">
      {/* Hero */}
      <section className="relative py-20 px-6 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-sirak-red/5 to-transparent pointer-events-none" />
        <div className="relative max-w-[1400px] mx-auto">
          <h1 className="font-[family-name:var(--font-teko)] text-6xl md:text-8xl font-bold uppercase tracking-wider text-white">
            Our Services
          </h1>
          <p className="mt-4 text-lg text-sirak-text-secondary max-w-2xl mx-auto">
            Brand strategy, digital presence, and content production — all under one roof. We build the strategy, then produce the content to execute it.
          </p>
        </div>
      </section>

      {/* ══════ STRATEGIC SERVICES ══════ */}
      <section className="max-w-[1400px] mx-auto px-6 pb-8">
        <ScrollReveal>
          <div className="flex items-center gap-4 mb-12">
            <div className="h-px flex-1 bg-sirak-border" />
            <h2 className="font-[family-name:var(--font-teko)] text-3xl md:text-4xl font-bold uppercase tracking-wider text-white whitespace-nowrap">
              Strategy &amp; <span className="text-sirak-red">Consulting</span>
            </h2>
            <div className="h-px flex-1 bg-sirak-border" />
          </div>
        </ScrollReveal>

        {STRATEGIC_SERVICES.map((service, index) => {
          const isEven = index % 2 === 0
          return (
            <ScrollReveal key={service.id} delay={100}>
              <div
                id={service.id}
                className={`flex flex-col ${
                  isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
                } gap-8 lg:gap-12 py-16 scroll-mt-24 ${
                  index < STRATEGIC_SERVICES.length - 1 ? 'border-b border-sirak-border' : ''
                }`}
              >
                {/* Icon / Visual */}
                <div className="lg:w-1/2 flex items-center justify-center">
                  <div className="glass rounded-2xl p-12 md:p-16 w-full aspect-[4/3] flex flex-col items-center justify-center text-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-sirak-red/5 via-transparent to-sirak-cyan/5 pointer-events-none group-hover:from-sirak-red/10 group-hover:to-sirak-cyan/10 transition-all duration-700" />
                    <div className="relative">
                      <div className="font-[family-name:var(--font-teko)] text-8xl md:text-9xl font-bold text-sirak-red/15 leading-none mb-4">
                        {String(index + 1).padStart(2, '0')}
                      </div>
                      <h3 className="font-[family-name:var(--font-teko)] uppercase text-4xl md:text-5xl text-white leading-[0.95]">
                        {service.title}
                      </h3>
                      <p className="text-sirak-text-tertiary text-sm mt-3 uppercase tracking-widest">
                        {service.subtitle}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="lg:w-1/2 flex flex-col justify-center">
                  <span className="text-sirak-cyan text-xs font-semibold uppercase tracking-[0.2em] mb-2">
                    Agency &amp; Consulting
                  </span>
                  <h2 className="font-[family-name:var(--font-teko)] text-4xl md:text-5xl font-bold uppercase tracking-wider text-white mt-1">
                    {service.title}
                  </h2>
                  <p className="mt-4 text-sirak-text-secondary leading-relaxed">
                    {service.description}
                  </p>

                  {/* Includes */}
                  <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {service.includes.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-sirak-text-secondary">
                        <svg className="w-4 h-4 text-sirak-red mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link
                    href="/contact"
                    className="mt-8 inline-flex items-center justify-center px-8 py-3 bg-sirak-red text-white font-semibold text-sm uppercase tracking-wider hover:bg-white hover:text-sirak-black transition-all duration-300 w-fit"
                  >
                    Book a Consultation
                    <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          )
        })}
      </section>

      {/* ══════ PRODUCTION SERVICES ══════ */}
      <section className="max-w-[1400px] mx-auto px-6 pb-24 pt-8">
        <ScrollReveal>
          <div className="flex items-center gap-4 mb-12">
            <div className="h-px flex-1 bg-sirak-border" />
            <h2 className="font-[family-name:var(--font-teko)] text-3xl md:text-4xl font-bold uppercase tracking-wider text-white whitespace-nowrap">
              Production &amp; <span className="text-sirak-red">Content</span>
            </h2>
            <div className="h-px flex-1 bg-sirak-border" />
          </div>
        </ScrollReveal>

        {SERVICES.map((service, index) => {
          const isEven = index % 2 === 0
          const includes = PRODUCTION_INCLUDES[service.id] || []

          return (
            <ScrollReveal key={service.id} delay={100}>
              <div
                id={service.id}
                className={`flex flex-col ${
                  isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
                } gap-8 lg:gap-12 py-16 scroll-mt-24 ${
                  index < SERVICES.length - 1 ? 'border-b border-sirak-border' : ''
                }`}
              >
                {/* Image */}
                <div className="lg:w-1/2 relative aspect-[4/3] overflow-hidden rounded-xl group">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-sirak-black/60 via-transparent to-transparent" />
                </div>

                {/* Content */}
                <div className="lg:w-1/2 flex flex-col justify-center">
                  <span className="text-sirak-red text-xs font-semibold uppercase tracking-[0.2em] mb-2">
                    Production
                  </span>
                  <h2 className="font-[family-name:var(--font-teko)] text-4xl md:text-5xl font-bold uppercase tracking-wider text-white mt-1">
                    {service.title}
                  </h2>
                  <p className="mt-4 text-sirak-text-secondary leading-relaxed">
                    {service.description}
                  </p>

                  {/* Price */}
                  <div className="mt-6 flex items-baseline gap-2">
                    <span className="text-sirak-text-tertiary text-sm uppercase tracking-wider">Starting at</span>
                    <span className="font-[family-name:var(--font-teko)] text-3xl font-bold text-white">
                      ${service.startingAt}
                    </span>
                  </div>

                  {/* Includes */}
                  <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {includes.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-sirak-text-secondary">
                        <svg className="w-4 h-4 text-sirak-red mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link
                    href={`/book?service=${service.id}`}
                    className="mt-8 inline-flex items-center justify-center px-8 py-3 bg-sirak-red text-white font-semibold text-sm uppercase tracking-wider hover:bg-white hover:text-sirak-black transition-all duration-300 w-fit"
                  >
                    Book This Service
                    <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          )
        })}
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-sirak-border">
        <div className="max-w-[1400px] mx-auto px-6 py-20 text-center">
          <ScrollReveal>
            <h2 className="font-[family-name:var(--font-teko)] text-4xl md:text-5xl font-bold uppercase tracking-wider text-white">
              Not Sure Where to Start?
            </h2>
            <p className="mt-4 text-sirak-text-secondary max-w-xl mx-auto">
              Most clients start with a free consultation. We&apos;ll assess your brand, identify gaps, and build a roadmap — whether that&apos;s a full brand overhaul or a single production.
            </p>
            <Link
              href="/contact"
              className="mt-8 inline-flex items-center justify-center px-8 py-3 glass text-white font-semibold text-sm uppercase tracking-wider hover:bg-sirak-red hover:border-sirak-red transition-all duration-300"
            >
              Book a Free Consultation
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}
