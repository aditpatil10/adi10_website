import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

// Binary digital rain — just 1s and 0s.
const CHARS = '01'.split('')
const randChar = () => CHARS[(Math.random() * CHARS.length) | 0]

/**
 * Full-screen intro loader: Matrix-style digital rain. Columns of glyphs fall
 * at varied speeds with a bright white-green leading character and a fading
 * green trail; dissolves (via App's AnimatePresence) once the app is ready.
 */
function Loader() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let w = 0
    let h = 0
    let fontSize = 16
    let columns = 0
    let drops: number[] = []
    let speeds: number[] = []
    let raf = 0

    const resize = () => {
      w = window.innerWidth
      h = window.innerHeight
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      fontSize = Math.max(14, Math.round(Math.min(w, h) / 42))
      columns = Math.ceil(w / fontSize)
      // Start each column at a random height above the screen so the rain
      // cascades in rather than starting in a flat line.
      drops = Array.from({ length: columns }, () => -Math.random() * 40)
      speeds = Array.from({ length: columns }, () => 0.35 + Math.random() * 0.5)
      ctx.fillStyle = '#050806'
      ctx.fillRect(0, 0, w, h)
    }

    const draw = () => {
      // Translucent wash → fading green trails behind each leading glyph.
      ctx.fillStyle = 'rgba(5,8,6,0.09)'
      ctx.fillRect(0, 0, w, h)

      ctx.font = `${fontSize}px ui-monospace, "Courier New", monospace`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      for (let i = 0; i < columns; i++) {
        const x = i * fontSize + fontSize / 2
        const row = Math.floor(drops[i])

        if (row >= 0) {
          // Repaint the cell just above the head in body-green so the trail is
          // green (it then fades via the wash), and paint a bright head.
          // (No canvas shadowBlur — it's extremely expensive on Safari.)
          ctx.fillStyle = 'rgba(56,222,136,0.85)'
          ctx.fillText(randChar(), x, (row - 1) * fontSize + fontSize / 2)
          ctx.fillStyle = 'rgba(233,255,240,0.98)'
          ctx.fillText(randChar(), x, row * fontSize + fontSize / 2)
        }

        drops[i] += speeds[i]
        if (drops[i] * fontSize > h + Math.random() * 240) {
          drops[i] = -Math.random() * 20
          speeds[i] = 0.35 + Math.random() * 0.5
        }
      }
    }

    const loop = () => {
      draw()
      raf = requestAnimationFrame(loop)
    }

    resize()
    window.addEventListener('resize', resize)

    if (reduced) {
      // A few static columns rather than motion.
      ctx.fillStyle = 'rgba(56,222,136,0.85)'
      ctx.font = `${fontSize}px ui-monospace, monospace`
      ctx.textAlign = 'center'
      for (let i = 0; i < columns; i += 2) {
        for (let r = 0; r < 6; r++) {
          ctx.fillText(
            randChar(),
            i * fontSize + fontSize / 2,
            (Math.random() * h) | 0,
          )
        }
      }
    } else {
      raf = requestAnimationFrame(loop)
    }

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <motion.div
      key="loader"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="pointer-events-none fixed inset-0 z-[100] bg-[#050806]"
    >
      <canvas ref={canvasRef} className="absolute inset-0" />
      <motion.p
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-x-0 bottom-[15%] text-center font-mono text-sm font-medium tracking-[0.5em] uppercase"
        style={{
          color: '#dafce4',
          textShadow: '0 0 14px rgba(56,222,136,0.85)',
        }}
      >
        Adit Patil
      </motion.p>
    </motion.div>
  )
}

export default Loader
