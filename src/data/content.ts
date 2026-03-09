export const SITE = {
  name: 'Sirak Studios',
  tagline: 'Strategy. Creative. Production.',
  description: 'Miami creative agency specializing in brand identity, digital strategy, social media management, and full-scale content production. From brand development to final deliverable.',
  phone: '(305) 555-0199',
  email: 'aaren@sirakstudios.com',
  address: '2219 NW 28th St, Miami, FL 33142',
  founded: 2019,
  instagram: 'https://instagram.com/sirakstudio',
  youtube: 'https://youtube.com/@sirakstudios',
  facebook: 'https://facebook.com/sirakstudios',
  twitter: 'https://x.com/sirakstudios',
}

// ── Strategic Services (Agency / Consulting) ──
export const STRATEGIC_SERVICES = [
  {
    id: 'brand-identity',
    title: 'Brand Identity & Development',
    subtitle: 'Strategy, Visual Identity, Brand Guidelines',
    description: 'We build brands from the ground up — or refine existing ones. From logo design and color systems to brand voice, messaging frameworks, and full brand guidelines. Your brand becomes the foundation every piece of content is built on.',
    includes: [
      'Brand discovery & audit',
      'Logo design & visual identity',
      'Color palette & typography system',
      'Brand voice & messaging framework',
      'Brand guidelines document',
      'Collateral design (business cards, letterheads)',
    ],
  },
  {
    id: 'web-seo',
    title: 'Website Design & SEO',
    subtitle: 'Design, Development, Search Optimization',
    description: 'Your online presence is your storefront. We design and develop high-performance websites optimized for conversions and search visibility. From architecture to launch, we handle the full build — then keep you ranking.',
    includes: [
      'Custom website design & development',
      'Mobile-responsive & performance-optimized',
      'SEO strategy & on-page optimization',
      'Google Business Profile setup',
      'Analytics & conversion tracking',
      'Ongoing SEO management available',
    ],
  },
  {
    id: 'social-media',
    title: 'Social Media Management',
    subtitle: 'Strategy, Content Planning, Community Growth',
    description: 'We don\'t just post — we build a social presence that drives real business. Content calendars, platform strategy, community engagement, and performance analytics. We create the content in-house and manage the full pipeline.',
    includes: [
      'Platform strategy & audit',
      'Content calendar & scheduling',
      'Original content creation (photo, video, graphic)',
      'Community management & engagement',
      'Performance reporting & analytics',
      'Paid social ad management',
    ],
  },
]

// ── Process / Deal Flow Pipeline ──
export const PROCESS_STEPS = [
  {
    step: 1,
    title: 'Consult',
    subtitle: 'Discovery & Strategy',
    description: 'We start with your goals. A deep-dive consultation to understand your brand, audience, and competitive landscape.',
  },
  {
    step: 2,
    title: 'Strategize',
    subtitle: 'Brand & Digital Blueprint',
    description: 'We develop a brand identity, digital strategy, and content roadmap tailored to your market and growth targets.',
  },
  {
    step: 3,
    title: 'Produce',
    subtitle: 'Content & Creative Execution',
    description: 'From our Miami studio, we execute — photography, video, audio, design. Every asset built on the strategy we created together.',
  },
  {
    step: 4,
    title: 'Launch & Grow',
    subtitle: 'Deploy, Manage, Optimize',
    description: 'We deploy your brand across all channels, manage your social presence, and continuously optimize for growth and engagement.',
  },
]

