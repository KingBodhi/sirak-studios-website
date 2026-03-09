import type { Metadata } from 'next'
import StudioPageClient from './StudioPageClient'

export const metadata: Metadata = {
  title: 'Studio Rental | Sirak Studios — Miami Production Space',
  description: 'Rent our 1,200 sq ft photo/video stage with 14ft ceilings, cyclorama wall, and professional lighting grid. Recording studio with engineer included. Located in Miami, FL.',
  keywords: 'studio rental miami, photo studio miami, video studio rental miami, recording studio miami, production space miami, cyclorama studio miami',
  openGraph: {
    title: 'Studio Rental | Sirak Studios',
    description: 'Professional photo/video stage and recording studio for rent in Miami. Equipment packages available.',
    type: 'website',
  },
  alternates: {
    canonical: 'https://sirakstudios.com/studio',
  },
}

export default function StudioPage() {
  return <StudioPageClient />
}
