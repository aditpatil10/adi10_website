/**
 * Practice history for the breathing tool — persisted in localStorage.
 * Tracks a daily streak, total minutes, and total sessions. No backend.
 */

export type PracticeStats = {
  totalMinutes: number
  totalSessions: number
  lastDate: string // local YYYY-MM-DD of the most recent session
  streak: number // consecutive-day streak as of lastDate
  best: number // best streak ever reached
}

const KEY = 'bt-stats'

const EMPTY: PracticeStats = {
  totalMinutes: 0,
  totalSessions: 0,
  lastDate: '',
  streak: 0,
  best: 0,
}

/* Local calendar day as YYYY-MM-DD (not UTC, so "today" matches the user). */
export function dateKey(d = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/* Whole days from date-key a to date-key b (b - a). */
function daysBetween(a: string, b: string): number {
  const da = new Date(`${a}T00:00:00`).getTime()
  const db = new Date(`${b}T00:00:00`).getTime()
  return Math.round((db - da) / 86_400_000)
}

export function loadStats(): PracticeStats {
  if (typeof localStorage === 'undefined') return { ...EMPTY }
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { ...EMPTY }
    return { ...EMPTY, ...(JSON.parse(raw) as Partial<PracticeStats>) }
  } catch {
    return { ...EMPTY }
  }
}

/** Record a completed session and return the updated stats. */
export function recordSession(minutes: number): PracticeStats {
  const s = loadStats()
  const today = dateKey()

  if (!s.lastDate) {
    s.streak = 1
  } else {
    const diff = daysBetween(s.lastDate, today)
    if (diff === 1) s.streak += 1 // next day → extend
    else if (diff > 1) s.streak = 1 // gap → reset
    // diff === 0 (same day) or diff < 0 (clock skew) → leave streak as-is
  }

  s.totalMinutes += minutes
  s.totalSessions += 1
  s.lastDate = today
  s.best = Math.max(s.best, s.streak)

  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(KEY, JSON.stringify(s))
    } catch {
      /* ignore quota / privacy-mode failures */
    }
  }
  return s
}

/** Streak still "alive" for display: 0 once more than a day has lapsed. */
export function effectiveStreak(s: PracticeStats): number {
  if (!s.lastDate) return 0
  return daysBetween(s.lastDate, dateKey()) <= 1 ? s.streak : 0
}
