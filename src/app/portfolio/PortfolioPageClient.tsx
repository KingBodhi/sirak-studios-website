'use client'

import { useState } from 'react'
import Image from 'next/image'
import { PORTFOLIO_ITEMS, PORTFOLIO_CATEGORIES } from '@/data/content'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

const YOUTUBE_PLAYLISTS = [
  { id: 'PLJ7VcvKs4eYx7o5paCkFKND-S6q01T33i', title: 'Music Videos' },
  { id: 'PLJ7VcvKs4eYxOHia89eMam5pRpTbMI2Vx', title: 'Commercials' },
  { id: 'PLJ7VcvKs4eYyc3Omt9UycBl0guo14sJ3T', title: 'Events' },
  { id: 'PLJ7VcvKs4eYyf4LdBMpCG_lgf_ccm7aff', title: 'Real Estate' },
  { id: 'PLJ7VcvKs4eYyo8Li7amWH83j1GDB2tGCt', title: 'Behind the Scenes' },
  { id: 'PLJ7VcvKs4eYyPHmswo43DwEjl9U6opA6B', title: 'Portraits' },
  { id: 'PLJ7VcvKs4eYz8o0SC896clwqTnJIcdhPX', title: 'Drone Footage' },
  { id: 'PLJ7VcvKs4eYzYqzgmO6erbUowsQfFqf-n', title: 'Studio Sessions' },
]

export default function PortfolioPage() {
  const [activeFilter, setActiveFilter] = useState<(typeof PORTFOLIO_CATEGORIES)[number]>('All')

  const filteredItems =
    activeFilter === 'All'
      ? PORTFOLIO_ITEMS
      : PORTFOLIO_ITEMS.filter((item) => item.category === activeFilter)

  return (
    <div className="min-h-screen pt-24">
      {/* Hero */}
      <section className="relative py-20 px-6 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-sirak-red/5 to-transparent pointer-events-none" />
        <div className="relative max-w-[1400px] mx-auto">
          <h1 className="font-[family-name:var(--font-teko)] text-6xl md:text-8xl font-bold uppercase tracking-wider text-white">
            Our Work
          </h1>
          <p className="mt-4 text-lg text-sirak-text-secondary max-w-2xl mx-auto">
            A selection of projects across photography, videography, and creative production.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="max-w-[1400px] mx-auto px-6 pb-8">
        <div className="flex flex-wrap gap-3 justify-center">
          {PORTFOLIO_CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`px-5 py-2 text-sm font-semibold uppercase tracking-wider transition-all duration-300 ${
                activeFilter === category
                  ? 'bg-sirak-red text-white'
                  : 'glass text-sirak-text-secondary hover:text-white hover:border-sirak-text-tertiary'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="max-w-[1400px] mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <ScrollReveal key={item.id}>
              <div className="group relative aspect-[4/3] overflow-hidden rounded-xl cursor-pointer">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-sirak-black/80 via-sirak-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                  <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-sirak-red text-white rounded-full w-fit mb-2">
                    {item.category}
                  </span>
                  <h3 className="font-[family-name:var(--font-teko)] text-2xl font-bold uppercase tracking-wider text-white">
                    {item.title}
                  </h3>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-20 text-sirak-text-tertiary">
            <p className="text-lg">No items in this category yet.</p>
          </div>
        )}
      </section>

      {/* YouTube Playlists */}
      <section className="border-t border-sirak-border">
        <div className="max-w-[1400px] mx-auto px-6 py-20">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="font-[family-name:var(--font-teko)] text-4xl md:text-5xl font-bold uppercase tracking-wider text-white">
                Video Playlists
              </h2>
              <p className="mt-4 text-sirak-text-secondary">
                Browse our full video library on YouTube.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {YOUTUBE_PLAYLISTS.map((playlist) => (
              <ScrollReveal key={playlist.id}>
                <div className="aspect-video rounded-xl overflow-hidden border border-sirak-border bg-sirak-surface">
                  <iframe
                    src={`https://www.youtube.com/embed/videoseries?list=${playlist.id}`}
                    title={playlist.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                    loading="lazy"
                  />
                </div>
                <p className="mt-2 text-sm text-sirak-text-secondary uppercase tracking-wider text-center">
                  {playlist.title}
                </p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