// ── Production Services (Execution) ──
export const SERVICES = [
  {
    id: 'photography',
    title: 'Photography',
    subtitle: 'Commercial, Portrait, Events, Real Estate',
    description: 'Professional photography services for commercial brands, portraits, events, and real estate. Delivered brand-ready with expert editing.',
    image: '/images/f0xTwK2sFT7WC47RQXuNuTiQAQ.jpg',
    startingAt: 300,
  },
  {
    id: 'videography',
    title: 'Videography',
    subtitle: 'Music Videos, Commercials, Brand Content, Recaps',
    description: 'Music videos, commercials, brand films, and event recaps. Full production capability from concept through final cut.',
    image: '/images/7nJb7Wyrlidy0IJtqubJvTVE.jpg',
    startingAt: 450,
  },
  {
    id: 'music-production',
    title: 'Music Production',
    subtitle: 'Recording, Mixing, Mastering',
    description: 'Professional recording studio with engineer. Recording, mixing, and mastering services for artists at every level.',
    image: '/images/AsmzNHiCBcN8hI6tiW2rKPCAq6A.jpg',
    startingAt: 700,
  },
  {
    id: 'studio-rental',
    title: 'Studio Rentals',
    subtitle: 'Photo/Video Stage & Recording Studio',
    description: 'Book our photo/video stage or recording studio for your own productions. Professional space with optional equipment packages.',
    image: '/images/9p1CHZtoTcDXwMsJaOYKlTfmA2o.jpg',
    startingAt: 1000,
  },
  {
    id: 'graphic-design',
    title: 'Graphic Design',
    subtitle: 'Logos, Flyers, Album Covers, Business Cards',
    description: 'Creative graphic design services for logos, promotional materials, album artwork, and brand identity packages.',
    image: '/images/85jPPiW2lCJHtbpHqKhJBs8jWQM.png',
    startingAt: 200,
  },
  {
    id: 'drone',
    title: 'Drone Services',
    subtitle: 'Aerial Photography & Videography',
    description: 'Licensed drone operators for stunning aerial photography and videography. Real estate, events, and commercial projects.',
    image: '/images/CkyMu8rgNuTMYvKogFZBHtKo0.jpg',
    startingAt: 200,
  },
]

export const PRICING = {
  crew: {
    title: 'Crew Rates',
    subtitle: 'Per crew member with standard equipment',
    note: 'Excludes pre & post processing. Pricing decreases for larger package bookings.',
    tiers: [
      { duration: '1 hour', price: 300 },
      { duration: '2 hours', price: 425 },
      { duration: '3 hours', price: 550 },
      { duration: '4 hours', price: 650 },
      { duration: '5 hours', price: 750 },
      { duration: '6 hours', price: 850 },
      { duration: '7 hours', price: 950 },
      { duration: '8 hours', price: 1050 },
    ],
  },
  photoVideoStudio: {
    title: 'Photo/Video Studio',
    subtitle: 'Space only — equipment extra',
    tiers: [
      { duration: '1 hour', price: 1000 },
      { duration: '2 hours', price: 1000 },
      { duration: '3 hours', price: 1000 },
      { duration: '4 hours', price: 1000 },
      { duration: '5 hours', price: 1200 },
      { duration: '6 hours', price: 1400 },
      { duration: '7 hours', price: 1600 },
      { duration: '8 hours', price: 1800 },
    ],
  },
  recordingStudio: {
    title: 'Recording Studio',
    subtitle: 'Includes engineer',
    tiers: [
      { duration: '1 hour', price: 700 },
      { duration: '2 hours', price: 700 },
      { duration: '3 hours', price: 700 },
      { duration: '4 hours', price: 900 },
      { duration: '5 hours', price: 1100 },
      { duration: '6 hours', price: 1300 },
      { duration: '7 hours', price: 1400 },
      { duration: '8 hours', price: 1500 },
    ],
  },
  packages: [
    { name: 'Basic Photoshoot', price: 300, includes: ['1 hour shoot time', '75+ edited photos', 'Single location'] },
    { name: 'Basic Videoshoot', price: 450, includes: ['1 hour shoot time', '50-60 sec edited video', 'Single location'] },
    { name: 'Photo & Video Combo', price: 600, includes: ['1 hour shoot time', '50-60 sec edited video', '75+ edited photos'] },
    { name: 'Event Photography', price: 600, includes: ['2 hour coverage', '50+ edited images', '4-day delivery'] },
    { name: 'Event Videography', price: 750, includes: ['2 hour coverage', '45-60s cinematic recap', '7-day delivery'] },
    { name: 'Real Estate Listing', price: 300, includes: ['All rooms photographed', 'Professional editing', '+$100 for drone'] },
    { name: 'Event Photography (4hr)', price: 800, includes: ['4 hour coverage', '100+ edited images', '4-day delivery'] },
    { name: 'Event Photography (6hr)', price: 1000, includes: ['6 hour coverage', '150+ edited images', '4-day delivery'] },
    { name: 'Event Videography (4hr)', price: 950, includes: ['4 hour coverage', '45-60s cinematic recap', '7-day delivery'] },
    { name: 'Event Videography (6hr)', price: 1200, includes: ['6 hour coverage', '90-120s cinematic recap', '7-day delivery'] },
    { name: 'Home Walkthrough Video', price: 500, includes: ['50-60 sec edited walkthrough', 'Professional editing', '+$150 for drone footage'] },
    { name: 'Real Estate Promo Video', price: 600, includes: ['50-60 sec video with voiceover', 'Testimonials & location overview', 'Licensed music'] },
  ],
  addons: [
    { name: '5 GIFs', price: 200 },
    { name: '2 Mini Videos (Reels)', price: 200 },
    { name: 'Basic Graphic Design', price: 200 },
    { name: 'Drone Piloting', price: 200 },
    { name: 'Expedited 24hr Delivery', price: '20% surcharge' },
    { name: 'Expedited 12hr Delivery', price: '30% surcharge' },
    { name: 'Professional Headshots', price: '100/person' },
    { name: '3 Mini Videos (Reels)', price: 200 },
  ],
}

