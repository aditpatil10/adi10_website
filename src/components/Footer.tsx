const socials = [
  { label: 'GitHub', href: 'https://github.com/aditpatil10' },
  { label: 'Email', href: 'mailto:adit2patil@gmail.com' },
]

function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/5 px-6 py-10">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 text-sm text-mist-500 sm:flex-row">
        <p className="font-display italic">
          “The quieter you become, the more you are able to hear.”
        </p>
        <div className="flex items-center gap-6">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-mist-100"
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
      <p className="mx-auto mt-6 max-w-5xl text-center text-xs text-mist-500/60 sm:text-left">
        © {new Date().getFullYear()} Adit Patil
      </p>
    </footer>
  )
}

export default Footer
