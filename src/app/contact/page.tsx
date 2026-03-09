import type { Metadata } from 'next'
import ContactPageClient from './ContactPageClient'

export const metadata: Metadata = {
  title: 'Contact | Sirak Studios — Get in Touch Miami',
  description: 'Contact Sirak Studios for photography, videography, music production, and studio rental inquiries. Located at 2219 NW 28th St, Miami, FL 33142. Call (305) 555-0199.',
  keywords: 'contact sirak studios, miami production studio contact, photography inquiry miami, book studio miami',
  openGraph: {
    title: 'Contact | Sirak Studios',
    description: 'Get in touch for a free consultation. Photography, videography, music production, and studio rentals in Miami.',
    type: 'website',
  },
  alternates: {
    canonical: 'https://sirakstudios.com/contact',
  },
}

export default function ContactPage() {
  return <ContactPageClient />
}
