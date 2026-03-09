'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { NAV_LINKS, SITE } from '@/data/content'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-sirak-black/95 backdrop-blur-sm shadow-lg shadow-black/20 border-b border-sirak-border'
          : 'bg-transparent'
      }`}
    >
      {/* Top bar with phone */}
      <div className={`text-center text-xs tracking-widest uppercase transition-all duration-300 overflow-hidden ${
        scrolled ? 'h-0 opacity-0' : 'h-8 opacity-100 bg-sirak-red/50 text-white'
      }`}>
        <div className="h-full flex items-center justify-center gap-6">
          <a href={`tel:${SITE.phone.replace(/\D/g, '')}`} className="font-semibold hover:text-white/80 transition-colors">{SITE.phone}</a>
          <span className="text-white/40">|</span>
          <span className="text-white/90">{SITE.address}</span>
        </div>
      </div>

      <nav className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="relative h-10 w-36 block">
          <Image
            src="/images/sirak-logo-nav.png"
            alt="Sirak Studios"
            fill
            className="object-contain brightness-0 invert"
            sizes="144px"
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative text-sm tracking-widest uppercase text-sirak-text-secondary hover:text-white transition-colors group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-sirak-red transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
          <Link
            href="/book"
            className="px-5 py-2 bg-sirak-red text-white text-sm font-semibold uppercase tracking-wider hover:bg-white hover:text-sirak-black transition-all duration-300 animate-pulse-glow"
          >
            Book Now
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Toggle menu"
        >
          <span className={`w-6 h-[2px] bg-white transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-[5px]' : ''}`} />
          <span className={`w-6 h-[2px] bg-white transition-all duration-300 ${mobileOpen ? 'opacity-0 scale-0' : ''}`} />
          <span className={`w-6 h-[2px] bg-white transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-[5px]' : ''}`} />
        </button>
      </nav>

      {/* Mobile Menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${
        mobileOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="glass border-t border-sirak-border px-6 py-4 space-y-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block py-3 text-sm tracking-widest uppercase text-sirak-text-secondary hover:text-white hover:pl-2 transition-all border-b border-sirak-border/50"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/book"
            onClick={() => setMobileOpen(false)}
            className="block mt-4 py-3 text-center bg-sirak-red text-white text-sm font-semibold uppercase tracking-wider"
          >
            Book Now
          </Link>
        </div>
      </div>
    </header>
  )
}
