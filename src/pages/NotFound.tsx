import { Link } from 'react-router-dom'
import PageTransition from '../components/PageTransition'

function NotFound() {
  return (
    <PageTransition>
      <section className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 text-center">
        <p className="font-display text-6xl text-aurora">404</p>
        <h1 className="mt-4 font-display text-2xl text-mist-100">
          This path leads into the silence.
        </h1>
        <p className="mt-3 text-mist-500">
          The page you&rsquo;re looking for isn&rsquo;t here, or perhaps was
          never meant to be found.
        </p>
        <Link
          to="/"
          className="mt-8 rounded-full border border-white/15 px-7 py-3 text-sm text-mist-100 transition-colors hover:border-aura-400/60"
        >
          Return home
        </Link>
      </section>
    </PageTransition>
  )
}

export default NotFound
