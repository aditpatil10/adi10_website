import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

type RevealProps = {
  children: ReactNode
  /** Stagger delay in seconds. */
  delay?: number
  /** Travel distance in px. */
  y?: number
  className?: string
}

/** Fades and lifts its children into view the first time they're scrolled near. */
function Reveal({ children, delay = 0, y = 28, className }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default Reveal
