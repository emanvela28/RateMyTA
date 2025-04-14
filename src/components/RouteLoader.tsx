'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useLoading } from './LoadingContext'

export default function RouteLoader() {
  const pathname = usePathname()
  const { loading, setLoading } = useLoading()

  useEffect(() => {
    setLoading(true)

    const timeout = setTimeout(() => {
      setLoading(false)
    }, 500) // show spinner for 500ms, tweak as needed

    return () => clearTimeout(timeout)
  }, [pathname])

  if (!loading) return null

  return (
    <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
      <img src="/pencil.gif" alt="Loading..." className="w-16 h-16" />
    </div>
  )
}
