import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { NavLink, Link } from 'react-router-dom'

const links = [
  { to: '/about', label: 'About' },
  { to: '/writings', label: 'Writings' },
  { to: '/practices', label: 'Practices' },
]

function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled
          ? 'border-b border-white/5 bg-night-950/70 backdrop-blur-xl'
          : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link
          to="/"
          className="group font-display text-lg tracking-tight text-mist-100"
          onClick={() => setOpen(false)}
        >
          <span className="bg-gradient-to-r from-dawn-300 to-aura-300 bg-clip-text text-transparent">
            Adit
          </span>
          <span className="text-mist-500 transition-colors group-hover:text-mist-100">
            {' '}
            Patil
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-8 text-sm sm:flex">
          {links.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                className={({ isActive }) =>
                  `group relative tracking-wide transition-colors ${
                    isActive
                      ? 'text-mist-100'
                      : 'text-mist-500 hover:text-mist-100'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {l.label}
                    <span
                      className={`absolute -bottom-1.5 left-0 h-px bg-gradient-to-r from-dawn-400 to-aura-400 transition-all duration-300 ${
                        isActive ? 'w-full' : 'w-0 group-hover:w-full'
                      }`}
                    />
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setOpen((o) => !o)}
          className="flex flex-col gap-1.5 sm:hidden"
        >
          <span
            className={`h-px w-6 bg-mist-100 transition-transform duration-300 ${open ? 'translate-y-[7px] rotate-45' : ''}`}
          />
          <span
            className={`h-px w-6 bg-mist-100 transition-opacity duration-300 ${open ? 'opacity-0' : ''}`}
          />
          <span
            className={`h-px w-6 bg-mist-100 transition-transform duration-300 ${open ? '-translate-y-[7px] -rotate-45' : ''}`}
          />
        </button>
      </nav>

      {/* Mobile menu */}
      <motion.ul
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
        className="overflow-hidden px-6 sm:hidden"
      >
        {links.map((l) => (
          <li key={l.to} className="border-t border-white/5">
            <NavLink
              to={l.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block py-3 text-sm tracking-wide ${
                  isActive ? 'text-mist-100' : 'text-mist-500'
                }`
              }
            >
              {l.label}
            </NavLink>
          </li>
        ))}
      </motion.ul>
    </motion.header>
  )
}

export default Nav
