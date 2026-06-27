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

const aspects = [
  {
    src: mountainHike,
    label: 'The Mountaineer',
    title: 'Drawn upward, toward the quiet at altitude.',
    body: 'There’s a clarity that only arrives after the climb, where the air thins, the chatter falls away, and the view does the thinking for you. The summits keep teaching me the same lesson the cushion does: effort, then surrender.',
  },
  {
    src: scubaDiving,
    label: 'The Diver',
    title: 'At home in the weightless deep.',
    body: 'Underwater, breath becomes everything; slow it down and the whole world slows with you. Diving is the closest the body comes to meditation: suspended, silent, and acutely awake to a realm that runs on entirely different rules.',
  },
  {
    src: lakeRainier,
    label: 'The Free Spirit',
    title: 'Arms open to whatever the day offers.',
    body: 'Some moments don’t need a meaning. Floating beneath a mountain on a still afternoon, I’m reminded that joy is mostly a matter of paying attention, of letting the present be enough, exactly as it is.',
  },
  {
    src: iceCave,
    label: 'The Adventurer',
    title: 'Walking into places that humble me.',
    body: 'Inside a glacier, time feels geological and you feel briefly, gratefully small. I chase these encounters with awe on purpose; they’re the fastest way I know to dissolve the sense of being the center of anything.',
  },
  {
    src: forestMeditation,
    label: 'The Meditator',
    title: 'Coming back, again and again, to stillness.',
    body: 'Beneath all the motion and the miles, this is the center of gravity. A log, a forest, a few unhurried breaths: the same practice I carry everywhere, and the lens through which I’ve come to see the rest of my life.',
  },
  {
    src: lavaCave,
    label: 'The Explorer',
    title: 'Endlessly curious about what’s around the next bend.',
    body: 'Caves, code, consciousness: they scratch the same itch. I’m happiest at the edge of the known, headlamp on, following a question into the dark just to see where it goes.',
  },
]

const timeline = [
  {
    year: 'Now',
    text: 'Developing software by day, sitting in meditation by dawn, and writing about where the two meet.',
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
            A developer learning to{' '}
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
              I&rsquo;m Adit Patil. By trade I build software: systems, logic,
              the satisfying click of a problem solved. But the thread running
              through my life isn&rsquo;t really code. It&rsquo;s attention:
              where it goes, what it&rsquo;s made of, and what happens when it
              turns back on itself.
            </p>
            <p>
              Meditation started as a way to quiet a busy head. It became
              something stranger and more interesting: a direct, first-person
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
            from home: under the sea, inside a glacier, or on a ridge at first
            light. Travel is just meditation with the eyes open: the same act of
            paying full attention to a world that&rsquo;s always larger than I
            expected.
          </p>
        </Reveal>

        <div className="mt-16 space-y-20 sm:space-y-28">
          {aspects.map((a, i) => {
            const imageRight = i % 2 === 1
            return (
              <div
                key={a.label}
                className="grid items-center gap-8 sm:grid-cols-2 sm:gap-12"
              >
                {/* Image */}
                <motion.figure
                  initial={{ opacity: 0, x: imageRight ? 40 : -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className={`group relative overflow-hidden rounded-3xl border border-white/8 ${
                    imageRight ? 'sm:order-2' : ''
                  }`}
                >
                  {/* Aura glow */}
                  <div className="absolute -inset-1 -z-10 bg-gradient-to-br from-dawn-400/20 via-aura-400/20 to-sky-soft/10 blur-xl" />
                  <img
                    src={a.src}
                    alt={a.label}
                    loading="lazy"
                    className="h-full max-h-[28rem] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                </motion.figure>

                {/* Text */}
                <motion.div
                  initial={{ opacity: 0, x: imageRight ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{
                    duration: 0.8,
                    delay: 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={imageRight ? 'sm:order-1' : ''}
                >
                  <p className="text-xs tracking-[0.3em] text-aura-300 uppercase">
                    {a.label}
                  </p>
                  <h3 className="mt-3 font-display text-2xl leading-snug font-light text-mist-100 sm:text-3xl">
                    {a.title}
                  </h3>
                  <p className="mt-4 leading-relaxed text-mist-300">{a.body}</p>
                </motion.div>
              </div>
            )
          })}
        </div>
      </section>
    </PageTransition>
  )
}

export default About
