import type { Metadata } from 'next'
import ServicesPageClient from './ServicesPageClient'
import { JsonLd } from '@/components/seo/JsonLd'
import { SERVICES, STRATEGIC_SERVICES } from '@/data/content'

export const metadata: Metadata = {
  title: 'Services | Sirak Studios — Brand Strategy, Digital & Production Miami',
  description: 'Brand identity & development, website design & SEO, social media management, photography, videography, and full-scale content production in Miami. Strategy to execution under one roof.',
  keywords: 'brand identity miami, social media management miami, website design miami, SEO agency miami, miami photographer, miami videographer, creative agency miami, brand strategy miami, content production miami',
  openGraph: {
    title: 'Services | Sirak Studios',
    description: 'Brand strategy, digital presence, social media, and content production services in Miami.',
    type: 'website',
  },
  alternates: {
    canonical: 'https://sirakstudios.com/services',
  },
}

export default function ServicesPage() {
  const allServices = [
    ...STRATEGIC_SERVICES.map((s) => ({ name: s.title, description: s.description })),
    ...SERVICES.map((s) => ({ name: s.title, description: s.description, price: s.startingAt })),
  ]

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: allServices.map((service, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Service',
        name: service.name,
        description: service.description,
        provider: {
          '@type': 'LocalBusiness',
          name: 'Sirak Studios',
          address: { '@type': 'PostalAddress', addressLocality: 'Miami', addressRegion: 'FL' },
        },
        ...('price' in service && service.price
          ? {
              offers: {
                '@type': 'Offer',
                priceCurrency: 'USD',
                price: service.price,
                priceSpecification: { '@type': 'PriceSpecification', priceCurrency: 'USD', price: service.price, description: 'Starting price' },
              },
            }
          : {}),
        areaServed: { '@type': 'City', name: 'Miami' },
      },
    })),
  }

  return (
    <>
      <JsonLd data={serviceSchema} />
      <ServicesPageClient />
    </>
  )
}
