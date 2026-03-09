'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { STUDIO_FEATURES, PRICING, SITE } from '@/data/content'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

type StudioTab = 'photo-video' | 'recording' | 'equipment'

const TABS: { id: StudioTab; label: string }[] = [
  { id: 'photo-video', label: 'Photo/Video Stage' },
  { id: 'recording', label: 'Recording Studio' },
  { id: 'equipment', label: 'Equipment' },
]

const TAB_IMAGES: Record<StudioTab, string> = {
  'photo-video': '/images/f0xTwK2sFT7WC47RQXuNuTiQAQ.jpg',
  recording: '/images/epbwHuqgWTAFlmYnUqLSegOOzNI.jpg',
  equipment: '/images/9p1CHZtoTcDXwMsJaOYKlTfmA2o.jpg',
}

const EQUIPMENT_LIST = [
  'Professional LED lighting panels',
  'Softboxes & modifiers',
  'C-stands & grip equipment',
  'Seamless paper backdrops',
  'V-flats & reflectors',
  'Fog/haze machine',
  'Wireless audio monitors',
  'Camera sliders & tripods',
  'Teleprompter',
  'Props & set dressing available',
]

const STUDIO_STATS = [
  { label: 'Stage Size', value: '1,200 sq ft' },
  { label: 'Ceiling Height', value: '14 ft' },
  { label: 'Recording Booth', value: 'Isolated' },
  { label: 'Parking', value: 'On-site' },
]

export default function StudioPage() {
  const [activeTab, setActiveTab] = useState<StudioTab>('photo-video')

  const currentPricing =
    activeTab === 'photo-video'
      ? PRICING.photoVideoStudio
      : activeTab === 'recording'
        ? PRICING.recordingStudio
        : null

  const currentFeatures =
    activeTab === 'photo-video'
      ? STUDIO_FEATURES.photoVideo.features
      : activeTab === 'recording'
        ? STUDIO_FEATURES.recording.features
        : EQUIPMENT_LIST

  return (
    <div className="min-h-screen pt-24">
      {/* Hero */}
      <section className="relative py-20 px-6 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-sirak-red/5 to-transparent pointer-events-none" />
        <div className="relative max-w-[1400px] mx-auto">
          <h1 className="font-[family-name:var(--font-teko)] text-6xl md:text-8xl font-bold uppercase tracking-wider text-white">
            The Studio
          </h1>
          <p className="mt-4 text-lg text-sirak-text-secondary max-w-2xl mx-auto">
            Professional spaces for your next production. Two studios, full equipment, and a team ready to support your vision.
          </p>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="max-w-[1400px] mx-auto px-6 pb-12">
        <ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STUDIO_STATS.map((stat) => (
              <div
                key={stat.label}
                className="glass rounded-xl p-6 text-center"
              >
                <div className="font-[family-name:var(--font-teko)] text-3xl md:text-4xl font-bold text-white uppercase">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-sirak-text-tertiary uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* Tabbed Interface */}
      <section className="max-w-[1400px] mx-auto px-6 pb-24">
        <ScrollReveal>
          {/* Tab Buttons */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 text-sm font-semibold uppercase tracking-wider transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-sirak-red text-white'
                    : 'glass text-sirak-text-secondary hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Image */}
            <div className="lg:w-1/2 relative aspect-[4/3] overflow-hidden rounded-xl">
              <Image
                src={TAB_IMAGES[activeTab]}
                alt={TABS.find((t) => t.id === activeTab)?.label || 'Studio'}
                fill
                className="object-cover transition-opacity duration-500"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-sirak-black/40 via-transparent to-transparent" />
            </div>

            {/* Details */}
            <div className="lg:w-1/2 flex flex-col justify-center">
              <h2 className="font-[family-name:var(--font-teko)] text-4xl md:text-5xl font-bold uppercase tracking-wider text-white">
                {TABS.find((t) => t.id === activeTab)?.label}
              </h2>

              {/* Features List */}
              <ul className="mt-6 space-y-3">
                {currentFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sirak-text-secondary">
                    <svg
                      className="w-5 h-5 text-sirak-red shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Pricing Table */}
              {currentPricing && (
                <div className="mt-8">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-sirak-text-tertiary mb-1">
                    {currentPricing.title}
                  </h3>
                  <p className="text-xs text-sirak-text-tertiary mb-4">{currentPricing.subtitle}</p>
                  <div className="glass rounded-xl overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-sirak-border">
                          <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-sirak-text-tertiary">
                            Duration
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-sirak-text-tertiary">
                            Price
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentPricing.tiers.map((tier, i) => (
                          <tr
                            key={tier.duration}
                            className={i < currentPricing.tiers.length - 1 ? 'border-b border-sirak-border/50' : ''}
                          >
                            <td className="px-6 py-3 text-sm text-sirak-text-secondary">{tier.duration}</td>
                            <td className="px-6 py-3 text-right">
                              <span className="font-[family-name:var(--font-teko)] text-xl font-bold text-white">
                                ${tier.price}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'equipment' && (
                <p className="mt-8 text-sm text-sirak-text-tertiary">
                  Equipment is available as add-ons to studio bookings. Contact us for a full inventory list and rental rates.
                </p>
              )}

              {/* CTA */}
              <Link
                href={`/book?service=studio-rental`}
                className="mt-8 inline-flex items-center justify-center px-8 py-3 bg-sirak-red text-white font-semibold text-sm uppercase tracking-wider hover:bg-white hover:text-sirak-black transition-all duration-300 w-fit"
              >
                Book This Studio
                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Virtual Tour CTA */}
      <section className="border-t border-sirak-border">
        <div className="max-w-[1400px] mx-auto px-6 py-20">
          <ScrollReveal>
            <div className="glass rounded-xl p-12 md:p-16 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-sirak-red/10 via-transparent to-sirak-cyan/5 pointer-events-none" />
              <div className="relative">
                <h2 className="font-[family-name:var(--font-teko)] text-4xl md:text-5xl font-bold uppercase tracking-wider text-white">
                  Schedule a Studio Tour
                </h2>
                <p className="mt-4 text-sirak-text-secondary max-w-xl mx-auto">
                  Want to see the space in person before booking? We&apos;ll walk you through both studios, show you the equipment, and help plan your production.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center px-8 py-3 bg-sirak-red text-white font-semibold text-sm uppercase tracking-wider hover:bg-white hover:text-sirak-black transition-all duration-300"
                  >
                    Contact Us
                  </Link>
                  <a
                    href={`tel:${SITE.phone}`}
                    className="inline-flex items-center justify-center px-8 py-3 glass text-white font-semibold text-sm uppercase tracking-wider hover:bg-sirak-red hover:border-sirak-red transition-all duration-300"
                  >
                    Call {SITE.phone}
                  </a>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}
