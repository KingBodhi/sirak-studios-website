'use client'

import { useState, useEffect, useMemo, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { SERVICES, TIME_SLOTS, PRICING, SITE } from '@/data/content'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

/* ── Types ── */
type StudioType = 'photo-video' | 'recording' | null

interface BookingForm {
  name: string
  email: string
  phone: string
  message: string
}

/* ── Calendar helpers ── */
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const DAY_HEADERS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfWeek(year: number, month: number): number {
  return new Date(year, month, 1).getDay()
}

function isToday(year: number, month: number, day: number): boolean {
  const now = new Date()
  return now.getFullYear() === year && now.getMonth() === month && now.getDate() === day
}

function isPast(year: number, month: number, day: number): boolean {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const check = new Date(year, month, day)
  return check < today
}

/* ── Pricing helper ── */
function getEstimatedPrice(serviceId: string, studioType: StudioType, duration: number): number | null {
  if (serviceId === 'studio-rental' || serviceId === 'music-production') {
    const table = serviceId === 'music-production' || studioType === 'recording'
      ? PRICING.recordingStudio
      : PRICING.photoVideoStudio

    // Find matching tier
    for (const tier of table.tiers) {
      const match = tier.duration.match(/(\d+)(?:-(\d+))?\s*hours?/)
      if (match) {
        const low = parseInt(match[1])
        const high = match[2] ? parseInt(match[2]) : low
        if (duration >= low && duration <= high) return tier.price
      }
    }
    // If duration exceeds all tiers, use last tier
    const lastTier = table.tiers[table.tiers.length - 1]
    return lastTier.price
  }

  // Crew-based services
  for (const tier of PRICING.crew.tiers) {
    const match = tier.duration.match(/(\d+)\s*hours?/)
    if (match && parseInt(match[1]) === duration) return tier.price
  }
  // Interpolate or use closest
  const sorted = PRICING.crew.tiers
    .map(t => ({ hours: parseInt(t.duration), price: t.price }))
    .sort((a, b) => a.hours - b.hours)
  const closest = sorted.reduce((prev, curr) =>
    Math.abs(curr.hours - duration) < Math.abs(prev.hours - duration) ? curr : prev
  )
  return closest.price
}

/* ── Step indicator ── */
function StepIndicator({ currentStep }: { currentStep: number }) {
  const steps = ['Service', 'Date & Time', 'Details', 'Confirm']
  return (
    <div className="mb-10">
      {/* Progress bar */}
      <div className="h-1 w-full bg-sirak-card rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-sirak-red transition-all duration-500 ease-out rounded-full"
          style={{ width: `${(currentStep / 4) * 100}%` }}
        />
      </div>

      {/* Step labels */}
      <div className="flex justify-between">
        {steps.map((label, i) => {
          const stepNum = i + 1
          const isActive = stepNum === currentStep
          const isDone = stepNum < currentStep
          return (
            <div key={label} className="flex flex-col items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                  isDone
                    ? 'bg-sirak-red text-white'
                    : isActive
                    ? 'bg-sirak-red text-white'
                    : 'bg-sirak-card text-sirak-text-tertiary border border-sirak-border'
                }`}
              >
                {isDone ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  stepNum
                )}
              </div>
              <span
                className={`text-xs uppercase tracking-wider hidden sm:block ${
                  isActive || isDone ? 'text-sirak-text' : 'text-sirak-text-tertiary'
                }`}
              >
                {label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ── Calendar component ── */
function Calendar({
  selectedDate,
  onSelect,
}: {
  selectedDate: Date | null
  onSelect: (date: Date) => void
}) {
  const [viewYear, setViewYear] = useState(() => new Date().getFullYear())
  const [viewMonth, setViewMonth] = useState(() => new Date().getMonth())

  const daysInMonth = getDaysInMonth(viewYear, viewMonth)
  const firstDay = getFirstDayOfWeek(viewYear, viewMonth)

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear(y => y - 1)
    } else {
      setViewMonth(m => m - 1)
    }
  }

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear(y => y + 1)
    } else {
      setViewMonth(m => m + 1)
    }
  }

  // Prevent navigating to past months
  const now = new Date()
  const canGoPrev = viewYear > now.getFullYear() || (viewYear === now.getFullYear() && viewMonth > now.getMonth())

  const isSelected = (day: number) => {
    if (!selectedDate) return false
    return (
      selectedDate.getFullYear() === viewYear &&
      selectedDate.getMonth() === viewMonth &&
      selectedDate.getDate() === day
    )
  }

  // Build grid cells: leading blanks + days
  const cells: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div className="glass rounded-lg p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          disabled={!canGoPrev}
          className={`w-9 h-9 rounded flex items-center justify-center transition-colors ${
            canGoPrev
              ? 'hover:bg-sirak-card text-sirak-text'
              : 'text-sirak-text-tertiary cursor-not-allowed opacity-30'
          }`}
          aria-label="Previous month"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <h3 className="font-[family-name:var(--font-teko)] uppercase text-2xl text-white tracking-wide">
          {MONTH_NAMES[viewMonth]} {viewYear}
        </h3>

        <button
          onClick={nextMonth}
          className="w-9 h-9 rounded flex items-center justify-center hover:bg-sirak-card text-sirak-text transition-colors"
          aria-label="Next month"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 mb-2">
        {DAY_HEADERS.map(d => (
          <div key={d} className="text-center text-xs uppercase tracking-wider text-sirak-text-tertiary py-2">
            {d}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (day === null) {
            return <div key={`blank-${i}`} />
          }

          const past = isPast(viewYear, viewMonth, day)
          const today = isToday(viewYear, viewMonth, day)
          const selected = isSelected(day)

          return (
            <button
              key={`day-${day}`}
              disabled={past}
              onClick={() => onSelect(new Date(viewYear, viewMonth, day))}
              className={`h-10 rounded text-sm font-medium transition-all ${
                selected
                  ? 'bg-sirak-red text-white'
                  : past
                  ? 'text-sirak-text-tertiary/40 cursor-not-allowed'
                  : today
                  ? 'bg-sirak-card text-sirak-cyan border border-sirak-cyan/30 hover:border-sirak-cyan'
                  : 'text-sirak-text hover:bg-sirak-card'
              }`}
            >
              {day}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ── Input field component ── */
function InputField({
  label,
  type = 'text',
  value,
  onChange,
  required = false,
  placeholder,
}: {
  label: string
  type?: string
  value: string
  onChange: (v: string) => void
  required?: boolean
  placeholder?: string
}) {
  return (
    <div>
      <label className="block text-sm text-sirak-text-secondary mb-2">
        {label} {required && <span className="text-sirak-red">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className="w-full bg-sirak-card border border-sirak-border focus:border-sirak-red text-white rounded px-4 py-3 outline-none transition-colors placeholder:text-sirak-text-tertiary"
      />
    </div>
  )
}

/* ── Main booking page content (needs Suspense boundary for useSearchParams) ── */
function BookingContent() {
  const searchParams = useSearchParams()
  const preSelectedService = searchParams.get('service')

  const [step, setStep] = useState(1)
  const [selectedService, setSelectedService] = useState<string | null>(preSelectedService)
  const [studioType, setStudioType] = useState<StudioType>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [duration, setDuration] = useState(2)
  const [form, setForm] = useState<BookingForm>({ name: '', email: '', phone: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // Pre-select service from URL
  useEffect(() => {
    if (preSelectedService && SERVICES.find(s => s.id === preSelectedService)) {
      setSelectedService(preSelectedService)
    }
  }, [preSelectedService])

  const selectedServiceData = useMemo(
    () => SERVICES.find(s => s.id === selectedService),
    [selectedService]
  )

  const needsStudioType = selectedService === 'studio-rental' || selectedService === 'music-production'

  const estimatedPrice = useMemo(() => {
    if (!selectedService) return null
    return getEstimatedPrice(selectedService, studioType, duration)
  }, [selectedService, studioType, duration])

  const canProceed = useCallback((): boolean => {
    switch (step) {
      case 1:
        return !!selectedService && (!needsStudioType || !!studioType)
      case 2:
        return !!selectedDate && !!selectedTime
      case 3:
        return !!form.name.trim() && !!form.email.trim() && !!form.phone.trim()
      default:
        return true
    }
  }, [step, selectedService, needsStudioType, studioType, selectedDate, selectedTime, form])

  const formatDate = (date: Date | null) => {
    if (!date) return ''
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      const payload = {
        service: selectedService,
        studioType,
        date: selectedDate?.toISOString(),
        time: selectedTime,
        duration,
        estimatedPrice,
        ...form,
      }
      await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      setSubmitted(true)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Booking failed. Please try again or call us directly.')
    } finally {
      setSubmitting(false)
    }
  }

  /* ── Success state ── */
  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-6">
        <ScrollReveal>
          <div className="glass rounded-lg p-10 max-w-lg mx-auto text-center">
            <div className="w-16 h-16 bg-sirak-red/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-sirak-red" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h2 className="font-[family-name:var(--font-teko)] uppercase text-4xl sm:text-5xl text-white mb-4 leading-[0.95]">
              Booking <span className="text-sirak-red">Confirmed!</span>
            </h2>

            <div className="space-y-3 text-left bg-sirak-card rounded-lg p-5 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-sirak-text-secondary">Service</span>
                <span className="text-white font-medium">{selectedServiceData?.title}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-sirak-text-secondary">Date</span>
                <span className="text-white font-medium">{formatDate(selectedDate)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-sirak-text-secondary">Time</span>
                <span className="text-white font-medium">{selectedTime}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-sirak-text-secondary">Duration</span>
                <span className="text-white font-medium">{duration} hour{duration > 1 ? 's' : ''}</span>
              </div>
              {estimatedPrice && (
                <div className="flex justify-between text-sm pt-3 border-t border-sirak-border">
                  <span className="text-sirak-text-secondary">Estimated Total</span>
                  <span className="text-sirak-red font-semibold text-lg">${estimatedPrice.toLocaleString()}</span>
                </div>
              )}
            </div>

            <p className="text-sirak-text-secondary text-sm mb-6">
              We&apos;ll contact you within 24 hours to confirm your session details.
            </p>

            <a
              href={`tel:${SITE.phone.replace(/\D/g, '')}`}
              className="text-sirak-cyan hover:underline text-sm"
            >
              Questions? Call {SITE.phone}
            </a>
          </div>
        </ScrollReveal>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <StepIndicator currentStep={step} />

      {/* ══════ STEP 1: Service Selection ══════ */}
      {step === 1 && (
        <ScrollReveal>
          <div>
            <h2 className="font-[family-name:var(--font-teko)] uppercase text-3xl sm:text-4xl text-white mb-2 leading-[0.95]">
              Choose a <span className="text-sirak-red">Service</span>
            </h2>
            <p className="text-sirak-text-secondary text-sm mb-8">
              Select the service you&apos;d like to book.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SERVICES.map(service => {
                const isSelected = selectedService === service.id
                return (
                  <button
                    key={service.id}
                    onClick={() => {
                      setSelectedService(service.id)
                      // Reset studio type when changing service
                      if (service.id !== 'studio-rental' && service.id !== 'music-production') {
                        setStudioType(null)
                      }
                    }}
                    className={`relative text-left p-5 rounded-lg transition-all duration-200 ${
                      isSelected
                        ? 'border-2 border-sirak-red bg-sirak-red/5'
                        : 'glass hover:bg-sirak-card'
                    }`}
                  >
                    {/* Checkmark */}
                    {isSelected && (
                      <div className="absolute top-3 right-3 w-6 h-6 bg-sirak-red rounded-full flex items-center justify-center">
                        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}

                    <h3 className="font-semibold text-white text-lg">{service.title}</h3>
                    <p className="text-sirak-text-tertiary text-xs mt-1">{service.subtitle}</p>
                    <p className="text-sirak-red text-sm font-semibold mt-2">
                      From ${service.startingAt}
                    </p>
                  </button>
                )
              })}
            </div>

            {/* Studio type sub-selection */}
            {needsStudioType && (
              <div className="mt-6">
                <h3 className="text-white font-semibold mb-3">Select Studio Type</h3>
                <div className="flex gap-3">
                  {[
                    { id: 'photo-video' as StudioType, label: 'Photo/Video Stage', price: '$1,000+' },
                    { id: 'recording' as StudioType, label: 'Recording Studio', price: '$700+' },
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setStudioType(opt.id)}
                      className={`flex-1 p-4 rounded-lg text-left transition-all ${
                        studioType === opt.id
                          ? 'border-2 border-sirak-red bg-sirak-red/5'
                          : 'glass hover:bg-sirak-card'
                      }`}
                    >
                      <span className="text-white font-medium block">{opt.label}</span>
                      <span className="text-sirak-text-tertiary text-xs">{opt.price}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollReveal>
      )}

      {/* ══════ STEP 2: Date & Time ══════ */}
      {step === 2 && (
        <ScrollReveal>
          <div>
            <h2 className="font-[family-name:var(--font-teko)] uppercase text-3xl sm:text-4xl text-white mb-2 leading-[0.95]">
              Pick a <span className="text-sirak-red">Date & Time</span>
            </h2>
            <p className="text-sirak-text-secondary text-sm mb-8">
              Choose your preferred session date and start time.
            </p>

            {/* Calendar */}
            <Calendar selectedDate={selectedDate} onSelect={setSelectedDate} />

            {/* Selected date label */}
            {selectedDate && (
              <p className="text-sirak-text-secondary text-sm mt-4 mb-2">
                Selected: <span className="text-white font-medium">{formatDate(selectedDate)}</span>
              </p>
            )}

            {/* Time slots */}
            <div className="mt-6">
              <h3 className="text-white font-semibold mb-3">Available Time Slots</h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                {TIME_SLOTS.map(slot => (
                  <button
                    key={slot}
                    onClick={() => setSelectedTime(slot)}
                    className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedTime === slot
                        ? 'bg-sirak-red text-white'
                        : 'bg-sirak-card border border-sirak-border text-sirak-text-secondary hover:border-sirak-red hover:text-white'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>
      )}

      {/* ══════ STEP 3: Duration & Details ══════ */}
      {step === 3 && (
        <ScrollReveal>
          <div>
            <h2 className="font-[family-name:var(--font-teko)] uppercase text-3xl sm:text-4xl text-white mb-2 leading-[0.95]">
              Session <span className="text-sirak-red">Details</span>
            </h2>
            <p className="text-sirak-text-secondary text-sm mb-8">
              Set your session length and provide your contact info.
            </p>

            {/* Duration selector */}
            <div className="mb-8">
              <label className="block text-sm text-sirak-text-secondary mb-3">Duration (hours)</label>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(h => (
                  <button
                    key={h}
                    onClick={() => setDuration(h)}
                    className={`w-12 h-12 rounded-lg text-sm font-semibold transition-all ${
                      duration === h
                        ? 'bg-sirak-red text-white'
                        : 'bg-sirak-card border border-sirak-border text-sirak-text-secondary hover:border-sirak-red hover:text-white'
                    }`}
                  >
                    {h}h
                  </button>
                ))}
              </div>

              {/* Estimated price */}
              {estimatedPrice && (
                <div className="mt-4 glass rounded-lg px-5 py-4 flex items-center justify-between">
                  <span className="text-sirak-text-secondary text-sm">Estimated Price</span>
                  <span className="text-sirak-red font-[family-name:var(--font-teko)] text-3xl">
                    ${estimatedPrice.toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            {/* Contact form */}
            <div className="space-y-4">
              <InputField
                label="Full Name"
                value={form.name}
                onChange={v => setForm(f => ({ ...f, name: v }))}
                required
                placeholder="Your name"
              />
              <InputField
                label="Email"
                type="email"
                value={form.email}
                onChange={v => setForm(f => ({ ...f, email: v }))}
                required
                placeholder="you@example.com"
              />
              <InputField
                label="Phone"
                type="tel"
                value={form.phone}
                onChange={v => setForm(f => ({ ...f, phone: v }))}
                required
                placeholder="(305) 555-0000"
              />
              <div>
                <label className="block text-sm text-sirak-text-secondary mb-2">
                  Message <span className="text-sirak-text-tertiary">(optional)</span>
                </label>
                <textarea
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  rows={4}
                  placeholder="Tell us about your project or any special requirements..."
                  className="w-full bg-sirak-card border border-sirak-border focus:border-sirak-red text-white rounded px-4 py-3 outline-none transition-colors placeholder:text-sirak-text-tertiary resize-none"
                />
              </div>
            </div>
          </div>
        </ScrollReveal>
      )}

      {/* ══════ STEP 4: Confirmation ══════ */}
      {step === 4 && (
        <ScrollReveal>
          <div>
            <h2 className="font-[family-name:var(--font-teko)] uppercase text-3xl sm:text-4xl text-white mb-2 leading-[0.95]">
              Review & <span className="text-sirak-red">Confirm</span>
            </h2>
            <p className="text-sirak-text-secondary text-sm mb-8">
              Double-check your booking details before confirming.
            </p>

            {/* Summary card */}
            <div className="glass rounded-lg p-6 space-y-4 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-sirak-text-secondary text-sm">Service</span>
                <span className="text-white font-medium">{selectedServiceData?.title}</span>
              </div>

              {studioType && (
                <div className="flex justify-between items-center">
                  <span className="text-sirak-text-secondary text-sm">Studio Type</span>
                  <span className="text-white font-medium">
                    {studioType === 'photo-video' ? 'Photo/Video Stage' : 'Recording Studio'}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="text-sirak-text-secondary text-sm">Date</span>
                <span className="text-white font-medium">{formatDate(selectedDate)}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sirak-text-secondary text-sm">Time</span>
                <span className="text-white font-medium">{selectedTime}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sirak-text-secondary text-sm">Duration</span>
                <span className="text-white font-medium">{duration} hour{duration > 1 ? 's' : ''}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sirak-text-secondary text-sm">Contact</span>
                <span className="text-white font-medium text-right text-sm">
                  {form.name}<br />
                  <span className="text-sirak-text-tertiary">{form.email}</span>
                </span>
              </div>

              {estimatedPrice && (
                <div className="flex justify-between items-center pt-4 border-t border-sirak-border">
                  <span className="text-sirak-text-secondary font-medium">Estimated Total</span>
                  <span className="text-sirak-red font-[family-name:var(--font-teko)] text-4xl">
                    ${estimatedPrice.toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm button */}
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full bg-sirak-red text-white font-semibold py-4 rounded-lg text-lg uppercase tracking-wider hover:brightness-110 transition-all animate-pulse-glow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Processing...
                </span>
              ) : (
                'Confirm Booking'
              )}
            </button>

            <p className="text-sirak-text-tertiary text-xs text-center mt-4">
              By confirming, you agree to be contacted regarding your booking.
              Final pricing may vary based on project requirements.
            </p>
          </div>
        </ScrollReveal>
      )}

      {/* ── Navigation buttons ── */}
      <div className="flex justify-between mt-10 pt-6 border-t border-sirak-border">
        {step > 1 ? (
          <button
            onClick={() => setStep(s => s - 1)}
            className="flex items-center gap-2 text-sirak-text-secondary hover:text-white transition-colors px-5 py-3"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        ) : (
          <div />
        )}

        {step < 4 && (
          <button
            onClick={() => setStep(s => s + 1)}
            disabled={!canProceed()}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold uppercase tracking-wider text-sm transition-all ${
              canProceed()
                ? 'bg-sirak-red text-white hover:brightness-110'
                : 'bg-sirak-card text-sirak-text-tertiary cursor-not-allowed'
            }`}
          >
            Next
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

/* ── Page wrapper ── */
export default function BookPage() {
  return (
    <section className="py-24 md:py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <h1
            className="font-[family-name:var(--font-teko)] uppercase text-5xl sm:text-6xl md:text-7xl text-center mb-4 leading-[0.95]"
          >
            Book a <span className="text-sirak-red">Session</span>
          </h1>
          <p className="text-sirak-text-secondary text-center text-lg mb-14 max-w-2xl mx-auto">
            Reserve your studio time in just a few steps.
          </p>
        </ScrollReveal>

        <Suspense fallback={
          <div className="max-w-3xl mx-auto text-center py-20">
            <div className="w-8 h-8 border-2 border-sirak-red border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        }>
          <BookingContent />
        </Suspense>
      </div>
    </section>
  )
}
