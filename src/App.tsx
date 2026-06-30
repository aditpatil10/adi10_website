import { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Route, Routes, useLocation } from 'react-router-dom'
import Background from './components/Background'
import Loader from './components/Loader'
import Nav from './components/Nav'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import About from './pages/About'
import Writings from './pages/Writings'
import WritingPost from './pages/WritingPost'
import Practices from './pages/Practices'
import NotFound from './pages/NotFound'

function App() {
  const location = useLocation()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Keep the loader up for a calm minimum, but never past a hard cap, and
    // release as soon as the window (incl. hero image) has finished loading.
    const minBreath = new Promise((res) => setTimeout(res, 1900))
    const windowLoaded =
      document.readyState === 'complete'
        ? Promise.resolve()
        : new Promise((res) => window.addEventListener('load', res, { once: true }))
    const safetyCap = new Promise((res) => setTimeout(res, 4000))

    let active = true
    Promise.race([Promise.all([minBreath, windowLoaded]), safetyCap]).then(() => {
      if (active) setLoading(false)
    })
    return () => {
      active = false
    }
  }, [])

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-clip">
      <AnimatePresence>{loading && <Loader />}</AnimatePresence>
      <Background />
      <ScrollToTop />
      <Nav />

      <main className="relative z-10 flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/writings" element={<Writings />} />
            <Route path="/writings/:slug" element={<WritingPost />} />
            <Route path="/practices" element={<Practices />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  )
}

export default App