export const PORTFOLIO_CATEGORIES = [
  'All', 'Music Videos', 'Commercial', 'Events', 'Real Estate', 'Portraits', 'Drone', 'Studio'
] as const

export const PORTFOLIO_ITEMS = [
  { id: 1, title: 'Nightlife Performance', category: 'Events', image: '/images/1fl9WZpoiaSiRpUAhSG78MV1X9w.png', featured: true },
  { id: 2, title: 'Culinary Commercial', category: 'Commercial', image: '/images/4KDIn3nl2KxvcDxlSWCBPI7bkh4.jpg', featured: true },
  { id: 3, title: 'Culture Shifting Summit', category: 'Events', image: '/images/1VhBsCwKbQssRvbDvlQ8b6xYH2c.jpg', featured: true },
  { id: 4, title: 'Luxury Real Estate Aerial', category: 'Real Estate', image: '/images/bTEprptIQppOxwV5TrNJayOKo.jpeg', featured: false },
  { id: 5, title: 'Portrait Session', category: 'Portraits', image: '/images/epbwHuqgWTAFlmYnUqLSegOOzNI.jpg', featured: true },
  { id: 6, title: 'Product Photography', category: 'Commercial', image: '/images/fShSEN0NJYIZPJ7pMdgNHGyJQ.jpg', featured: false },
  { id: 7, title: 'Miami Skyline Aerial', category: 'Drone', image: '/images/u4lYFmZECeygWEuccy42pW4Q5EY.jpg', featured: true },
  { id: 8, title: 'Pagani Miami Showcase', category: 'Events', image: '/images/HMz2UydoTv7FxrFcNyeEqan2zh4.jpg', featured: true },
  { id: 9, title: 'Lamborghini Nightlife', category: 'Commercial', image: '/images/pT2KekaLTPULnkSOcTUU1F0deMI.jpg', featured: false },
  { id: 10, title: 'Fashion Runway', category: 'Events', image: '/images/3Kbc522gmpJ4e5PSSe7JbGIPRE.jpg', featured: false },
  { id: 11, title: 'Beach Event Styling', category: 'Events', image: '/images/9p1CHZtoTcDXwMsJaOYKlTfmA2o.jpg', featured: false },
  { id: 12, title: 'Professional Headshot', category: 'Portraits', image: '/images/QDvsu6pT9lk5rJN5BkQOZlvkdM.jpeg', featured: false },
]

