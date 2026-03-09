'use client'

import Link from 'next/link'
import { PRICING } from '@/data/content'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { FAQ } from '@/components/ui/FAQ'

const PACKAGE_SERVICE_MAP: Record<string, string> = {
  'Basic Photoshoot': 'photography',
  'Basic Videoshoot': 'videography',
  'Photo & Video Combo': 'photography',
  'Event Photography': 'photography',
  'Event Videography': 'videography',
  'Event Photography (4hr)': 'photography',
  'Event Photography (6hr)': 'photography',
  'Event Videography (4hr)': 'videography',
  'Event Videography (6hr)': 'videography',
  'Real Estate Listing': 'drone',
  'Home Walkthrough Video': 'videography',
  'Real Estate Promo Video': 'videography',
}

function PriceTable({
  title,
  subtitle,
  tiers,
  note,
}: {
  title: string
  subtitle: string
  tiers: { duration: string; price: number }[]
  note?: string
}) {
  return (
    <div className="glass rounded-xl p-6 flex flex-col h-full">
      <h3 className="font-[family-name:var(--font-teko)] uppercase text-3xl text-white tracking-wide">
        {title}
      </h3>
      <p className="text-sirak-text-secondary text-sm mt-1 mb-5">{subtitle}</p>
      <div className="flex-1">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-sirak-border text-sirak-text-tertiary text-left">
              <th className="pb-2 font-medium">Duration</th>
              <th className="pb-2 font-medium text-right">Price</th>
            </tr>
          </thead>
          <tbody>
            {tiers.map((tier, i) => (
              <tr
                key={tier.duration}
                className={i % 2 === 0 ? 'bg-sirak-glass' : ''}
              >
                <td className="py-3 px-2 rounded-l">{tier.duration}</td>
                <td className="py-3 px-2 text-right text-sirak-red font-semibold rounded-r">
                  ${tier.price.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {note && (
        <p className="text-sirak-text-tertiary text-xs mt-4 leading-relaxed">{note}</p>
      )}
    </div>
  )
}

export default function PricingPage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Hero */}
      <ScrollReveal>
        <section className="text-center px-6 mb-16">
          <h1 className="font-[family-name:var(--font-teko)] uppercase text-5xl sm:text-6xl md:text-7xl text-white tracking-wide">
            Transparent Pricing
          </h1>
          <p className="text-sirak-text-secondary text-lg mt-3 max-w-xl mx-auto">
            No hidden fees. No surprises.
          </p>
        </section>
      </ScrollReveal>

      {/* Rate Cards */}
      <ScrollReveal>
        <section className="max-w-6xl mx-auto px-6 mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <PriceTable
              title={PRICING.crew.title}
              subtitle={PRICING.crew.subtitle}
              tiers={PRICING.crew.tiers}
              note={PRICING.crew.note}
            />
            <PriceTable
              title={PRICING.photoVideoStudio.title}
              subtitle={PRICING.photoVideoStudio.subtitle}
              tiers={PRICING.photoVideoStudio.tiers}
            />
            <PriceTable
              title={PRICING.recordingStudio.title}
              subtitle={PRICING.recordingStudio.subtitle}
              tiers={PRICING.recordingStudio.tiers}
            />
          </div>
        </section>
      </ScrollReveal>

      {/* Packages */}
      <ScrollReveal>
        <section className="max-w-6xl mx-auto px-6 mb-20">
          <h2 className="font-[family-name:var(--font-teko)] uppercase text-4xl sm:text-5xl text-white tracking-wide text-center mb-10">
            Popular Packages
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRICING.packages.map((pkg) => (
              <div
                key={pkg.name}
                className="glass rounded-xl p-6 flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-[family-name:var(--font-teko)] uppercase text-2xl text-white tracking-wide">
                    {pkg.name}
                  </h3>
                  <p className="text-sirak-red text-3xl font-bold mt-2 mb-5">
                    ${pkg.price.toLocaleString()}
                  </p>
                  <ul className="space-y-2 mb-6">
                    {pkg.includes.map((item) => (
                      <li
                        key={item}
                        className="text-sirak-text-secondary text-sm flex items-start gap-2"
                      >
                        <svg className="w-4 h-4 text-sirak-red mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link
                  href={`/book?service=${PACKAGE_SERVICE_MAP[pkg.name] || 'photography'}`}
                  className="block text-center bg-sirak-red text-white font-semibold py-2.5 rounded-lg hover:brightness-110 transition-all"
                >
                  Book
                </Link>
              </div>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* Add-Ons */}
      <ScrollReveal>
        <section className="max-w-4xl mx-auto px-6 mb-20">
          <h2 className="font-[family-name:var(--font-teko)] uppercase text-4xl sm:text-5xl text-white tracking-wide text-center mb-10">
            Add-Ons
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PRICING.addons.map((addon) => (
              <div
                key={addon.name}
                className="glass rounded-lg px-5 py-4 flex items-center justify-between"
              >
                <span className="text-sirak-text">{addon.name}</span>
                <span className="text-sirak-red font-semibold whitespace-nowrap ml-4">
                  {typeof addon.price === 'number'
                    ? `$${addon.price.toLocaleString()}`
                    : addon.price}
                </span>
              </div>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* FAQs */}
      <FAQ />

      {/* Bottom CTA */}
      <ScrollReveal>
        <section className="text-center px-6">
          <div className="glass rounded-xl max-w-2xl mx-auto py-12 px-8">
            <h2 className="font-[family-name:var(--font-teko)] uppercase text-3xl sm:text-4xl text-white tracking-wide mb-3">
              Need a Custom Quote?
            </h2>
            <p className="text-sirak-text-secondary mb-6">
              Every project is unique. Reach out and we&apos;ll put together a package
              tailored to your vision.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-sirak-red text-white font-semibold px-8 py-3 rounded-lg hover:brightness-110 transition-all"
            >
              Contact Us
            </Link>
          </div>
        </section>
      </ScrollReveal>
    </div>
  )
}
