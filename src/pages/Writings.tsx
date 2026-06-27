import { Link } from 'react-router-dom'
import PageTransition from '../components/PageTransition'
import Reveal from '../components/Reveal'
import { posts, formatDate } from '../content/posts'

function Writings() {
  return (
    <PageTransition>
      <section className="mx-auto max-w-3xl px-6 pt-32 pb-24">
        <Reveal>
          <p className="text-sm tracking-[0.3em] text-mist-500 uppercase">
            Writings
          </p>
          <h1 className="mt-4 font-display text-4xl leading-tight font-light sm:text-5xl">
            Notes from the{' '}
            <span className="text-aurora">inner exploration.</span>
          </h1>
          <p className="mt-6 max-w-xl text-mist-300">
            Slow, unhurried essays on meditation, consciousness, and the
            overlap between a contemplative life and a developer&rsquo;s one.
          </p>
        </Reveal>

        <div className="mt-14 space-y-px">
          {posts.map((post, i) => (
            <Reveal key={post.slug} delay={i * 0.08}>
              <Link
                to={`/writings/${post.slug}`}
                className="group block border-t border-white/8 py-8 transition-colors hover:bg-white/[0.02]"
              >
                <div className="flex items-center gap-3 text-xs tracking-wide text-mist-500">
                  <span>{formatDate(post.date)}</span>
                  <span className="h-1 w-1 rounded-full bg-mist-500" />
                  <span>{post.readingTime}</span>
                </div>
                <h2 className="mt-2 font-display text-2xl text-mist-100 transition-colors group-hover:text-aura-300">
                  {post.title}
                </h2>
                <p className="mt-2 leading-relaxed text-mist-500">
                  {post.excerpt}
                </p>
                <span className="mt-3 inline-block text-sm text-aura-300 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
                  Read →
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </PageTransition>
  )
}

export default Writings
