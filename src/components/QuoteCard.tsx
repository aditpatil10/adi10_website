import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

type Voice = {
  quote: string
  author: string
  source?: string
  note?: string
}

/* A rotating set of voices on breath and consciousness. Wording verified. */
const voices: Voice[] = [
  {
    quote:
      'No matter what we eat, how much we exercise, how skinny or young or wise we are, none of it matters unless we’re breathing correctly.',
    author: 'James Nestor',
    source: 'Breath',
    note: 'Breath is the one part of the autonomic nervous system we can consciously take hold of. Every other lever — heart rate, blood pressure, the tide of stress hormones — runs on autopilot, but the breath answers to us directly. Slow it down and the body follows: the heart settles, the “fight or flight” response eases, and the mind grows quiet.',
  },
  {
    quote: 'One conscious breath in and out is a meditation.',
    author: 'Eckhart Tolle',
    note: 'You don’t need a cushion or an hour. A single breath, fully attended to, is already the whole practice — it lifts you out of thought and into the present moment.',
  },
  {
    quote:
      'The way you breathe is the way you think. The way you think is the way you breathe.',
    author: 'Sadhguru',
    note: 'Breath and mind move together. Agitate one and you agitate the other; steady the breath and the mind grows steady in the same measure.',
  },
  {
    quote:
      'Breath is the bridge which connects life to consciousness, which unites your body to your thoughts.',
    author: 'Thich Nhat Hanh',
    source: 'The Miracle of Mindfulness',
    note: 'When the mind scatters, the breath is the quickest way back. Follow one full in-breath and out-breath and you are here again — body and mind rejoined in the same moment.',
  },
  {
    quote:
      'Where you place your attention is where you place your energy. If all of your attention is in the present moment, you have a lot of energy to create with.',
    author: 'Dr. Joe Dispenza',
    note: 'The breath is the simplest place to rest that attention. Each conscious inhale pulls you out of past and future and into the one moment where anything can actually change.',
  },
]

const ROTATE_MS = 8000

function QuoteCard() {
  // Start on a random voice so the page feels fresh each visit.
  const [i, setI] = useState(() => Math.floor(Math.random() * voices.length))
  const [dir, setDir] = useState(1)
  const [paused, setPaused] = useState(false)
  const v = voices[i]

  const go = (d: number) => {
    setDir(d)
    setI((n) => (n + d + voices.length) % voices.length)
  }

  // Auto-advance every few seconds; the timer resets on manual nav (dep on i)
  // and pauses while the reader is hovering the card.
  useEffect(() => {
    if (paused) return
    const id = window.setTimeout(() => go(1), ROTATE_MS)
    return () => window.clearTimeout(id)
  }, [i, paused])

  return (
    <figure
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="flex items-center gap-2 rounded-3xl border border-white/8 bg-night-800 px-3 py-8 backdrop-blur-sm sm:gap-4 sm:px-5"
    >
      <button
        type="button"
        onClick={() => go(-1)}
        aria-label="Previous quote"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-mist-500 transition-colors hover:text-mist-100"
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
          <path d="m15 6-6 6 6 6" />
        </svg>
      </button>

      <div className="min-w-0 flex-1 overflow-hidden px-1 sm:px-2">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={i}
            custom={dir}
            initial={{ opacity: 0, x: dir * 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -28 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <blockquote className="font-display text-xl leading-relaxed font-light text-mist-100 italic sm:text-2xl">
              “{v.quote}”
            </blockquote>
            <figcaption className="mt-4 text-sm tracking-wide text-aura-300">
              {v.author}
              {v.source && (
                <>
                  , <span className="italic">{v.source}</span>
                </>
              )}
            </figcaption>
            {v.note && (
              <p className="mt-6 text-sm leading-relaxed text-mist-300">
                {v.note}
              </p>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Progress dots */}
        <div className="mt-7 flex gap-1.5">
          {voices.map((_, idx) => (
            <span
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === i ? 'w-4 bg-aura-400' : 'w-1.5 bg-white/15'
              }`}
            />
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => go(1)}
        aria-label="Next quote"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-mist-500 transition-colors hover:text-mist-100"
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
          <path d="m9 6 6 6-6 6" />
        </svg>
      </button>
    </figure>
  )
}

export default QuoteCard
