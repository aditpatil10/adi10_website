import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** Reset scroll position to the top whenever the route changes. */
function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname])

  return null
}

export default ScrollToTop
