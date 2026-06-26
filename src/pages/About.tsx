import { motion } from 'framer-motion'
import PageTransition from '../components/PageTransition'
import Reveal from '../components/Reveal'
import portrait from '../assets/background.jpg'
import lakeRainier from '../assets/travel/lake-rainier.jpg'
import mountainHike from '../assets/travel/mountain-hike.jpg'
import iceCave from '../assets/travel/ice-cave.jpg'
import scubaDiving from '../assets/travel/scuba-diving.jpg'
import lavaCave from '../assets/travel/lava-cave.jpg'
import forestMeditation from '../assets/travel/forest-meditation.jpg'

const travels = [
  { src: mountainHike, caption: 'Cascade ridgelines, first snow' },
  { src: scubaDiving, caption: 'Weightless on the reef' },
  { src: lakeRainier, caption: 'Beneath Mount Rainier' },
  { src: iceCave, caption: 'Inside a glacier' },
  { src: forestMeditation, caption: 'Stillness in the pines' },
  { src: lavaCave, caption: 'Swallowed by a lava tube' },
]

const timeline = [
  {
    year: 'Now',
    text: 'Engineering by day, sitting in meditation by dawn — and writing about where the two meet.',
  },
  {
    year: 'The turn',
    text: 'A first silent retreat reframed everything. The mind, observed closely, stopped looking like “me”.',
  },
  {
    year: 'Beginnings',
    text: 'Came for the focus and the calm. Stayed for the much stranger questions underneath.',
  },
]

function About() {
  return (
    <PageTransition>
      <section className="mx-auto max-w-3xl px-6 pt-32 pb-24">
        <Reveal>
          <p className="text-sm tracking-[0.3em] text-mist-500 uppercase">
            About
          </p>
          <h1 className="mt-4 font-display text-4xl leading-tight font-light sm:text-5xl">
            An engineer learning to{' '}
            <span className="text-aurora">watch his own mind.</span>
          </h1>
        </Reveal>

        {/* Portrait + opening */}
        <div className="mt-12 flex flex-col items-center gap-10 sm:flex-row sm:items-start">
          <Reveal delay={0.1} className="shrink-0">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
              className="relative"
            >
              {/* Aura glow behind the portrait */}
              <div className="absolute -inset-4 rounded-full bg-gradient-to-br from-dawn-400/30 via-aura-400/30 to-sky-soft/20 blur-2xl" />
              <img
                src={portrait}
                alt="Adit Patil"
                className="relative h-44 w-44 rounded-full border border-white/10 object-cover shadow-[0_0_50px_-12px_var(--color-aura-500)] sm:h-52 sm:w-52"
              />
            </motion.div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="space-y-6 text-lg leading-relaxed text-mist-300">
              <p>
              I&rsquo;m Adit Patil. By trade I build software — systems, logic,
              the satisfying click of a problem solved. But the thread running
              through my life isn&rsquo;t really code. It&rsquo;s attention:
              where it goes, what it&rsquo;s made of, and what happens when it
              turns back on itself.
            </p>
            <p>
              Meditation started as a way to quiet a busy head. It became
              something stranger and more interesting — a direct, first-person
              laboratory for the questions philosophers argue about in the
              third person. This site is my notebook for that exploration:
              honest, unfinished, and written as much for me as for you.
            </p>
            <p className="font-display text-xl text-mist-100 italic">
              I don&rsquo;t have answers. I have a practice, a curiosity, and a
              willingness to keep looking.
            </p>
            </div>
          </Reveal>
        </div>

        {/* Mini timeline */}
        <div className="mt-16 space-y-px">
          {timeline.map((t, i) => (
            <Reveal key={t.year} delay={i * 0.1}>
              <div className="group flex gap-6 border-t border-white/8 py-6">
                <div className="w-24 shrink-0 font-display text-sm text-aura-300">
                  {t.year}
                </div>
                <p className="text-mist-300">{t.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Traveler */}
      <section className="mx-auto max-w-5xl px-6 pb-32">
        <Reveal>
          <p className="text-sm tracking-[0.3em] text-mist-500 uppercase">
            The wanderer
          </p>
          <h2 className="mt-4 font-display text-3xl leading-tight font-light sm:text-4xl">
            The same curiosity, turned{' '}
            <span className="text-aurora">outward.</span>
          </h2>
          <p className="mt-5 max-w-xl text-mist-300">
            When I&rsquo;m not sitting still, I&rsquo;m usually somewhere far
            from home — under the sea, inside a glacier, or on a ridge at first
            light. Travel is just meditation with the eyes open: the same act of
            paying full attention to a world that&rsquo;s always larger than I
            expected.
          </p>
        </Reveal>

        <div className="mt-12 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
          {travels.map((t, i) => (
            <Reveal key={t.caption} delay={(i % 3) * 0.08}>
              <figure className="group relative overflow-hidden rounded-2xl border border-white/8">
                <img
                  src={t.src}
                  alt={t.caption}
                  loading="lazy"
                  className="w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-night-950/80 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <figcaption className="absolute bottom-0 left-0 right-0 translate-y-2 p-4 font-display text-sm text-mist-100 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  {t.caption}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>
    </PageTransition>
  )
}

export default About
