import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'

/* Breathing patterns: phase durations in seconds. */
const patterns = {
  box: {
    label: 'Box · 4-4-4-4',
    phases: [4, 4, 4, 4],
    desc: 'Breathe in, hold, out, and hold — each for four counts. The even, square rhythm steadies the nervous system, lowers stress, and sharpens focus. Famously used by Navy SEALs and athletes to stay calm under pressure.',
  },
  calm: {
    label: 'Calm · 4-7-8',
    phases: [4, 7, 8],
    desc: 'In for four, hold for seven, out for eight. The long, drawn-out exhale switches on the parasympathetic “rest and digest” response, slowing the heart and settling a busy mind — ideal for winding down or easing into sleep.',
  },
  coherent: {
    label: 'Coherent · 5-5',
    phases: [5, 5],
    desc: 'Five seconds in, five seconds out — roughly six breaths a minute. This “coherent” pace brings breath and heart rate into sync (heart-rate variability), balancing the nervous system and building a steady, sustained calm.',
  },
} as const

type PatternKey = keyof typeof patterns

/* Selectable session lengths, in minutes. */
const durations = [2, 5, 10] as const

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

/* Progress ring geometry. */
const RING_R = 140
const RING_C = 2 * Math.PI * RING_R

function fmt(ms: number) {
  const s = Math.max(0, Math.round(ms / 1000))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

function BreathingTimer() {
  const [patternKey, setPatternKey] = useState<PatternKey>('box')
  const [minutes, setMinutes] = useState<number>(5)
  const [running, setRunning] = useState(false)
  const [done, setDone] = useState(false)
  const [phase, setPhase] = useState(0)
  const [count, setCount] = useState(0)
  const [elapsedMs, setElapsedMs] = useState(0)
  const [soundOn, setSoundOn] = useState(false)

  const timer = useRef<number | null>(null)
  const startRef = useRef(0)
  const soundOnRef = useRef(soundOn)
  const audioRef = useRef<AudioContext | null>(null)

  const pattern = patterns[patternKey]
  const phaseCount = pattern.phases.length
  const sessionMs = minutes * 60 * 1000

  useEffect(() => {
    soundOnRef.current = soundOn
  }, [soundOn])

  /* ---- Audio: a synthesized singing bowl, no files needed ---- */
  const ensureAudio = () => {
    if (!audioRef.current) {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext
      audioRef.current = new AC()
    }
    if (audioRef.current.state === 'suspended') void audioRef.current.resume()
    return audioRef.current
  }

  const strike = (
    partials: { freq: number; gain: number }[],
    dur: number,
  ) => {
    const ctx = audioRef.current
    if (!ctx) return
    const now = ctx.currentTime
    for (const p of partials) {
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = p.freq
      const g = ctx.createGain()
      g.gain.setValueAtTime(0.0001, now)
      g.gain.exponentialRampToValueAtTime(p.gain, now + 0.02)
      g.gain.exponentialRampToValueAtTime(0.0001, now + dur)
      osc.connect(g)
      g.connect(ctx.destination)
      osc.start(now)
      osc.stop(now + dur + 0.05)
    }
  }

  /* A subtle meditation gong: inharmonic metal partials with a soft mallet
     attack, slight detune shimmer, and a lowpass that warms as it decays. */
  const gong = (base: number, dur: number, level: number) => {
    const ctx = audioRef.current
    if (!ctx) return
    const now = ctx.currentTime
    // Dark lowpass → muffled, distant gong rather than a bright strike.
    const lp = ctx.createBiquadFilter()
    lp.type = 'lowpass'
    lp.frequency.setValueAtTime(700, now)
    lp.frequency.exponentialRampToValueAtTime(240, now + dur)
    lp.Q.value = 0.5
    lp.connect(ctx.destination)

    // Fundamental plus two faint partials only; ratio, gain, detune (cents).
    const partials = [
      { r: 1, g: 1.0, d: 0 },
      { r: 1.52, g: 0.22, d: 4 },
      { r: 2.14, g: 0.08, d: -5 },
    ]
    for (const p of partials) {
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = base * p.r
      osc.detune.value = p.d
      const g = ctx.createGain()
      const peak = 0.035 * level * p.g
      g.gain.setValueAtTime(0.0001, now)
      g.gain.exponentialRampToValueAtTime(peak, now + 0.35) // slow swell in
      g.gain.exponentialRampToValueAtTime(0.0001, now + dur)
      osc.connect(g)
      g.connect(lp)
      osc.start(now)
      osc.stop(now + dur + 0.1)
    }
  }

  const bellIn = () => gong(180, 3.4, 0.5)
  const bellOut = () => gong(140, 3.8, 0.5)
  const bellDone = () =>
    strike(
      [
        { freq: 432, gain: 0.22 },
        { freq: 864, gain: 0.08 },
        { freq: 1296, gain: 0.03 },
      ],
      4.5,
    )

  /* ---- Haptics on mobile ---- */
  const haptic = (ms: number | number[]) => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator)
      navigator.vibrate(ms)
  }

  const scale = useMemo(
    () => (running ? phaseScale(phaseCount, phase) : done ? 0.55 : 0.7),
    [running, done, phaseCount, phase],
  )
  const duration = running ? pattern.phases[phase] : 0.8
  const label = running
    ? phaseLabel(phaseCount, phase)
    : done
      ? 'Complete'
      : 'Press start'

  /* Phase transitions + per-phase cues (bell + haptic). */
  useEffect(() => {
    if (!running) return
    timer.current = window.setTimeout(() => {
      setPhase((p) => (p + 1) % phaseCount)
      setCount((c) => c + 1)
    }, pattern.phases[phase] * 1000)

    const l = phaseLabel(phaseCount, phase)
    if (l === 'Breathe in') {
      if (soundOnRef.current) bellIn()
      haptic(70)
    } else if (l === 'Breathe out') {
      if (soundOnRef.current) bellOut()
      haptic(35)
    }

    return () => {
      if (timer.current) window.clearTimeout(timer.current)
    }
  }, [running, phase, phaseCount, pattern])

  /* Session clock → progress ring + completion. */
  useEffect(() => {
    if (!running) return
    const id = window.setInterval(() => {
      const el = performance.now() - startRef.current
      if (el >= sessionMs) {
        window.clearInterval(id)
        setElapsedMs(sessionMs)
        setRunning(false)
        setDone(true)
        if (soundOnRef.current) bellDone()
        haptic([90, 40, 90])
      } else {
        setElapsedMs(el)
      }
    }, 200)
    return () => window.clearInterval(id)
  }, [running, sessionMs])

  const reset = () => {
    setRunning(false)
    setDone(false)
    setPhase(0)
    setCount(0)
    setElapsedMs(0)
  }

  const toggle = () => {
    if (running) {
      reset()
      return
    }
    ensureAudio() // create/resume within the user gesture
    setDone(false)
    setPhase(0)
    setCount(0)
    setElapsedMs(0)
    startRef.current = performance.now()
    setRunning(true)
  }

  const toggleSound = () => {
    if (!soundOn) ensureAudio()
    setSoundOn((s) => !s)
  }

  const cycles = Math.floor(count / phaseCount)
  const progress = done ? 1 : Math.min(1, elapsedMs / sessionMs)
  const remaining = fmt(sessionMs - elapsedMs)

  return (
    <div className="flex flex-col items-center gap-7">
      {/* Pattern selector */}
      <div className="flex flex-wrap justify-center gap-2">
        {(Object.keys(patterns) as PatternKey[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => {
              setPatternKey(key)
              reset()
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

      {/* Selected pattern description */}
      <p className="-mt-3 max-w-md text-center text-xs leading-relaxed text-mist-500">
        {pattern.desc}
      </p>

      {/* Session length selector */}
      <div className="flex items-center gap-2">
        <span className="mr-1 text-xs tracking-wide text-mist-500">
          Session
        </span>
        {durations.map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setMinutes(m)
              reset()
            }}
            className={`rounded-full border px-3.5 py-1.5 text-xs tracking-wide transition-colors ${
              minutes === m
                ? 'border-dawn-400/60 bg-dawn-500/15 text-mist-100'
                : 'border-white/10 text-mist-500 hover:text-mist-100'
            }`}
          >
            {m} min
          </button>
        ))}
      </div>

      {/* The breathing orb + progress ring */}
      <div className="relative flex h-72 w-72 items-center justify-center">
        {/* Progress ring */}
        <svg
          viewBox="0 0 288 288"
          className="pointer-events-none absolute inset-0 h-full w-full -rotate-90"
        >
          <defs>
            <linearGradient id="ring-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--color-dawn-400)" />
              <stop offset="100%" stopColor="var(--color-aura-400)" />
            </linearGradient>
          </defs>
          <circle
            cx="144"
            cy="144"
            r={RING_R}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="3"
          />
          <circle
            cx="144"
            cy="144"
            r={RING_R}
            fill="none"
            stroke="url(#ring-grad)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={RING_C}
            strokeDashoffset={RING_C * (1 - progress)}
            className="transition-[stroke-dashoffset] duration-200 ease-linear"
          />
        </svg>

        {/* Soft halo */}
        <motion.div
          animate={{ scale, opacity: running ? 0.35 : 0.2 }}
          transition={{ duration, ease: 'easeInOut' }}
          className="absolute h-52 w-52 rounded-full bg-aura-500/20 blur-2xl"
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
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggle}
          className="rounded-full border border-white/15 bg-white/5 px-8 py-2.5 text-sm tracking-wide text-mist-100 backdrop-blur transition-all hover:border-aura-400/60 hover:bg-aura-500/10"
        >
          {running ? 'Stop' : done ? 'Sit again' : 'Begin'}
        </button>

        <button
          type="button"
          onClick={toggleSound}
          aria-label={soundOn ? 'Mute sound' : 'Enable sound'}
          title={soundOn ? 'Sound on' : 'Sound off'}
          className={`flex h-10 w-10 items-center justify-center rounded-full border transition-colors ${
            soundOn
              ? 'border-aura-400/60 bg-aura-500/15 text-mist-100'
              : 'border-white/15 text-mist-500 hover:text-mist-100'
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <path d="M11 5 6 9H3v6h3l5 4z" />
            {soundOn ? (
              <>
                <path d="M15.5 8.5a5 5 0 0 1 0 7" />
                <path d="M18.5 6a9 9 0 0 1 0 12" />
              </>
            ) : (
              <>
                <line x1="16" y1="9" x2="22" y2="15" />
                <line x1="22" y1="9" x2="16" y2="15" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Status line */}
      <p className="h-4 text-xs text-mist-500">
        {running
          ? `${remaining} left${cycles > 0 ? ` · ${cycles} ${cycles === 1 ? 'cycle' : 'cycles'}` : ''}`
          : done
            ? `Session complete · ${minutes} min, ${cycles} ${cycles === 1 ? 'cycle' : 'cycles'}`
            : ' '}
      </p>
    </div>
  )
}

export default BreathingTimer
