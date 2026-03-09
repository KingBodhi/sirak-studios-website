'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'
import { SITE } from '@/data/content'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

const SUBJECT_OPTIONS = [
  'General Inquiry',
  'Booking Question',
  'Quote Request',
  'Partnership',
] as const

interface FormData {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

export default function ContactPage() {
  const [form, setForm] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  function update(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setStatus('sending')
    setErrorMessage('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Something went wrong. Please try again.')
      }

      setStatus('success')
      setForm({ name: '', email: '', phone: '', subject: '', message: '' })
    } catch (err) {
      setStatus('error')
      setErrorMessage(
        err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      )
    }
  }

  const inputClasses =
    'w-full bg-sirak-card border border-sirak-border text-white rounded-lg px-4 py-3 placeholder:text-sirak-text-tertiary focus:outline-none focus:border-sirak-red transition-colors'

  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Hero */}
      <ScrollReveal>
        <section className="text-center px-6 mb-16">
          <h1 className="font-[family-name:var(--font-teko)] uppercase text-5xl sm:text-6xl md:text-7xl text-white tracking-wide">
            Get In Touch
          </h1>
          <p className="text-sirak-text-secondary text-lg mt-3 max-w-xl mx-auto">
            Let&apos;s discuss your next project
          </p>
        </section>
      </ScrollReveal>

      {/* Two-column layout */}
      <ScrollReveal>
        <section className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-3">
              <div className="glass rounded-xl p-6 sm:p-8">
                {status === 'success' ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-sirak-red/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-sirak-red" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="font-[family-name:var(--font-teko)] uppercase text-3xl text-white tracking-wide mb-2">
                      Message Sent
                    </h3>
                    <p className="text-sirak-text-secondary mb-6">
                      We&apos;ll get back to you within 24 hours.
                    </p>
                    <button
                      onClick={() => setStatus('idle')}
                      className="text-sirak-cyan hover:underline text-sm"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm text-sirak-text-secondary mb-1.5">
                          Name <span className="text-sirak-red">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={form.name}
                          onChange={(e) => update('name', e.target.value)}
                          placeholder="Your name"
                          className={inputClasses}
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-sirak-text-secondary mb-1.5">
                          Email <span className="text-sirak-red">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={form.email}
                          onChange={(e) => update('email', e.target.value)}
                          placeholder="your@email.com"
                          className={inputClasses}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm text-sirak-text-secondary mb-1.5">
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={(e) => update('phone', e.target.value)}
                          placeholder="(555) 555-5555"
                          className={inputClasses}
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-sirak-text-secondary mb-1.5">
                          Subject
                        </label>
                        <select
                          value={form.subject}
                          onChange={(e) => update('subject', e.target.value)}
                          className={`${inputClasses} appearance-none cursor-pointer`}
                        >
                          <option value="" className="bg-sirak-card">
                            Select a subject
                          </option>
                          {SUBJECT_OPTIONS.map((opt) => (
                            <option key={opt} value={opt} className="bg-sirak-card">
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-sirak-text-secondary mb-1.5">
                        Message <span className="text-sirak-red">*</span>
                      </label>
                      <textarea
                        required
                        rows={5}
                        value={form.message}
                        onChange={(e) => update('message', e.target.value)}
                        placeholder="Tell us about your project..."
                        className={`${inputClasses} resize-none`}
                      />
                    </div>

                    {status === 'error' && (
                      <p className="text-sirak-red text-sm">{errorMessage}</p>
                    )}

                    <button
                      type="submit"
                      disabled={status === 'sending'}
                      className="w-full bg-sirak-red text-white font-semibold py-3 rounded-lg hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {status === 'sending' ? 'Sending...' : 'Send Message'}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="glass rounded-xl p-6">
                <h3 className="font-[family-name:var(--font-teko)] uppercase text-2xl text-white tracking-wide mb-5">
                  Contact Info
                </h3>
                <ul className="space-y-4 text-sm">
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-sirak-red mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                    <div>
                      <p className="text-sirak-text-tertiary mb-0.5">Phone</p>
                      <a
                        href={`tel:${SITE.phone.replace(/\D/g, '')}`}
                        className="text-sirak-text hover:text-sirak-cyan transition-colors"
                      >
                        {SITE.phone}
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-sirak-red mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                    <div>
                      <p className="text-sirak-text-tertiary mb-0.5">Email</p>
                      <a
                        href={`mailto:${SITE.email}`}
                        className="text-sirak-text hover:text-sirak-cyan transition-colors"
                      >
                        {SITE.email}
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-sirak-red mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    <div>
                      <p className="text-sirak-text-tertiary mb-0.5">Address</p>
                      <p className="text-sirak-text">{SITE.address}</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-sirak-red mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-sirak-text-tertiary mb-0.5">Hours</p>
                      <p className="text-sirak-text">Mon &ndash; Fri: 9AM &ndash; 9PM</p>
                      <p className="text-sirak-text">Sat &ndash; Sun: 10AM &ndash; 6PM</p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Map Placeholder */}
              <div className="glass rounded-xl p-6">
                <div className="bg-sirak-card rounded-lg aspect-[4/3] flex flex-col items-center justify-center text-center p-6">
                  <svg className="w-8 h-8 text-sirak-red mb-3" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  <p className="text-sirak-text font-medium mb-1">Sirak Studios</p>
                  <p className="text-sirak-text-secondary text-sm">{SITE.address}</p>
                </div>
              </div>

              {/* Social Links */}
              <div className="glass rounded-xl p-6">
                <h3 className="font-[family-name:var(--font-teko)] uppercase text-2xl text-white tracking-wide mb-4">
                  Follow Us
                </h3>
                <div className="flex gap-3">
                  {[
                    { label: 'Instagram', href: SITE.instagram },
                    { label: 'YouTube', href: SITE.youtube },
                    { label: 'Facebook', href: SITE.facebook },
                    { label: 'X / Twitter', href: SITE.twitter },
                  ].map((social) => (
                    <Link
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-sirak-card border border-sirak-border rounded-lg px-4 py-2 text-sm text-sirak-text-secondary hover:text-sirak-red hover:border-sirak-red transition-colors"
                    >
                      {social.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  )
}
