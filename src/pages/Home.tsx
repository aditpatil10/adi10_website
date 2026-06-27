import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import PageTransition from '../components/PageTransition'
import Reveal from '../components/Reveal'
import heroBg from '../assets/home-hero-times-square.jpg'

const gateways = [
  {
    to: '/writings',
    title: 'Writings',
    body: 'Reflections on meditation, consciousness, and the space between logic and silence.',
  },
  {
    to: '/practices',
    title: 'Practices',
    body: 'Techniques, resources, and a breathing guide to sit with, starting right now.',
  },
  {
    to: '/about',
    title: 'About',
    body: 'The person behind the page: a developer learning to watch his own mind.',
  },
]

function Home() {
  return (
    <>
      {/* Page-wide background photo — fixed so it covers 100% of the page as you
          scroll. Only mounted while Home is on screen. */}
      <motion.div
        aria-hidden
        initial={{ scale: 1.12, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-0 -z-10 bg-cover"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundPosition: 'center 35%',
        }}
      />
      {/* Soft legibility overlay — darker on the left for the text, gentle
          everywhere else so the photo stays visible top to bottom. */}
      <div
        aria-hidden
        className="fixed inset-0 -z-10 bg-gradient-to-r from-night-950/90 via-night-950/55 to-night-950/25"
      />
      {/* Extra bottom darkening on mobile, where the intro text sits */}
      <div
        aria-hidden
        className="fixed inset-x-0 bottom-0 -z-10 h-2/3 bg-gradient-to-t from-night-950/85 via-night-950/35 to-transparent sm:hidden"
      />

      <PageTransition>
        {/* Hero — on mobile, top/bottom split keeps the middle (subject's face)
            clear of text; on desktop it's a single centered block. */}
        <section className="mx-auto flex min-h-screen max-w-5xl flex-col justify-between px-6 pt-24 pb-16 sm:justify-center">
          {/* Top group: eyebrow + headline */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="mb-5 text-sm tracking-[0.3em] text-mist-300 uppercase"
            >
              Developer · Consciousness Explorer · Traveler
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-4xl leading-[1.05] font-light drop-shadow-[0_2px_20px_rgba(0,0,0,0.6)] sm:text-7xl"
            >
              Building systems by day,
              <br />
              <span className="text-aurora">dissolving the self by dawn.</span>
            </motion.h1>
          </div>

          {/* Bottom group: intro + actions */}
          <div className="mt-auto sm:mt-8">
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-xl font-lede text-lg leading-relaxed font-light text-mist-100 drop-shadow-[0_1px_12px_rgba(0,0,0,0.85)] sm:text-xl"
            >
              I&rsquo;m Adit, a software developer drawn to the oldest open
              question there is: what is this awareness, and who is looking?
              <span className="hidden sm:inline">
                {' '}
                This is where I think out loud about consciousness, meditation,
                and the quiet that underlies a noisy mind.
              </span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <Link
                to="/writings"
                className="rounded-full bg-gradient-to-r from-dawn-400 to-aura-400 px-7 py-3 text-sm font-medium text-night-950 transition-transform hover:scale-[1.03]"
              >
                Read the writings
              </Link>
              <Link
                to="/practices"
                className="rounded-full border border-white/25 bg-white/5 px-7 py-3 text-sm text-mist-100 backdrop-blur transition-colors hover:border-aura-400/60"
              >
                Try a breath
              </Link>
            </motion.div>

            {/* Scroll cue */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              className="mt-10 hidden text-xs tracking-widest text-mist-300 uppercase sm:mt-20 sm:block"
            >
              ↓ Explore
            </motion.div>
          </div>
        </section>

        {/* Gateways */}
        <section className="mx-auto max-w-5xl px-6 pb-32">
          <div className="grid gap-5 sm:grid-cols-3">
            {gateways.map((g, i) => (
              <Reveal key={g.to} delay={i * 0.1}>
                <Link
                  to={g.to}
                  className="group block h-full rounded-2xl border border-white/10 bg-night-950/60 p-7 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-aura-400/40 hover:bg-night-950/70"
                >
                  <h3 className="font-display text-2xl text-mist-100">
                    {g.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-mist-300">
                    {g.body}
                  </p>
                  <span className="mt-5 inline-block text-sm text-aura-300 transition-transform duration-300 group-hover:translate-x-1">
                    Enter →
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      </PageTransition>
    </>
  )
}

export default Home
