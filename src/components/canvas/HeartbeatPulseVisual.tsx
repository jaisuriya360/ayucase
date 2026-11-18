import React, { useRef, useEffect, useState } from 'react'
import { Activity, Heart, HeartPulse, Zap } from 'lucide-react'
import { useAccessibility } from '../../contexts/AccessibilityContext'

interface HeartbeatPulseVisualProps {
  className?: string
}

export const HeartbeatPulseVisual: React.FC<HeartbeatPulseVisualProps> = ({ className }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [bpm, setBpm] = useState(72)
  const [isBeating, setIsBeating] = useState(false)

  let reduceMotion = false
  try {
    const a11y = useAccessibility()
    reduceMotion = a11y.settings.reduceMotion
  } catch {
    // Fallback if rendered outside provider
  }

  // Slight natural micro-variability in heart rate
  useEffect(() => {
    const interval = setInterval(() => {
      setBpm((prev) => {
        const delta = Math.floor(Math.random() * 3) - 1 // -1, 0, or +1
        const next = prev + delta
        return Math.max(69, Math.min(75, next))
      })
    }, 3200)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let width = 0
    let height = 0
    let dpr = window.devicePixelRatio || 1

    const resize = () => {
      width = container.clientWidth
      height = container.clientHeight
      dpr = window.devicePixelRatio || 1

      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.scale(dpr, dpr)
    }

    resize()
    window.addEventListener('resize', resize)

    // History buffer of ECG points across the screen width
    // Each entry stores y position at each x pixel
    const points: (number | null)[] = new Array(Math.max(600, Math.ceil(width))).fill(null)
    let currentX = 0
    const sweepSpeed = 2.2 // pixels per frame
    const eraseWidth = 36 // pixels ahead of sweep head

    // Physiological ECG cycle math: P-Q-R-S-T complex
    // Cycle length in pixels: based on ~72 BPM at 60fps
    // 72 BPM = 1.2 beats/sec = ~50 frames per beat = ~110 pixels per beat
    const beatLength = 140

    const getEcgOffset = (phase: number, amplitude: number): { y: number; isRPeak: boolean } => {
      // phase: 0.0 to 1.0 within a single cardiac cycle
      let y = 0
      let isRPeak = false

      if (phase >= 0.08 && phase < 0.20) {
        // P-wave (Atrial depolarization: gentle rounded dome)
        const pNorm = (phase - 0.08) / 0.12
        y = Math.sin(pNorm * Math.PI) * (amplitude * 0.16)
      } else if (phase >= 0.28 && phase < 0.32) {
        // Q-wave (Septal depolarization: brief dip downward)
        const qNorm = (phase - 0.28) / 0.04
        y = -Math.sin(qNorm * Math.PI) * (amplitude * 0.14)
      } else if (phase >= 0.32 && phase < 0.38) {
        // R-wave (Ventricular depolarization: dramatic sharp spike)
        const rNorm = (phase - 0.32) / 0.06
        y = Math.sin(rNorm * Math.PI) * (amplitude * 1.0)
        if (rNorm > 0.4 && rNorm < 0.6) {
          isRPeak = true
        }
      } else if (phase >= 0.38 && phase < 0.44) {
        // S-wave (Ventricular depolarization finish: plunge below baseline)
        const sNorm = (phase - 0.38) / 0.06
        y = -Math.sin(sNorm * Math.PI) * (amplitude * 0.32)
      } else if (phase >= 0.52 && phase < 0.72) {
        // T-wave (Ventricular repolarization: medium rounded wave)
        const tNorm = (phase - 0.52) / 0.20
        y = Math.sin(tNorm * Math.PI) * (amplitude * 0.28)
      } else {
        // Isoelectric baseline with tiny realistic baseline noise
        y = (Math.sin(phase * 40) + Math.cos(phase * 17)) * (amplitude * 0.015)
      }

      return { y, isRPeak }
    }

    // Grid drawing function
    const drawGrid = () => {
      const gridSize = 24
      ctx.lineWidth = 1
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.07)'

      // Minor grid
      ctx.beginPath()
      for (let x = 0; x <= width; x += gridSize) {
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
      }
      for (let y = 0; y <= height; y += gridSize) {
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
      }
      ctx.stroke()

      // Major grid (every 4 cells)
      ctx.lineWidth = 1.2
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.14)'
      ctx.beginPath()
      for (let x = 0; x <= width; x += gridSize * 4) {
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
      }
      for (let y = 0; y <= height; y += gridSize * 4) {
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
      }
      ctx.stroke()

      // Center baseline guide
      const centerY = height * 0.54
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.18)'
      ctx.setLineDash([4, 4])
      ctx.beginPath()
      ctx.moveTo(0, centerY)
      ctx.lineTo(width, centerY)
      ctx.stroke()
      ctx.setLineDash([])
    }

    let lastBeatTime = 0

    const render = (time: number) => {
      ctx.save()
      ctx.clearRect(0, 0, width, height)

      // Background vignette
      const bgGrad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        20,
        width / 2,
        height / 2,
        width * 0.7
      )
      bgGrad.addColorStop(0, '#04171e')
      bgGrad.addColorStop(1, '#020b12')
      ctx.fillStyle = bgGrad
      ctx.fillRect(0, 0, width, height)

      // Medical ECG grid
      drawGrid()

      const centerY = height * 0.54
      const amplitude = height * 0.38

      if (reduceMotion) {
        // Calm static display for users with reduce-motion
        ctx.strokeStyle = '#10b981'
        ctx.lineWidth = 2.5
        ctx.shadowBlur = 8
        ctx.shadowColor = '#10b981'
        ctx.beginPath()

        for (let x = 0; x < width; x++) {
          const phase = (x % beatLength) / beatLength
          const { y } = getEcgOffset(phase, amplitude)
          const pxY = centerY - y
          if (x === 0) ctx.moveTo(x, pxY)
          else ctx.lineTo(x, pxY)
        }
        ctx.stroke()
        ctx.restore()
        return
      }

      // Calculate step for sweep
      const steps = Math.ceil(sweepSpeed)
      for (let s = 0; s < steps; s++) {
        currentX = (currentX + 1) % width
        const phase = (currentX % beatLength) / beatLength
        const { y, isRPeak } = getEcgOffset(phase, amplitude)
        points[Math.floor(currentX)] = centerY - y

        // Clear ahead of the sweep head to create moving hospital monitor scan effect
        for (let e = 1; e <= eraseWidth; e++) {
          const eraseIdx = (Math.floor(currentX) + e) % width
          points[eraseIdx] = null
        }

        if (isRPeak && time - lastBeatTime > 400) {
          lastBeatTime = time
          setIsBeating(true)
          setTimeout(() => setIsBeating(false), 180)
        }
      }

      // Draw continuous ECG waveform with phosphor persistence fade
      ctx.lineWidth = 2.4
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      // Outer neon bloom pass
      ctx.shadowBlur = 12
      ctx.shadowColor = 'rgba(16, 185, 129, 0.85)'
      ctx.strokeStyle = '#34d399'

      let drawing = false
      ctx.beginPath()
      for (let x = 0; x < width; x++) {
        const pt = points[x]
        if (pt === null) {
          if (drawing) {
            ctx.stroke()
            ctx.beginPath()
            drawing = false
          }
        } else {
          if (!drawing) {
            ctx.moveTo(x, pt)
            drawing = true
          } else {
            ctx.lineTo(x, pt)
          }
        }
      }
      if (drawing) {
        ctx.stroke()
      }

      // Secondary brighter core line for crisp laser look
      ctx.shadowBlur = 4
      ctx.shadowColor = '#a7f3d0'
      ctx.strokeStyle = '#ecfdf5'
      ctx.lineWidth = 1.2
      drawing = false
      ctx.beginPath()
      for (let x = 0; x < width; x++) {
        const pt = points[x]
        if (pt === null) {
          if (drawing) {
            ctx.stroke()
            ctx.beginPath()
            drawing = false
          }
        } else {
          if (!drawing) {
            ctx.moveTo(x, pt)
            drawing = true
          } else {
            ctx.lineTo(x, pt)
          }
        }
      }
      if (drawing) {
        ctx.stroke()
      }

      // Leading pulse cursor dot at currentX
      const curHeadY = points[Math.floor(currentX)]
      if (curHeadY !== null && curHeadY !== undefined) {
        const headX = currentX

        // Expanding soft radar ring
        ctx.save()
        ctx.shadowBlur = 18
        ctx.shadowColor = '#10b981'
        ctx.fillStyle = '#10b981'
        ctx.beginPath()
        ctx.arc(headX, curHeadY, 5, 0, Math.PI * 2)
        ctx.fill()

        // Ultra-bright center diode
        ctx.fillStyle = '#ffffff'
        ctx.beginPath()
        ctx.arc(headX, curHeadY, 2.2, 0, Math.PI * 2)
        ctx.fill()

        // Scanhead vertical beam line (faint radar line)
        const beamGrad = ctx.createLinearGradient(0, 0, 0, height)
        beamGrad.addColorStop(0, 'rgba(16, 185, 129, 0)')
        beamGrad.addColorStop(0.5, 'rgba(16, 185, 129, 0.25)')
        beamGrad.addColorStop(1, 'rgba(16, 185, 129, 0)')
        ctx.strokeStyle = beamGrad
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.moveTo(headX, 0)
        ctx.lineTo(headX, height)
        ctx.stroke()
        ctx.restore()
      }

      ctx.restore()
      animationFrameId = requestAnimationFrame(render)
    }

    animationFrameId = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', resize)
    }
  }, [reduceMotion])

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full min-h-[220px] select-none overflow-hidden ${className || ''}`}
    >
      {/* Real-time Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* Clinical Telemetry HUD Header */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
        {/* Left: Lead and signal specs */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900/80 backdrop-blur-md border border-emerald-500/30 text-emerald-400 text-[11px] font-mono font-medium shadow-sm">
            <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>LEAD II • ECG</span>
          </div>
          <span className="hidden sm:inline-block text-[10px] text-emerald-500/70 font-mono tracking-wider">
            25mm/s • 10mm/mV
          </span>
        </div>

        {/* Right: Heart Rate BPM Badge with Beating Pulse Animation */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-900/80 backdrop-blur-md border border-slate-700/80 text-white text-xs shadow-sm">
            <Heart
              className={`w-3.5 h-3.5 text-rose-500 fill-rose-500 transition-transform duration-150 ${
                isBeating ? 'scale-135 text-rose-400' : 'scale-100 opacity-80'
              }`}
            />
            <div className="flex items-baseline gap-1 font-mono">
              <span className="text-base font-bold text-emerald-400 leading-none">{bpm}</span>
              <span className="text-[10px] text-slate-400 uppercase">BPM</span>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-md bg-slate-900/80 backdrop-blur-md border border-slate-700/80 text-[10px] font-mono text-cyan-400 shadow-sm">
            <Zap className="w-3 h-3 text-cyan-400" />
            <span>SpO₂ 99%</span>
          </div>
        </div>
      </div>

      {/* Heartbeat subtle ambient glow flash synchronized with R-peak */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-200 bg-emerald-500/5 ${
          isBeating ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  )
}
