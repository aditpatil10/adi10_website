import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import wavesUrl from '../assets/audio/waves.mp3'
import rainUrl from '../assets/audio/rain.mp3'
import riverUrl from '../assets/audio/river.mp3'
import bowlUrl from '../assets/audio/bowl.mp3'
import {
  loadStats,
  recordSession,
  effectiveStreak,
  type PracticeStats,
} from '../lib/practiceStats'

/* Breathing patterns: phase durations in seconds. */
const patterns = {
  coherent: {
    use: 'Feeling anxious',
    label: 'Coherent · 5-5',
    phases: [5, 5],
    steps: ['Breathe in for 5 seconds', 'Breathe out for 5 seconds'],
    desc: 'Five seconds in, five seconds out — roughly six breaths a minute. This “coherent” pace brings breath and heart rate into sync (heart-rate variability), balancing the nervous system and building a steady, sustained calm.',
  },
  box: {
    use: 'Need to focus',
    label: 'Box · 4-4-4-4',
    phases: [4, 4, 4, 4],
    steps: [
      'Breathe in for 4 seconds',
      'Hold for 4 seconds',
      'Breathe out for 4 seconds',
      'Hold for 4 seconds',
    ],
    desc: 'The even, square rhythm steadies the nervous system, lowers stress, and sharpens focus. Famously used by Navy SEALs and athletes to stay calm under pressure.',
  },
  calm: {
    use: 'Can’t sleep',
    label: 'Calm · 4-7-8',
    phases: [4, 7, 8],
    steps: [
      'Breathe in for 4 seconds',
      'Hold for 7 seconds',
      'Breathe out for 8 seconds',
    ],
    desc: 'The long, drawn-out exhale switches on the parasympathetic “rest and digest” response, slowing the heart and settling a busy mind — ideal for winding down or easing into sleep.',
  },
} as const

type PatternKey = keyof typeof patterns

/* Selectable session lengths, in minutes. */
const durations = [2, 5, 10] as const

/* Ambient nature beds. */
const beds = {
  waves: { label: 'Waves', url: wavesUrl },
  rain: { label: 'Rain', url: rainUrl },
  river: { label: 'River', url: riverUrl },
} as const
type BedKey = keyof typeof beds
const BED_VOLUME = 0.55

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

/* Nature icons. */
const bedIcons: Record<BedKey, ReactNode> = {
  waves: (
    <>
      <path d="M2 10c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2" />
      <path d="M2 15c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2" />
    </>
  ),
  rain: (
    <>
      <path d="M7 13a3.5 3.5 0 0 1 0-7 4.5 4.5 0 0 1 8.6-1.2A3.3 3.3 0 0 1 16 13z" />
      <line x1="8" y1="16" x2="7.5" y2="19" />
      <line x1="12" y1="16" x2="11.5" y2="20" />
      <line x1="16" y1="16" x2="15.5" y2="19" />
    </>
  ),
  river: <path d="M9 3c-2 2.5 6 4.5 4 8s-6 5-4 9" />,
}

