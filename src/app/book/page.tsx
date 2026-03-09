import type { Metadata } from 'next'
import BookPageClient from './BookPageClient'

export const metadata: Metadata = {
  title: 'Book Now | Sirak Studios — Schedule Your Session in Miami',
  description: 'Book photography, videography, music production, or studio rental sessions online. Choose your service, pick a date, and confirm in minutes.',
  keywords: 'book photography session miami, schedule videographer miami, studio booking miami, music studio appointment miami',
  openGraph: {
    title: 'Book Now | Sirak Studios',
    description: 'Schedule your creative production session online. Photography, videography, music production, and studio rentals.',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://sirakstudios.com/book',
  },
}

export default function BookPage() {
  return <BookPageClient />
}
