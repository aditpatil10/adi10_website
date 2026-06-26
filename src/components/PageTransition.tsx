import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

type PageTransitionProps = {
  children: ReactNode
  className?: string
}

/** Wraps each page so route changes cross-fade and gently lift. */
function PageTransition({ children, className }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default PageTransition
