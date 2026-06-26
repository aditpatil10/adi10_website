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
    body: 'Techniques, resources, and a breathing guide to sit with — start right now.',
  },
  {
    to: '/about',
    title: 'About',
    body: 'The person behind the page: an engineer learning to watch his own mind.',
  },
]

function Home() {
  return (
    <PageTransition>
      {/* Hero */}
      <section className="relative min-h-screen overflow-hidden">
        {/* Full-bleed background photo with a slow ken-burns drift */}
        <motion.div
          initial={{ scale: 1.12, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})`, backgroundPosition: 'center 35%' }}
        />

        {/* Fades: darken for text, melt into the page top and bottom */}
        <div className="absolute inset-0 bg-gradient-to-r from-night-950 via-night-950/70 to-night-950/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-night-950 via-night-950/20 to-night-950/60" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-night-950 to-transparent" />

        {/* Content */}
        <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 pt-24 pb-16">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-5 text-sm tracking-[0.3em] text-mist-500 uppercase"
        >
          Engineer · Meditator · Explorer
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-5xl leading-[1.05] font-light sm:text-7xl"
        >
          Building systems by day,
          <br />
          <span className="text-aurora">dissolving the self by dawn.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 max-w-xl text-lg leading-relaxed text-mist-300"
        >
          I&rsquo;m Adit — a software engineer drawn to the oldest open question
          there is: what is this awareness, and who is looking? This is where I
          think out loud about consciousness, meditation, and the quiet that
          underlies a noisy mind.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex flex-wrap gap-4"
        >
          <Link
            to="/writings"
            className="rounded-full bg-gradient-to-r from-dawn-400 to-aura-400 px-7 py-3 text-sm font-medium text-night-950 transition-transform hover:scale-[1.03]"
          >
            Read the writings
          </Link>
          <Link
            to="/practices"
            className="rounded-full border border-white/15 px-7 py-3 text-sm text-mist-100 backdrop-blur transition-colors hover:border-aura-400/60"
          >
            Try a breath
          </Link>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          className="mt-20 text-xs tracking-widest text-mist-500 uppercase"
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
                className="group block h-full rounded-2xl border border-white/8 bg-night-800 p-7 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-aura-400/40 hover:bg-white/5"
              >
                <h3 className="font-display text-2xl text-mist-100">
                  {g.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-mist-500">
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
  )
}

export default Home
