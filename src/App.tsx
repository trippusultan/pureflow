import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Play, ChevronDown, Menu, ArrowRight } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About Us', href: '#about' },
  { label: 'Device', href: '#device' },
  { label: 'Real Stories', href: '#stories' },
  { label: 'Science', href: '#science' },
  { label: 'Plans', href: '#plans' },
  { label: 'Reach Us', href: '#reach' },
]

const TEAM = [
  { name: 'Sarah Jenkins', role: 'CEO & Co-Founder', bio: 'Former aerospace engineer turned environmental advocate.' },
  { name: 'David Alpert', role: 'Lead Engineer', bio: 'Expert in fluid dynamics and ultra-quiet motor designs.' },
  { name: 'Aisha Patel', role: 'COO', bio: 'Operations specialist ensuring our supply chain is sustainable.' },
  { name: 'Marcus Johnson', role: 'Head of Marketing', bio: 'Storyteller passionate about community health initiatives.' },
  { name: 'Li Wei', role: 'Software Lead', bio: 'Architect behind the PureFlow smart home integration app.' },
  { name: 'Jessica Bloom', role: 'Customer Success', bio: 'Dedicated to ensuring every user breathes perfectly clean air.' },
]

const FAQS = [
  { q: 'How long does the battery last?', a: '10 hours on a single charge. With our quick-charge accessory, you get 2 hours of clean air from just 15 minutes of charging.' },
  { q: 'Is the filter replaceable?', a: 'Yes — the HEPA filter lasts up to 12 months and replacement takes under 30 seconds. We ship them automatically via subscription.' },
  { q: 'Do you ship internationally?', a: 'We currently ship to 42 countries. Check our shipping page for rates and estimated delivery times in your region.' },
  { q: 'What is your warranty policy?', a: 'Every PureFlow One comes with a 2-year limited warranty covering manufacturing defects. Premium plans extend to 5 years.' },
]

