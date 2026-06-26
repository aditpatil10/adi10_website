import { useMemo } from 'react'

/**
 * Ambient cosmic backdrop: three slowly drifting aurora blobs layered under a
 * field of softly twinkling stars. Purely decorative and fixed behind content.
 */
function Background() {
  // Generate a stable field of stars once per mount.
  const stars = useMemo(
    () =>
      Array.from({ length: 60 }, (_, i) => ({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() * 2 + 1,
        delay: Math.random() * 4,
        duration: Math.random() * 3 + 3,
      })),
    [],
  )

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-night-950"
    >
      {/* Aurora blobs */}
      <div className="absolute -top-40 -left-32 h-[42rem] w-[42rem] rounded-full bg-aura-500/25 blur-[120px] animate-aurora" />
      <div className="absolute top-1/3 -right-40 h-[38rem] w-[38rem] rounded-full bg-dawn-500/20 blur-[130px] animate-aurora-slow" />
      <div className="absolute -bottom-48 left-1/4 h-[40rem] w-[40rem] rounded-full bg-sky-soft/15 blur-[140px] animate-aurora" />

      {/* Star field */}
      {stars.map((s) => (
        <span
          key={s.id}
          className="absolute rounded-full bg-mist-100 animate-twinkle"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}

      {/* Subtle vignette to settle the edges */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,var(--color-night-950)_100%)]" />
    </div>
  )
}

export default Background
