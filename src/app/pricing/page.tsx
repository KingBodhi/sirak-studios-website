import type { Metadata } from 'next'
import PricingPageClient from './PricingPageClient'
import { JsonLd } from '@/components/seo/JsonLd'
import { FAQS } from '@/data/content'

export const metadata: Metadata = {
  title: 'Pricing | Sirak Studios — Photography & Videography Rates Miami',
  description: 'Transparent pricing for photography, videography, music production, studio rentals, and production services in Miami. Crew rates from $300/hr. No hidden fees.',
  keywords: 'miami photography pricing, videography rates miami, studio rental cost miami, music production rates, event photography pricing, drone photography cost',
  openGraph: {
    title: 'Pricing | Sirak Studios — Transparent Rates',
    description: 'No hidden fees. Crew rates, studio bookings, packages, and add-ons for creative production in Miami.',
    type: 'website',
  },
  alternates: {
    canonical: 'https://sirakstudios.com/pricing',
  },
}

export default function PricingPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <>
      <JsonLd data={faqSchema} />
      <PricingPageClient />
    </>
  )
}
