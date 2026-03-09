import Image from 'next/image'
import Link from 'next/link'
import { SITE, SERVICES } from '@/data/content'

export function Footer() {
  return (
    <footer className="bg-sirak-surface border-t border-sirak-border">
      <div className="max-w-[1400px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <Link href="/" className="relative inline-block h-12 w-44">
              <Image
                src="/images/sirak-logo-nav.png"
                alt="Sirak Studios"
                fill
                className="object-contain object-left brightness-0 invert"
                sizes="176px"
              />
            </Link>
            <p className="mt-4 text-sm text-sirak-text-secondary leading-relaxed">
              Full-service creative production company in Miami. From concept to delivery, we bring your vision to life.
            </p>
            <div className="flex gap-4 mt-6">
              {[
                { href: SITE.instagram, label: 'IG' },
                { href: SITE.youtube, label: 'YT' },
                { href: SITE.facebook, label: 'FB' },
                { href: SITE.twitter, label: 'X' },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center border border-sirak-border text-sirak-text-tertiary hover:bg-sirak-red hover:border-sirak-red hover:text-white transition-all duration-300 text-xs font-semibold tracking-wider"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-[family-name:var(--font-teko)] text-xl uppercase tracking-wider text-white mb-4">Services</h4>
            <ul className="space-y-2">
              {SERVICES.map((s) => (
                <li key={s.id}>
                  <Link href={`/services#${s.id}`} className="text-sm text-sirak-text-secondary hover:text-sirak-red transition-colors">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-[family-name:var(--font-teko)] text-xl uppercase tracking-wider text-white mb-4">Company</h4>
            <ul className="space-y-2">
              {[
                { label: 'Portfolio', href: '/portfolio' },
                { label: 'Studio', href: '/studio' },
                { label: 'Pricing', href: '/pricing' },
                { label: 'Book a Session', href: '/book' },
                { label: 'Contact', href: '/contact' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-sirak-text-secondary hover:text-sirak-red transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-[family-name:var(--font-teko)] text-xl uppercase tracking-wider text-white mb-4">Contact</h4>
            <div className="space-y-3 text-sm text-sirak-text-secondary">
              <a href={`tel:${SITE.phone}`} className="block hover:text-sirak-red transition-colors">
                {SITE.phone}
              </a>
              <a href={`mailto:${SITE.email}`} className="block hover:text-sirak-red transition-colors">
                {SITE.email}
              </a>
              <p>{SITE.address}</p>
              <div className="pt-2 border-t border-sirak-border mt-4">
                <p className="text-sirak-text-tertiary text-xs uppercase tracking-wider mb-1">Hours</p>
                <p>Mon — Fri: 9AM — 9PM</p>
                <p>Sat — Sun: 10AM — 6PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-sirak-border">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-sirak-text-tertiary">
          <p>&copy; {new Date().getFullYear()} Sirak Studios LLC. All rights reserved.</p>
          <p>Miami, Florida &mdash; Since {SITE.founded}</p>
        </div>
      </div>
    </footer>
  )
}
