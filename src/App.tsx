import { AnimatePresence } from 'framer-motion'
import { Route, Routes, useLocation } from 'react-router-dom'
import Background from './components/Background'
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

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-clip">
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