export default function App() {
  const heroRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const navRef = useRef<HTMLElement>(null)
  const heroTxtRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // --- Nav reveal ---
      gsap.fromTo(navRef.current,
        { y: -80, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.4, ease: 'power3.out', delay: 0.6 }
      )

      // --- Hero text entrance ---
      gsap.fromTo(heroTxtRef.current,
        { y: 100, opacity: 0, filter: 'blur(12px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.6, ease: 'power3.out', delay: 0.3 }
      )
      gsap.utils.toArray('.hero-line').forEach((el, i) => {
        gsap.fromTo(el as HTMLElement,
          { y: 60, opacity: 0, filter: 'blur(8px)' },
          { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.4, ease: 'power3.out', delay: 0.4 + i * 0.15 }
        )
      })

      // --- Parallax video ---
      if (videoRef.current) {
        gsap.to(videoRef.current, {
          yPercent: 20,
          ease: 'none',
          scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true }
        })
      }

      // --- Fade-zone: hide hero content below the fold ---
      gsap.to(heroRef.current, {
        yPercent: -8,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: '60% top',
          end: 'bottom top',
          scrub: true,
        }
      })

      // --- Section reveals ---
      gsap.utils.toArray('.section-reveal').forEach((el) => {
        gsap.fromTo(el as HTMLElement,
          { y: 80, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out',
            scrollTrigger: { trigger: el as Element, start: 'top 85%', toggleActions: 'play none none reverse' }
          }
        )
      })

      // --- Team grid stagger ---
      gsap.utils.toArray('.team-card').forEach((el, i) => {
        gsap.fromTo(el as HTMLElement,
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: 'power2.out', delay: i * 0.08,
            scrollTrigger: { trigger: '.team-grid', start: 'top 80%', toggleActions: 'play none none reverse' }
          }
        )
      })

      // --- marquee ---
      gsap.to('.marquee-track', {
        xPercent: -50,
        ease: 'none',
        scrollTrigger: { scrub: 1 },
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <div className="min-h-screen bg-brand-light">
      {/* ============================= NAV ============================= */}
      <nav
        ref={navRef}
        className="fixed top-6 left-0 right-0 z-50 flex items-center justify-center px-4"
      >
        <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/80 backdrop-blur-xl border border-black/5 shadow-[0_4px_30px_rgba(0,0,0,0.05)]">
          <span className="font-serif text-xl font-bold tracking-tight pr-4 border-r border-black/10">
            PureFlow
          </span>
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-black/50 hover:text-black transition-colors duration-300 px-1"
            >
              {link.label}
            </a>
          ))}
          <div className="flex items-center gap-2 pl-3 ml-1 border-l border-black/10">
            <button className="px-4 py-1.5 rounded-full bg-brand-accent text-white text-sm font-medium hover:bg-black transition-colors">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-live" />
                Reserve
              </span>
            </button>
            <button className="p-1.5 rounded-full hover:bg-black/5">
              <Menu size={16} className="text-black/40" />
            </button>
          </div>
        </div>
      </nav>
      {/* ============================ HERO ============================== */}
      <section
        ref={heroRef}
        id="home"
        className="relative h-[100vh] overflow-hidden bg-brand-dark"
      >
        {/* Video BG */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-[120%] object-cover"
          autoPlay muted loop playsInline
          src={
            'https://assets.mixkit.co/videos/preview/mixkit-flying-over-the-clouds-1701-large.mp4'
          }
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-brand-dark/40" />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/20 via-transparent to-brand-dark/80" />

        {/* Hero text */}
        <div
          ref={heroTxtRef}
          className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-6"
        >
          <p className="hero-line text-xs sm:text-sm font-semibold tracking-[0.3em] uppercase text-white/50 mb-6">
            PUR··EF LOW ONE
          </p>
          <h1 className="hero-line font-serif text-5xl sm:text-7xl md:text-8xl leading-tight mb-8">
            Clean Air, Clear Mind.<br />
            <span className="italic">Anywhere.</span>
          </h1>
          <div className="hero-line flex flex-wrap items-center justify-center gap-4">
            <button className="px-7 py-3.5 rounded-full bg-white text-brand-accent font-medium hover:shadow-lg hover:scale-[1.03] transition-[transform,box-shadow] duration-300">
              Discover
            </button>
            <button className="group flex items-center gap-2 text-white/65 hover:text-white text-sm tracking-wide transition-colors">
              <span className="w-8 h-8 rounded-full border border-white/25 flex items-center justify-center group-hover:border-white/60 transition-colors">
                <Play size={13} className="ml-0.5" fill="white" />
              </span>
              View Specs
            </button>
          </div>
        </div>

        {/* scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/35">
          <ChevronDown size={20} className="animate-bounce" />
        </div>
      </section>

      {/* ============================ ABOUT ======================== */}
      <section id="about" className="relative bg-white py-32 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="section-reveal mb-24 text-center">
            <p className="text-xs tracking-[0.3em] uppercase text-black/35 mb-4">Our Journey</p>
            <h2 className="font-serif text-4xl sm:text-6xl italic text-black/80 mb-6">
              Where dreams rise through the silence.
            </h2>
            <p className="max-w-2xl mx-auto text-black/45 leading-relaxed">
              PureFlow was born from a simple belief: the air you breathe shapes everything you create.
              Our team of aerospace engineers, designers, and wellness advocates came together to build
              a device that performs like jet propulsion — silent, relentless, invisible.
            </p>
          </div>

          {/* Team grid */}
          <div className="team-grid grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-12 mb-32">
            {TEAM.map((m) => (
              <div key={m.name} className="team-card text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-black/5 flex items-center justify-center">
                  <span className="text-2xl font-serif italic text-black/20">{m.name[0]}</span>
                </div>
                <p className="text-sm font-semibold tracking-tight">{m.name}</p>
                <p className="text-xs text-black/35 mt-0.5">{m.role}</p>
                <p className="text-xs text-black/25 mt-2 leading-relaxed">{m.bio}</p>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <div className="section-reveal">
            <h3 className="font-serif text-3xl italic text-center mb-10">Frequently Asked Questions</h3>
            <div className="grid md:grid-cols-2 gap-0 divide-x divide-black/8">
              {FAQS.map((f) => (
                <details
                  key={f.q}
                  className="group border-b border-black/8 py-6 px-4 open:bg-black/[0.015] transition-colors"
                >
                  <summary className="list-none cursor-pointer text-sm font-medium flex items-center justify-between">
                    {f.q}
                    <ChevronDown
                      size={16}
                      className="text-black/30 group-open:rotate-180 transition-transform"
                    />
                  </summary>
                  <p className="mt-3 text-sm text-black/40 leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================ DEVICE ======================== */}
      <section id="device" className="relative bg-white py-32 px-6">
        <div className="max-w-4xl mx-auto text-center section-reveal">
          <p className="text-xs tracking-[0.3em] uppercase text-black/35 mb-4">The Product</p>
          <h2 className="font-serif text-5xl sm:text-7xl italic mb-8">PureFlow One</h2>
          <p className="text-black/45 max-w-xl mx-auto leading-relaxed mb-12">
            A silent engine of pure air. HEPA H13 filtration, aerospace-grade composite shell,
            0-dB whisper mode. Available now for pre-order — first units ship Q4 2026.
          </p>
          {/* Product placeholder — a glowing ring reminiscent of a jet turbine */}
          <div className="relative inline-flex items-center justify-center">
            <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-full border border-black/8 flex items-center justify-center">
              <div className="w-40 h-40 sm:w-52 sm:h-52 rounded-full bg-gradient-to-br from-amber-400 via-orange-400 to-amber-600 opacity-80 blur-sm" />
              <div className="absolute w-16 h-16 rounded-full bg-gradient-to-br from-white/90 to-white/70" />
            </div>
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-black/20 tracking-widest">
              12-month HEPA filter &middot; 62 dB to 0 dB &middot; 8.4 hrs
            </div>
          </div>
        </div>
      </section>

      {/* ============================ REAL STORIES ================= */}
      <section id="stories" className="relative bg-brand-mid py-32 px-6 text-white">
        <div className="max-w-4xl mx-auto section-reveal">
          <p className="text-xs tracking-[0.3em] uppercase text-white/35 mb-4">Testimonials</p>
          <h2 className="font-serif text-4xl sm:text-6xl italic mb-16">Real Stories</h2>
          <div className="space-y-10">
            {[
              "The difference in my studio was immediate. The filter's quiet hum vanished into the background, and the air felt undeniably — lighter.",
              "I installed PureFlow One in my son's nursery after reading the science. Best parent peace-of-mind purchase I've made.",
              "Pre-ordered within minutes of seeing the turbine reveal. The engineering shows in every detail.",
            ].map((t, i) => (
              <div key={i} className="flex gap-6 items-start">
                <span className="font-serif text-3xl italic text-white/20">"{i + 1}"</span>
                <p className="text-white/55 leading-relaxed">{t}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ SCIENCE =================== */}
      <section id="science" className="relative bg-brand-dark py-40 px-6 text-white overflow-hidden">
        {/* Dark cinematic backdrop */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-r from-black via-brand-dark to-brand-mid" />
          <div
            className="absolute inset-0 mix-blend-screen opacity-20"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cpath d='M0 0h60v60H0z' fill='none'/%3E%3Cpath d='M0 60L60 0' stroke='white' stroke-width='.4' stroke-opacity='.3'/%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto section-reveal">
          <p className="text-xs tracking-[0.3em] uppercase text-white/35 mb-4">The Science</p>
          <h2 className="font-serif text-4xl sm:text-6xl italic mb-10">
            Purification that<br />defies physics.
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { n: '0.3µm', lbl: 'Particle Filtration — H13 HEPA captures particles down to 0.3 microns.' },
              { n: '460m³/h', lbl: 'CADR — Clean air delivery rate outperforms units twice the size.' },
              { n: '0dB', lbl: 'Whisper Mode — Near-silent PRD drive, acoustically tuned.' },
            ].map((s) => (
              <div
                key={s.n}
                className="border border-white/10 rounded-2xl bg-white/[0.035] px-6 py-8 backdrop-blur-xs"
              >
                <p className="font-serif text-4xl italic mb-3 text-white/80">{s.n}</p>
                <p className="text-sm text-white/35 leading-relaxed">{s.lbl}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ PLANS ===================== */}
      <section id="plans" className="relative bg-white py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center section-reveal mb-16">
            <p className="text-xs tracking-[0.3em] uppercase text-black/35 mb-4">Pricing</p>
            <h2 className="font-serif text-4xl sm:text-6xl italic">Simple plans.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {['DayPass', 'Explorer', 'Studio'].map((name, i) => (
              <div
                key={name}
                className={`section-reveal rounded-3xl border ${i === 1 ? 'border-black bg-black text-white' : 'border-black/10 bg-white'} p-8 flex flex-col`}
              >
                <p className="text-xs tracking-widest uppercase opacity-50 mb-6">{name}</p>
                <p className={`text-4xl font-bold tracking-tight ${i === 1 ? 'text-white' : 'text-black'}`}>
                  ${[9, 29, 79][i]}
                </p>
                <p className={`text-xs mt-1 ${i === 1 ? 'text-white/40' : 'text-black/30'}`}>per month</p>
                <ul className="mt-8 space-y-3 flex-1">
                  {[
                    i >= 1 ? 'Clean-air analytics' : null,
                    i >= 2 ? 'Priority support' : null,
                    i >= 2 ? 'Team seats (5)' : null,
                    i >= 0 ? 'All core features' : null,
                    i >= 1 ? 'Advanced filters' : null,
                  ].filter(Boolean).map((feat) => (
                    <li key={String(feat)} className="flex items-center gap-2 text-sm">
                      <span className="w-1 h-1 rounded-full bg-current opacity-40" />
                      {feat}
                    </li>
                  ))}
                </ul>
                <button
                  className={`mt-8 py-2.5 rounded-full text-sm font-medium transition-all ${
                    i === 1 ? 'bg-white text-black hover:bg-white/90' : 'bg-black text-white hover:bg-black/90'
                  }`}
                >
                  Choose {name}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ REACH US ================= */}
      <section id="reach" className="relative bg-brand-mid py-40 px-6 text-white">
        <div className="max-w-2xl mx-auto text-center section-reveal">
          <h2 className="font-serif text-4xl sm:text-6xl italic mb-6">Reach Us</h2>
          <p className="text-white/45 mb-10 leading-relaxed">
            Questions about PureFlow One or enterprise licensing?
            Our team responds within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <input
              type="email"
              placeholder="your@email.com"
              className="px-6 py-3.5 rounded-full bg-white/10 border border-white/10 text-white placeholder:text-white/25 text-sm outline-none focus:border-white/30 transition-colors w-full sm:w-72"
            />
            <button className="px-7 py-3.5 rounded-full bg-white text-black font-medium hover:shadow-2xl hover:scale-[1.03] transition-[transform,box-shadow] duration-300">
              Get in Touch
              <ArrowRight size={15} className="inline ml-1.5" />
            </button>
          </div>
          <p className="text-xs text-white/20 mt-8">
            PureFlow &copy; 2026 &middot; San Francisco, CA &middot; hello@pureflow.one
          </p>
        </div>
      </section>

      {/* ============================ MARQUEE ================== */}
      <div className="bg-brand-dark py-6 overflow-hidden">
        <div className="marquee-track flex gap-12 whitespace-nowrap text-white/10 text-xl font-serif italic">
          {['Clean Air', 'Clear Mind', 'Anywhere', 'PureFlow One', 'Reserve Yours', 'Clean Air', 'Clear Mind', 'Anywhere', 'PureFlow One', 'Reserve Yours'].map((t) => (
            <span key={t} className="inline-block">{t} &nbsp;/&nbsp;&nbsp;</span>
          ))}
        </div>
      </div>
    </div>
  )
}
