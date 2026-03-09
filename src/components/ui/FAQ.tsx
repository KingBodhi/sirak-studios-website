'use client'

import { useState } from 'react'
import { FAQS } from '@/data/content'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <ScrollReveal>
      <section className="max-w-3xl mx-auto px-6 mb-20">
        <h2 className="font-[family-name:var(--font-teko)] uppercase text-4xl sm:text-5xl text-white tracking-wide text-center mb-10">
          Frequently Asked <span className="text-sirak-red">Questions</span>
        </h2>
        <div className="space-y-3">
          {FAQS.map((faq, i) => {
            const isOpen = openIndex === i
            return (
              <div key={i} className="glass rounded-lg overflow-hidden">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full text-left px-5 py-4 flex justify-between items-center gap-4"
                  aria-expanded={isOpen}
                >
                  <span className="text-white font-medium text-sm sm:text-base">
                    {faq.question}
                  </span>
                  <svg
                    className={`w-5 h-5 text-sirak-red shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-4 text-sirak-text-secondary text-sm leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </ScrollReveal>
  )
}
