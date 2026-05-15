'use client'
import { useEffect, useRef, useMemo } from 'react'

const CLOUD_COUNT = 22
const PARTICLE_COUNT = 60

function rand(a: number, b: number): number {
  return Math.random() * (b - a) + a
}

export default function HeroCanvas() {
  const ref = useRef<HTMLCanvasElement>(null)

  const clouds = useMemo(() =>
    Array.from({ length: CLOUD_COUNT }, () => ({
      x: rand(-0.2, 1.2),
      y: rand(0, 1),
      r: rand(0.2, 0.65),
      speed: rand(0.04, 0.22),
      alpha: rand(0.04, 0.22),
      layer: Math.random() < 0.4 ? 2 : 1,
    })),
    []
  )

  const particles = useMemo(() =>
    Array.from({ length: PARTICLE_COUNT }, () => ({
      x: rand(0, 1),
      y: rand(0, 1),
      r: rand(0.25, 1.2),
      speedX: rand(-0.12, -0.04),
      speedY: rand(-0.04, 0.04),
      alpha: rand(0.1, 0.5),
    })),
    []
  )

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    let raf: number
    let t = 0

    const draw = () => {
      const dpr = window.devicePixelRatio || 1
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr
        canvas.height = h * dpr
        canvas.getContext('2d')!.scale(dpr, dpr)
      }

      const ctx = canvas.getContext('2d')!
      ctx.clearRect(0, 0, w, h)

      // Sky gradient — deep blue → warm gold at horizon, like a sunset at 30k ft
      const sky = ctx.createLinearGradient(0, 0, 0, h)
      sky.addColorStop(0,   '#0b1b3e')
      sky.addColorStop(0.35, '#1e4d7a')
      sky.addColorStop(0.65, '#2d6a9f')
      sky.addColorStop(0.82, '#3a8fc4')
      sky.addColorStop(1,   '#e8c468')
      ctx.fillStyle = sky
      ctx.fillRect(0, 0, w, h)

      // Sun glow / lens flare
      const sunx = w * 0.82, suny = h * 0.72
      const sunRad = w * 0.55
      const sunGrad = ctx.createRadialGradient(sunx, suny, 0, sunx, suny, sunRad)
      sunGrad.addColorStop(0,   'rgba(255, 210, 90, 0.5)')
      sunGrad.addColorStop(0.35, 'rgba(255, 185, 55, 0.18)')
      sunGrad.addColorStop(1,   'rgba(255, 160, 40, 0)')
      ctx.fillStyle = sunGrad
      ctx.fillRect(0, 0, w, h)

      // Sun disc
      ctx.beginPath()
      ctx.arc(sunx, suny, Math.max(w, h) * 0.018, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(255, 235, 150, 0.92)'
      ctx.fill()

      // Sunset halo ring
      ctx.beginPath()
      ctx.arc(sunx, suny, Math.max(w, h) * 0.055, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(255, 210, 100, 0.15)'
      ctx.fill()

      // Subtle noise grain
      ctx.globalAlpha = 0.02
      for (let i = 0; i < 120; i++) {
        ctx.fillStyle = Math.random() > 0.5 ? '#fff' : '#fff'
        ctx.fillRect(Math.random() * w, Math.random() * h, 1.2, 1.2)
      }
      ctx.globalAlpha = 1

      // Cirrus clouds & wispy parallax layers
      clouds.forEach(c => {
        const x = ((c.x + t * c.speed) % 1.5 - 0.25) * w
        const y = c.y * h * 0.6
        const r = c.r * Math.min(w, h)
        const fade = c.layer === 1 ? 1 : 0.45 + Math.sin(t * 0.4) * 0.15
        ctx.globalAlpha = c.alpha * fade
        const cg = ctx.createRadialGradient(x, y, 0, x, y, r)
        cg.addColorStop(0,   'rgba(255,255,255,0.85)')
        cg.addColorStop(0.55, 'rgba(220,228,255,0.35)')
        cg.addColorStop(1,   'rgba(195,210,255,0)')
        ctx.fillStyle = cg
        ctx.beginPath()
        ctx.arc(x, y, r, 0, Math.PI * 2)
        ctx.fill()
        // secondary bump
        ctx.beginPath()
        ctx.arc(x + r * 0.45, y - r * 0.18, r * 0.6, 0, Math.PI * 2)
        ctx.fill()
      })
      ctx.globalAlpha = 1

      // Jet trail / heading-streak particles (fast, left-to-right = forward motion)
      particles.forEach(p => {
        const x = ((p.x - t * p.speedX * 55) % 1.15 - 0.08) * w
        const driftY = Math.sin(t * 0.8 + p.x * 12) * p.speedY * h
        const y = p.y * h + driftY
        const edge = Math.abs(p.x - 0.5) * 1.8
        const alpha = p.alpha * Math.max(0, 1 - edge)
        if (alpha <= 0.01) return
        const pg = ctx.createRadialGradient(x, y, 0, x, y, Math.max(w, h) * p.r * 0.012)
        pg.addColorStop(0,   `rgba(255, 215, 155, ${alpha})`)
        pg.addColorStop(0.5, `rgba(255, 190, 110, ${alpha * 0.4})`)
        pg.addColorStop(1,   'rgba(255, 170, 80, 0)')
        ctx.fillStyle = pg
        ctx.beginPath()
        ctx.arc(x, y, Math.max(w, h) * p.r * 0.008, 0, Math.PI * 2)
        ctx.fill()
      })

      t += 0.016
      raf = requestAnimationFrame(draw)
    }

    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [clouds, particles])

  return (
    <canvas
      ref={ref}
      className="absolute inset-0 w-full h-full block"
      aria-hidden="true"
      style={{ width: '100%', height: '100%', display: 'block' }}
    />
  )
}
