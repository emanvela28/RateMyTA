'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  let message = 'Something went wrong. Please try again.'

  if (error === 'Verification') {
    message = 'This sign-in link is no longer valid. It may have expired or already been used.'
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">⚠️ Sign-in Error</h1>
        <p className="text-gray-700 mb-4">{message}</p>
        <Link href="/auth/signin" className="text-blue-600 hover:underline">
          Return to Log in
        </Link>
      </div>
    </main>
  )
}
