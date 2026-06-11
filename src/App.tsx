import background from './assets/background.jpg'

function App() {
  return (
    <main
      className="relative flex min-h-full flex-col items-center justify-start bg-slate-900 bg-cover bg-center px-6 pt-16 text-center text-slate-100 sm:pt-24"
      style={{ backgroundImage: `url(${background})` }}
    >
      {/* Dark overlay to keep the text readable over the photo */}
      <div className="absolute inset-0 bg-slate-950/60" />

      <div className="relative z-10 max-w-2xl">
        <h1 className="text-5xl font-bold tracking-tight drop-shadow-lg sm:text-7xl">
          Coming Soon
          <span className="ml-1 inline-block size-3 animate-pulse rounded-full bg-sky-400 align-middle" />
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-slate-200 drop-shadow sm:text-xl">
          We&rsquo;re building something great. Check back shortly.
        </p>
      </div>
    </main>
  )
}

export default App
