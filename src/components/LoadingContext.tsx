'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

const LoadingContext = createContext<{
  loading: boolean
  setLoading: (value: boolean) => void
}>({
  loading: false,
  setLoading: () => {},
})

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    // Set loading true on path change
    setLoading(true)

    // Failsafe: stop loading after 3s
    const timeout = setTimeout(() => {
      setLoading(false)
      console.warn('[LoadingProvider] Timeout fallback triggered — forcing loading=false')
    }, 3000)

    // Simulate loading done (you can also remove this and let LinkWithLoading control it manually)
    const finish = setTimeout(() => {
      setLoading(false)
    }, 500)

    return () => {
      clearTimeout(timeout)
      clearTimeout(finish)
    }
  }, [pathname])

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {children}
    </LoadingContext.Provider>
  )
}

export const useLoading = () => useContext(LoadingContext)