export const TESTIMONIALS = [
  {
    name: 'Alexis Taylor',
    role: 'Brand Manager',
    quote: 'Sirak didn\'t just shoot our content — they rebuilt our entire brand identity and social strategy from scratch. Within 90 days we saw a 40% increase in engagement and started closing deals directly from Instagram.',
    rating: 5,
  },
  {
    name: 'David Rodriguez',
    role: 'Real Estate Agent, Compass',
    quote: 'They redesigned our website, optimized our SEO, and produced all our listing content. We went from page 3 on Google to the top 5 for our key search terms. Showings increased significantly.',
    rating: 5,
  },
  {
    name: 'Sarah Chen',
    role: 'Event Coordinator, LuxEvents Miami',
    quote: 'We came in needing event coverage but left with a full brand overhaul — new website, social media strategy, and ongoing content production. Sirak handles everything under one roof.',
    rating: 5,
  },
  {
    name: 'Marcus Johnson',
    role: 'Independent Artist',
    quote: 'Sirak built my artist brand from zero — logo, website, social strategy, then produced my music video. Having one team that understands the full picture made all the difference.',
    rating: 5,
  },
  {
    name: 'Nicole Vasquez',
    role: 'Founder, NV Aesthetics',
    quote: 'I needed someone who could think strategically about my brand, not just take pretty photos. Sirak developed our entire online presence — brand identity, website, social content — and the results speak for themselves.',
    rating: 5,
  },
]

export const STUDIO_FEATURES = {
  photoVideo: {
    title: 'Photo/Video Stage',
    features: [
      'Professional lighting grid',
      'Cyclorama wall (cyc)',
      'Bay door access for vehicle shoots',
      'Equipment available for rental',
      'Hair & makeup station',
      'Client lounge area',
    ],
  },
  recording: {
    title: 'Recording Studio',
    features: [
      'Professional recording booth',
      'Control room with pro equipment',
      'Engineer included with booking',
      'Full session support',
      'Comfortable artist lounge',
      'Isolation for pristine audio',
    ],
  },
}

export const TIME_SLOTS = [
  '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM',
  '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM',
  '8:00 PM', '9:00 PM',
]

export const CLIENT_LOGOS = [
  { name: 'E11EVEN Miami', image: '/images/KF86CbuBAW03EfV7zH43jGD3LQ.png' },
  { name: 'LIV', image: '/images/LhBLpLxOCY2DuZLgjCZIfjl7s70.png' },
  { name: 'Gekko', image: '/images/QgDDzE3MwM4wVkzVN8XaOwsjY.png' },
  { name: 'Komodo', image: '/images/L4BzK9XIGH6wlFMbAk82gzkNyU.png' },
  { name: 'Compass', image: '/images/BBWRTfIyrBrA8xXLQtkfWE9cik.png' },
  { name: 'Ulysse Nardin', image: '/images/DrcmG1W0X02tnHUvlSniG9p2xbY.png' },
  { name: 'Roger Dubuis', image: '/images/O0aQh7PVrud2PhPt8ScoW8FY.png' },
  { name: 'Seafair', image: '/images/P6KyS5UHAnvEy77vFXu7OLAoA.png' },
  { name: 'Swae Lee', image: '/images/MSW4T4HmLg7RAGPJfCIIvYppgJ8.png' },
  { name: 'Alix Earle', image: '/images/MWzry9v5Adhj2CpPRq6Yffy15s.png' },
  { name: 'Quality Control Music', image: '/images/RoirnJMSe9sTzz9K0S1VsrOXas.png' },
  { name: 'Neon16', image: '/images/T2kk0yRJH7mxdbSx3n2N8g8hI.png' },
  { name: 'Naeem Khan', image: '/images/YZw7y7lCE2wLXaQqWNyXlqx4hJE.png' },
  { name: 'Maaji Swimwear', image: '/images/l8FejTdkLLNkAaAMLjniPSVV6s0.png' },
  { name: 'Chotto Matte', image: '/images/iPBcTeGGjZB52pNcf15tuBiY.png' },
  { name: 'The Anderson', image: '/images/QSM8bHMpPPwUrAzrzumTYMGBOWY.png' },
  { name: 'Eden Gallery', image: '/images/zXme75dfYpLzVSa8kUnTcREoqk.png' },
  { name: 'Sandals Resorts', image: '/images/UsEAl7WAgNUpYJt6zn2y65vfVKs.png' },
  { name: 'Girls Inc.', image: '/images/TKpSGjMYa8xwnRpd7d15hSRfSY.png' },
  { name: 'Influential', image: '/images/uGuN4ItfRfa87xcnnjhRvrueiCA.png' },
  { name: 'Cavit Collection', image: '/images/jwunKOwro8apfTI49UewxD3YEs.png' },
  { name: 'Baddies Only', image: '/images/mFNn65ThkkVjvqeg8nDxwRQltE.png' },
  { name: 'Hurry Up Slowly', image: '/images/6V53xhw77svSq6W1IFw2oPUcJRU.png' },
  { name: 'Drunken Dragon', image: '/images/29GPHH4grZgXDrtLgY2SNKuTMw.png' },
]

