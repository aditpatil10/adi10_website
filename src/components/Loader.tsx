import { motion } from 'framer-motion'

/**
 * Full-screen intro loader: a single orb that "breathes" (inhale on expand,
 * exhale on contract) while the app and its hero assets load, then dissolves.
 * Mounted/unmounted by App via AnimatePresence so the exit fade plays.
 */
function Loader() {
  return (
    <motion.div
      key="loader"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-night-950"
    >
      {/* Breathing orb */}
      <motion.div
        animate={{ scale: [1, 1.35, 1], opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="relative h-24 w-24"
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-dawn-400 via-aura-400 to-sky-soft blur-xl" />
        <div className="absolute inset-3 rounded-full bg-gradient-to-br from-dawn-300/80 to-aura-400/70" />
      </motion.div>

      {/* Wordmark */}
      <motion.p
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="mt-12 font-nav text-lg font-medium tracking-[0.4em] text-mist-300 uppercase"
      >
        Adit Patil
      </motion.p>
    </motion.div>
  )
}

export default Loader
