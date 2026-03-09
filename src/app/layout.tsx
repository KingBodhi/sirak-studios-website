import type { Metadata } from 'next'
import { Inter, Teko } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/ui/Navbar'
import { Footer } from '@/components/ui/Footer'
import { JsonLd } from '@/components/seo/JsonLd'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const teko = Teko({
  subsets: ['latin'],
  variable: '--font-teko',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Sirak Studios | Miami Creative Agency & Production Studio',
  description: 'Miami creative agency offering brand identity, website & SEO, social media management, and full-scale content production. Strategy to execution under one roof.',
  keywords: 'miami creative agency, brand identity miami, social media management miami, photography miami, videography miami, website design miami, SEO miami, production studio miami',
  openGraph: {
    title: 'Sirak Studios | Strategy. Creative. Production.',
    description: 'Miami creative agency — brand strategy, digital presence, and content production under one roof.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Sirak Studios',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${teko.variable}`}>
      <body className="bg-sirak-black text-sirak-text font-[family-name:var(--font-inter)] antialiased">
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            name: 'Sirak Studios',
            description: 'Miami creative agency specializing in brand identity, digital strategy, social media management, and full-scale content production.',
            address: {
              '@type': 'PostalAddress',
              streetAddress: '2219 NW 28th St',
              addressLocality: 'Miami',
              addressRegion: 'FL',
              postalCode: '33142',
              addressCountry: 'US',
            },
            telephone: '(305) 555-0199',
            email: 'aaren@sirakstudios.com',
            url: 'https://sirakstudios.com',
            image: 'https://sirakstudios.com/images/KuCRzRSM4Sk7C6Yk216onWukokQ.png',
            priceRange: '$$',
            foundingDate: '2019',
            sameAs: [
              'https://instagram.com/sirakstudio',
              'https://youtube.com/@sirakstudios',
              'https://facebook.com/sirakstudios',
              'https://x.com/sirakstudios',
            ],
            hasOfferCatalog: {
              '@type': 'OfferCatalog',
              name: 'Creative Agency & Production Services',
              itemListElement: [
                { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Brand Identity & Development', description: 'Brand strategy, visual identity, logo design, and brand guidelines' } },
                { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Website Design & SEO', description: 'Custom website design, development, and search engine optimization' } },
                { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Social Media Management', description: 'Platform strategy, content creation, community management, and analytics' } },
                { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Photography', description: 'Commercial, portrait, event, and real estate photography' } },
                { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Videography', description: 'Music videos, commercials, brand content, and event recaps' } },
                { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Music Production', description: 'Professional recording, mixing, and mastering with engineer' } },
                { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Studio Rentals', description: 'Photo/video stage and recording studio for rent' } },
                { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Graphic Design', description: 'Logos, flyers, album covers, and brand identity' } },
                { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Drone Services', description: 'Licensed aerial photography and videography' } },
              ],
            },
          }}
        />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