export const NAV_LINKS = [
  { label: 'Services', href: '/services' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Studio', href: '/studio' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Contact', href: '/contact' },
]

export const FAQS = [
  {
    question: 'What makes Sirak Studios different from a typical production company?',
    answer: 'We\'re a creative agency first, production house second. Most studios just shoot content — we start with brand strategy, digital presence, and social media planning, then produce the content to execute that strategy. You get one team that understands the full picture from brand identity through final deliverable.',
  },
  {
    question: 'Do I need a full brand package, or can I just book production?',
    answer: 'Both. If you already have a strong brand and just need content produced, we offer standalone photography, videography, and production services. But if you\'re building or repositioning a brand, our strategic services — brand identity, website & SEO, and social media management — are where the real ROI lives.',
  },
  {
    question: 'What does the brand identity process look like?',
    answer: 'We start with a discovery session to understand your business, audience, and competitive landscape. From there we develop your visual identity (logo, colors, typography), brand voice and messaging, and deliver a comprehensive brand guidelines document. The process typically takes 3-4 weeks.',
  },
  {
    question: 'Do you build and manage websites?',
    answer: 'Yes. We design and develop custom websites optimized for performance and search visibility. We also offer ongoing SEO management, Google Business Profile optimization, and analytics tracking to keep your online presence growing.',
  },
  {
    question: 'How does social media management work?',
    answer: 'We handle the full pipeline — platform strategy, content creation (using our in-house production), content calendar, community management, and performance analytics. Because we produce the content ourselves, everything stays on-brand and high-quality without juggling multiple vendors.',
  },
  {
    question: 'How far in advance should I book?',
    answer: 'We recommend booking at least 2 weeks in advance for standard sessions and 4-6 weeks for events or large-scale productions. Last-minute bookings are accommodated when availability allows.',
  },
  {
    question: 'What is your cancellation policy?',
    answer: 'Cancellations made 48 hours or more before the scheduled session receive a full refund. Cancellations within 48 hours are subject to a 50% fee. No-shows are charged the full session rate.',
  },
  {
    question: 'Do you travel outside Miami?',
    answer: 'Yes, we service all of South Florida and regularly travel throughout the state. Travel fees apply for locations outside Miami-Dade County. For out-of-state projects, contact us for a custom quote.',
  },
  {
    question: 'How long until I receive my deliverables?',
    answer: 'Standard turnaround is 4-7 business days for photography and 7-10 business days for video. Expedited delivery is available at 24 hours (+20%) or 12 hours (+30%).',
  },
  {
    question: 'Can I book multiple services together?',
    answer: 'Absolutely. We offer combo packages and custom quotes for multi-service bookings. Bundling services often results in better pricing than booking individually.',
  },
  {
    question: 'Do you provide raw or unedited files?',
    answer: 'We deliver professionally edited files as our standard. Raw files can be provided upon request for an additional fee, as our editing is a core part of the Sirak Studios quality.',
  },
  {
    question: 'What equipment do you use?',
    answer: 'We use professional-grade cinema cameras, lighting rigs, audio equipment, and FAA-licensed drones. Specific gear is selected based on project requirements. Our studio features a full lighting grid, cyclorama wall, and professional recording booth.',
  },
  {
    question: 'Is there parking at the studio?',
    answer: 'Yes, free parking is available on-site. Our studio also features bay door access for vehicle shoots and large equipment load-in.',
  },
  {
    question: 'Do you offer payment plans?',
    answer: 'For larger projects and production packages, we offer flexible payment plans. A deposit is required to secure your booking, with the remaining balance due before or on the day of the session.',
  },
  {
    question: 'What happens if it rains on the day of an outdoor shoot?',
    answer: 'We monitor weather closely and will reach out to reschedule if conditions are unfavorable. Alternatively, we can move the shoot to our studio at no extra charge, subject to availability.',
  },
]
