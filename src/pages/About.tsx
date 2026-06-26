import PageTransition from '../components/PageTransition'
import Reveal from '../components/Reveal'

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

        <Reveal delay={0.1}>
          <div className="mt-10 space-y-6 text-lg leading-relaxed text-mist-300">
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
    </PageTransition>
  )
}

export default About
