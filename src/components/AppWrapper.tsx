'use client'

import { SessionProvider } from 'next-auth/react'
import { LoadingProvider, useLoading } from './LoadingContext'

export default function AppWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <LoadingProvider>
        <LoadingOverlay />
        {children}
      </LoadingProvider>
    </SessionProvider>
  )
}

function LoadingOverlay() {
  const { loading } = useLoading()

  if (!loading) return null

  return (
    <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
      <img src="/pencil.gif" alt="Loading..." className="w-16 h-16" />
    </div>
  )
}