function BreathingTimer() {
  const [patternKey, setPatternKey] = useState<PatternKey>('coherent')
  const [minutes, setMinutes] = useState<number>(5)
  const [running, setRunning] = useState(false)
  const [done, setDone] = useState(false)
  const [phase, setPhase] = useState(0)
  const [count, setCount] = useState(0)
  const [elapsedMs, setElapsedMs] = useState(0)
  const [soundOn, setSoundOn] = useState(false)
  const [stats, setStats] = useState<PracticeStats>(() => loadStats())
  const [bed, setBed] = useState<BedKey>(() => {
    if (typeof localStorage === 'undefined') return 'waves'
    const saved = localStorage.getItem('bt-bed')
    return saved && saved in beds ? (saved as BedKey) : 'waves'
  })

  const timer = useRef<number | null>(null)
  const startRef = useRef(0)
  const soundOnRef = useRef(soundOn)
  const bedElRef = useRef<HTMLAudioElement | null>(null)
  const bowlElRef = useRef<HTMLAudioElement | null>(null)
  const fadeRef = useRef<number | null>(null)
  const curBedRef = useRef<BedKey | null>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)

  const pattern = patterns[patternKey]
  const phaseCount = pattern.phases.length
  const sessionMs = minutes * 60 * 1000

  useEffect(() => {
    soundOnRef.current = soundOn
  }, [soundOn])

  /* ---- Audio: real nature bed + Tibetan bowl ---- */
  const fadeTo = (a: HTMLAudioElement, target: number, ms: number) => {
    if (fadeRef.current) window.clearInterval(fadeRef.current)
    const from = a.volume
    const steps = Math.max(1, Math.round(ms / 40))
    let i = 0
    fadeRef.current = window.setInterval(() => {
      i += 1
      a.volume = Math.min(1, Math.max(0, from + (target - from) * (i / steps)))
      if (i >= steps) {
        if (fadeRef.current) window.clearInterval(fadeRef.current)
        fadeRef.current = null
        if (target === 0) a.pause()
      }
    }, 40)
  }

  const playBed = (key: BedKey) => {
    if (!bedElRef.current) {
      const a = new Audio()
      a.loop = true
      a.volume = 0
      bedElRef.current = a
    }
    const a = bedElRef.current
    if (curBedRef.current !== key) {
      a.src = beds[key].url
      curBedRef.current = key
      a.currentTime = 0
    }
    a.volume = 0
    void a.play().catch(() => {})
    fadeTo(a, BED_VOLUME, 900)
  }

  const stopBed = () => {
    if (bedElRef.current && !bedElRef.current.paused)
      fadeTo(bedElRef.current, 0, 700)
  }

  const ensureBowl = () => {
    if (!bowlElRef.current) {
      bowlElRef.current = new Audio(bowlUrl)
      bowlElRef.current.volume = 0.85
    }
    return bowlElRef.current
  }

  // Unlock the bowl within a user gesture (a muted play/pause) so it can ring
  // later at completion — iOS blocks audio that wasn't gesture-primed.
  const primeBowl = () => {
    const a = ensureBowl()
    a.muted = true
    a.play()
      .then(() => {
        a.pause()
        a.currentTime = 0
        a.muted = false
      })
      .catch(() => {
        a.muted = false
      })
  }

  const playBowl = () => {
    const a = ensureBowl()
    a.currentTime = 0
    void a.play().catch(() => {})
  }

  // Stop any audio when leaving the page.
  useEffect(() => {
    return () => {
      if (fadeRef.current) window.clearInterval(fadeRef.current)
      bedElRef.current?.pause()
    }
  }, [])

  /* ---- Guided breathing cues: soft, spiritual bell tones (Web Audio) ----
     Works on every device incl. iPhone. Pitch descends inhale → hold → exhale
     so the breath direction is legible with eyes closed. */
  const ensureCtx = () => {
    if (!audioCtxRef.current) {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext
      audioCtxRef.current = new AC()
    }
    if (audioCtxRef.current.state === 'suspended')
      void audioCtxRef.current.resume()
    return audioCtxRef.current
  }

  const chime = (freq: number) => {
    const ctx = audioCtxRef.current
    if (!ctx) return
    const now = ctx.currentTime
    // Warm lowpass so the bell reads soft and distant, not glassy.
    const lp = ctx.createBiquadFilter()
    lp.type = 'lowpass'
    lp.frequency.value = 1300
    lp.connect(ctx.destination)
    // Fundamental + a faint, slightly detuned octave for gentle shimmer.
    const voices = [
      { mult: 1, gain: 0.03, detune: -4 },
      { mult: 2, gain: 0.008, detune: 6 },
    ]
    const attack = 0.35 // slow fade in
    const release = 2.4 // long, smooth fade out
    for (const v of voices) {
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = freq * v.mult
      osc.detune.value = v.detune
      const g = ctx.createGain()
      g.gain.setValueAtTime(0.0001, now)
      g.gain.linearRampToValueAtTime(v.gain, now + attack) // gentle swell in
      g.gain.exponentialRampToValueAtTime(0.0001, now + attack + release) // fade out
      osc.connect(g)
      g.connect(lp)
      osc.start(now)
      osc.stop(now + attack + release + 0.1)
    }
  }

  const cueIn = () => chime(523.25) // C5 — bright, opening
  const cueHold = () => chime(440.0) // A4 — steady, neutral
  const cueOut = () => chime(349.23) // F4 — low, settling

  /* ---- Haptics (Android only; iOS Safari has no web Vibration API) ---- */
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
      ? 'Begin again'
      : 'Begin'

  /* Phase transitions + per-phase haptic cue. */
  useEffect(() => {
    if (!running) return
    timer.current = window.setTimeout(() => {
      setPhase((p) => (p + 1) % phaseCount)
      setCount((c) => c + 1)
    }, pattern.phases[phase] * 1000)

    const l = phaseLabel(phaseCount, phase)
    if (l === 'Breathe in') {
      haptic(90)
      cueIn()
    } else if (l === 'Breathe out') {
      haptic(45)
      cueOut()
    } else if (l === 'Hold') {
      cueHold()
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
        setStats(recordSession(minutes))
        playBowl()
        stopBed()
        haptic([90, 40, 90])
      } else {
        setElapsedMs(el)
      }
    }, 200)
    return () => window.clearInterval(id)
  }, [running, sessionMs])

  const reset = () => {
    stopBed()
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
    setDone(false)
    setPhase(0)
    setCount(0)
    setElapsedMs(0)
    startRef.current = performance.now()
    setRunning(true)
    // Unlock audio within this tap: guiding bells (Web Audio) always play, and
    // prime the completion bowl so it can ring later (needed on iOS).
    ensureCtx()
    primeBowl()
    if (soundOnRef.current) playBed(bed) // nature bed only "with music"
  }

  const setMusic = (on: boolean) => {
    if (on === soundOn) return
    setSoundOn(on)
    if (on) ensureCtx() // unlock audio within the tap for the guiding chimes
    // Only affect playback mid-session; otherwise the bed waits for Begin.
    if (running) {
      if (on) playBed(bed)
      else stopBed()
    }
  }

  const selectBed = (key: BedKey) => {
    setBed(key)
    if (typeof localStorage !== 'undefined') localStorage.setItem('bt-bed', key)
    if (running && soundOn) playBed(key)
  }

  const cycles = Math.floor(count / phaseCount)
  const progress = done ? 1 : Math.min(1, elapsedMs / sessionMs)
  const remaining = fmt(sessionMs - elapsedMs)
  const streak = effectiveStreak(stats)

  return (
    <div className="flex flex-col items-center gap-7">
      {/* Pattern selector */}
      <div className="flex flex-col items-center gap-3">
        <p className="text-xs tracking-[0.2em] text-mist-500 uppercase">
          How are you feeling?
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {(Object.keys(patterns) as PatternKey[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                setPatternKey(key)
                reset()
              }}
              className={`flex flex-col items-center gap-0.5 rounded-2xl border px-5 py-2.5 transition-colors ${
                patternKey === key
                  ? 'border-aura-400/60 bg-aura-500/15 text-mist-100'
                  : 'border-white/10 text-mist-500 hover:text-mist-100'
              }`}
            >
              <span className="text-sm tracking-wide">{patterns[key].use}</span>
              <span className="text-[10px] tracking-wide text-mist-500">
                {patterns[key].label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Selected pattern: numbered steps + description.
          Keyed by patternKey so the list fully remounts on switch (no stale
          DOM reuse when patterns share a step or differ in length). */}
      <div
        key={patternKey}
        className="-mt-3 flex max-w-md flex-col items-center gap-4"
      >
        <ol className="flex flex-col gap-2">
          {pattern.steps.map((step, i) => (
            <li key={i} className="flex items-center gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-aura-400/40 text-[11px] text-aura-300">
                {i + 1}
              </span>
              <span className="text-sm text-mist-100">{step}</span>
            </li>
          ))}
        </ol>
        <p className="text-center font-lede text-base leading-relaxed text-mist-300 italic">
          {pattern.desc}
        </p>
      </div>

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

      {/* The breathing orb + progress ring (click the orb to start/stop) */}
      <div
        role="button"
        tabIndex={0}
        onClick={toggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            toggle()
          }
        }}
        aria-label={running ? 'Stop session' : 'Start session'}
        className="relative flex h-72 w-72 cursor-pointer items-center justify-center rounded-full select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-aura-400/60"
      >
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

      {/* Stop control (only while a session runs) */}
      {running && (
        <button
          type="button"
          onClick={toggle}
          className="rounded-full border border-white/15 bg-white/5 px-8 py-2.5 text-sm tracking-wide text-mist-100 backdrop-blur transition-all hover:border-aura-400/60 hover:bg-aura-500/10"
        >
          Stop
        </button>
      )}

      {/* Sound area */}
      <div className="flex flex-col items-center gap-3">
        {/* With / without music */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMusic(true)}
            aria-pressed={soundOn}
            className={`rounded-full border px-4 py-1.5 text-xs tracking-wide transition-colors ${
              soundOn
                ? 'border-aura-400/60 bg-aura-500/15 text-mist-100'
                : 'border-white/10 text-mist-500 hover:text-mist-100'
            }`}
          >
            With music
          </button>
          <button
            type="button"
            onClick={() => setMusic(false)}
            aria-pressed={!soundOn}
            className={`rounded-full border px-4 py-1.5 text-xs tracking-wide transition-colors ${
              !soundOn
                ? 'border-aura-400/60 bg-aura-500/15 text-mist-100'
                : 'border-white/10 text-mist-500 hover:text-mist-100'
            }`}
          >
            Without music
          </button>
        </div>

        {/* Ambient sound picker — shown with music */}
        {soundOn && (
          <>
            <div className="flex items-center gap-2">
              {(Object.keys(beds) as BedKey[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => selectBed(key)}
                  aria-label={beds[key].label}
                  aria-pressed={bed === key}
                  className={`flex w-16 flex-col items-center gap-1 rounded-xl border px-2 py-2 transition-colors ${
                    bed === key
                      ? 'border-aura-400/60 bg-aura-500/15 text-mist-100'
                      : 'border-white/10 text-mist-500 hover:text-mist-100'
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
                    {bedIcons[key]}
                  </svg>
                  <span className="text-[10px] tracking-wide">
                    {beds[key].label}
                  </span>
                </button>
              ))}
            </div>
          </>
        )}

        <p className="max-w-xs text-center text-[11px] leading-relaxed text-mist-500">
          Soft bells guide each breath in, hold, and out — for practising with
          eyes closed.
        </p>
      </div>

      {/* Status line */}
      <p className="h-4 text-xs text-mist-500">
        {running
          ? `${remaining} left${cycles > 0 ? ` · ${cycles} ${cycles === 1 ? 'cycle' : 'cycles'}` : ''}`
          : done
            ? `Session complete · ${minutes} min, ${cycles} ${cycles === 1 ? 'cycle' : 'cycles'}`
            : ' '}
      </p>

      {/* Practice history */}
      {stats.totalSessions > 0 && (
        <div className="flex flex-col items-center gap-3 border-t border-white/8 pt-6">
          <div className="flex items-center gap-6 sm:gap-8">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1.5 text-dawn-300">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5"
                  aria-hidden
                >
                  <path d="M12 2c1 3-1.5 4.5-1.5 7 0 1.4 1.1 2.5 2.5 2.5S15.5 10.4 15 9c2 1.3 3 3.4 3 5.5a6 6 0 1 1-12 0c0-3.2 2.4-5 3.5-7.2C10.6 4.9 11.4 3.4 12 2z" />
                </svg>
                <span className="font-display text-2xl leading-none text-mist-100">
                  {streak}
                </span>
              </div>
              <span className="mt-1 text-[10px] tracking-[0.2em] text-mist-500 uppercase">
                {streak === 1 ? 'day' : 'day streak'}
              </span>
            </div>

            <div className="flex flex-col items-center">
              <span className="font-display text-2xl leading-none text-mist-100">
                {stats.totalMinutes}
              </span>
              <span className="mt-1 text-[10px] tracking-[0.2em] text-mist-500 uppercase">
                min total
              </span>
            </div>

            <div className="flex flex-col items-center">
              <span className="font-display text-2xl leading-none text-mist-100">
                {stats.totalSessions}
              </span>
              <span className="mt-1 text-[10px] tracking-[0.2em] text-mist-500 uppercase">
                {stats.totalSessions === 1 ? 'session' : 'sessions'}
              </span>
            </div>
          </div>

          <p className="text-xs text-mist-500">
            {streak === 0
              ? 'Sit today to begin a new streak.'
              : stats.best > streak
                ? `Best streak: ${stats.best} days`
                : 'Your best streak yet — keep it going.'}
          </p>
        </div>
      )}
    </div>
  )
}

export default BreathingTimer
