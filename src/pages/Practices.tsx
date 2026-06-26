import PageTransition from '../components/PageTransition'
import Reveal from '../components/Reveal'
import BreathingTimer from '../components/BreathingTimer'

const resources = [
  {
    title: 'Begin with the breath',
    body: 'No app, no posture rules. Sit, follow ten breaths, lose count, start again. The losing and returning is the practice.',
  },
  {
    title: 'Body scan',
    body: 'Move attention slowly from the crown of the head to the soles of the feet, dissolving the boundary between “sensation” and “self”.',
  },
  {
    title: 'Open awareness',
    body: 'Drop the object entirely. Let sounds, thoughts, and feelings arise and pass without managing any of them. Rest as the knowing itself.',
  },
  {
    title: 'Self-inquiry',
    body: 'Ask quietly, “Who is aware right now?” Don’t answer with words — turn attention back toward its own source and wait.',
  },
]

function Practices() {
  return (
    <PageTransition>
      <section className="mx-auto max-w-3xl px-6 pt-32 pb-16">
        <Reveal>
          <p className="text-sm tracking-[0.3em] text-mist-500 uppercase">
            Practices
          </p>
          <h1 className="mt-4 font-display text-4xl leading-tight font-light sm:text-5xl">
            Sit with me for{' '}
            <span className="text-aurora">a few breaths.</span>
          </h1>
          <p className="mt-6 max-w-xl text-mist-300">
            The mind settles fastest through the body. Choose a rhythm below and
            let the orb pace your breathing — in as it grows, out as it shrinks.
          </p>
        </Reveal>
      </section>

      {/* Breathing tool */}
      <Reveal>
        <section className="mx-auto max-w-3xl px-6 pb-24">
          <div className="rounded-3xl border border-white/8 bg-night-800 px-6 py-14 backdrop-blur-sm">
            <BreathingTimer />
          </div>
        </section>
      </Reveal>

      {/* Resource list */}
      <section className="mx-auto max-w-3xl px-6 pb-32">
        <Reveal>
          <h2 className="font-display text-2xl font-light text-mist-100">
            Ways in
          </h2>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {resources.map((r, i) => (
            <Reveal key={r.title} delay={i * 0.08}>
              <div className="h-full rounded-2xl border border-white/8 bg-night-800 p-6 transition-colors hover:border-aura-400/30">
                <h3 className="font-display text-lg text-mist-100">
                  {r.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-mist-500">
                  {r.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </PageTransition>
  )
}

export default Practices
