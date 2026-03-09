import type { Metadata } from 'next'
import PortfolioPageClient from './PortfolioPageClient'

export const metadata: Metadata = {
  title: 'Portfolio | Sirak Studios — Our Work in Miami',
  description: 'Browse our portfolio of music videos, commercial productions, event coverage, real estate content, portraits, and aerial drone footage. See why brands like E11EVEN and Compass trust Sirak Studios.',
  keywords: 'miami production portfolio, music video portfolio, event photography miami, commercial videography miami, drone footage miami, real estate photography miami',
  openGraph: {
    title: 'Portfolio | Sirak Studios',
    description: 'A curated selection of projects across photography, videography, and creative production in Miami.',
    type: 'website',
  },
  alternates: {
    canonical: 'https://sirakstudios.com/portfolio',
  },
}

export default function PortfolioPage() {
  return <PortfolioPageClient />
}
