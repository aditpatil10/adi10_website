import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'

/* Breathing patterns: phase durations in seconds. */
const patterns = {
  box: { label: 'Box · 4-4-4-4', phases: [4, 4, 4, 4] },
  calm: { label: 'Calm · 4-7-8', phases: [4, 7, 8] },
  coherent: { label: 'Coherent · 5-5', phases: [5, 5] },
} as const

type PatternKey = keyof typeof patterns

/* Each phase's label cycles inhale → hold → exhale → hold. */
const phaseNames = ['Breathe in', 'Hold', 'Breathe out', 'Hold']

function phaseLabel(patternLen: number, index: number) {
  if (patternLen === 2) return index === 0 ? 'Breathe in' : 'Breathe out'
  if (patternLen === 3) return ['Breathe in', 'Hold', 'Breathe out'][index]
  return phaseNames[index]
}

/* Target scale of the orb for each phase (inhale grows, exhale shrinks). */
function phaseScale(patternLen: number, index: number) {
  const label = phaseLabel(patternLen, index)
  if (label === 'Breathe in') return 1
  if (label === 'Breathe out') return 0.55
  // Hold keeps the previous extreme: hold-after-inhale stays big, else small.
  return index === 1 ? 1 : 0.55
}

function BreathingTimer() {
  const [patternKey, setPatternKey] = useState<PatternKey>('box')
  const [running, setRunning] = useState(false)
  const [phase, setPhase] = useState(0)
  const [count, setCount] = useState(0)
  const timer = useRef<number | null>(null)

  const pattern = patterns[patternKey]
  const phaseCount = pattern.phases.length

  const scale = useMemo(
    () => (running ? phaseScale(phaseCount, phase) : 0.7),
    [running, phaseCount, phase],
  )
  const duration = running ? pattern.phases[phase] : 0.8
  const label = running ? phaseLabel(phaseCount, phase) : 'Press start'

  useEffect(() => {
    if (!running) return
    timer.current = window.setTimeout(() => {
      setPhase((p) => (p + 1) % phaseCount)
      setCount((c) => c + 1)
    }, pattern.phases[phase] * 1000)
    return () => {
      if (timer.current) window.clearTimeout(timer.current)
    }
  }, [running, phase, phaseCount, pattern])

  const toggle = () => {
    if (running) {
      setRunning(false)
      setPhase(0)
      setCount(0)
    } else {
      setPhase(0)
      setCount(0)
      setRunning(true)
    }
  }

  const cycles = Math.floor(count / phaseCount)

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Pattern selector */}
      <div className="flex flex-wrap justify-center gap-2">
        {(Object.keys(patterns) as PatternKey[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => {
              setPatternKey(key)
              setRunning(false)
              setPhase(0)
              setCount(0)
            }}
            className={`rounded-full border px-4 py-1.5 text-xs tracking-wide transition-colors ${
              patternKey === key
                ? 'border-aura-400/60 bg-aura-500/15 text-mist-100'
                : 'border-white/10 text-mist-500 hover:text-mist-100'
            }`}
          >
            {patterns[key].label}
          </button>
        ))}
      </div>

      {/* The breathing orb */}
      <div className="relative flex h-72 w-72 items-center justify-center">
        {/* Soft halo rings */}
        <motion.div
          animate={{ scale, opacity: running ? 0.35 : 0.2 }}
          transition={{ duration, ease: 'easeInOut' }}
          className="absolute h-full w-full rounded-full bg-aura-500/20 blur-2xl"
        />
        <motion.div
          animate={{ scale }}
          transition={{ duration, ease: 'easeInOut' }}
          className="absolute h-56 w-56 rounded-full border border-white/10"
        />
        {/* Core orb */}
        <motion.div
          animate={{ scale }}
          transition={{ duration, ease: 'easeInOut' }}
          className="flex h-44 w-44 items-center justify-center rounded-full bg-gradient-to-br from-dawn-300/80 via-aura-400/70 to-sky-soft/70 shadow-[0_0_60px_-10px_var(--color-aura-500)]"
        >
          <span className="font-display text-lg text-night-950">{label}</span>
        </motion.div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={toggle}
          className="rounded-full border border-white/15 bg-white/5 px-8 py-2.5 text-sm tracking-wide text-mist-100 backdrop-blur transition-all hover:border-aura-400/60 hover:bg-aura-500/10"
        >
          {running ? 'Stop' : 'Begin'}
        </button>
        <p className="h-4 text-xs text-mist-500">
          {running && cycles > 0
            ? `${cycles} ${cycles === 1 ? 'cycle' : 'cycles'} complete`
            : ' '}
        </p>
      </div>
    </div>
  )
}

export default BreathingTimer
