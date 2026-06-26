import type { ReactNode } from 'react'

type Social = { label: string; href: string; icon: ReactNode }

const socials: Social[] = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/aditpatil10/',
    icon: (
      <>
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/aditpatil10/',
    icon: (
      <>
        <rect x="2" y="2" width="20" height="20" rx="3" />
        <line x1="7" y1="10" x2="7" y2="17" />
        <circle cx="7" cy="7" r="0.5" fill="currentColor" stroke="none" />
        <path d="M11 17v-4a2 2 0 0 1 4 0v4" />
        <line x1="11" y1="10" x2="11" y2="17" />
      </>
    ),
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/aditpatil10',
    icon: (
      <path d="M14 9h2.5V6H14a3 3 0 0 0-3 3v2H9v3h2v6h3v-6h2.2l.4-3H14V9.5A.5.5 0 0 1 14.5 9H14z" />
    ),
  },
  {
    label: 'GitHub',
    href: 'https://github.com/aditpatil10',
    icon: (
      <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12 12 0 0 0-6 0C6.2 3.6 5.1 3.9 5.1 3.9a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 3.7 10.3c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V22" />
    ),
  },
  {
    label: 'Email',
    href: 'mailto:adit2patil@gmail.com',
    icon: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),
  },
]

function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/5 px-6 py-12">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-8 sm:flex-row">
        <p className="font-display text-mist-300 italic">
          “The quieter you become, the more you are able to hear.”
        </p>

        <div className="flex items-center gap-3">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              aria-label={s.label}
              title={s.label}
              className="group flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-mist-500 transition-all duration-300 hover:-translate-y-0.5 hover:border-aura-400/50 hover:text-mist-100"
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
                {s.icon}
              </svg>
            </a>
          ))}
        </div>
      </div>

      <p className="mx-auto mt-8 max-w-5xl text-center text-xs text-mist-500/60 sm:text-left">
        © {new Date().getFullYear()} Adit Patil
      </p>
    </footer>
  )
}

export default Footer
