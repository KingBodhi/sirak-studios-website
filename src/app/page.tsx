import type { Metadata } from 'next'
import HomePageClient from './HomePageClient'

export const metadata: Metadata = {
  title: 'Sirak Studios | Miami Creative Agency — Brand Strategy & Production',
  description: 'Miami creative agency specializing in brand identity, website design & SEO, social media management, and full-scale content production. From strategy to execution. Trusted by E11EVEN, Compass, and 500+ projects.',
  keywords: 'miami creative agency, brand identity miami, social media management miami, website design miami, SEO miami, photography miami, videography miami, production studio miami, brand strategy miami',
  openGraph: {
    title: 'Sirak Studios | Strategy. Creative. Production.',
    description: 'Miami creative agency — brand strategy, digital presence, social media, and content production under one roof.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Sirak Studios',
    images: [{ url: 'https://sirakstudios.com/images/KuCRzRSM4Sk7C6Yk216onWukokQ.png', width: 2000, height: 2000, alt: 'Sirak Studios' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sirak Studios | Strategy. Creative. Production.',
    description: 'Miami creative agency — brand strategy, digital presence, and content production.',
  },
  alternates: {
    canonical: 'https://sirakstudios.com',
  },
}

export default function HomePage() {
  return <HomePageClient />
}
