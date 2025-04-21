'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'

export default function SignInPage() {
  const [email, setEmail] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    await signIn('email', {
      email,
      callbackUrl: '/',
      redirect: true,
    })
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl space-y-6 text-center">
        <h1 className="text-3xl font-bold text-blue-600">📩 Login to RateMyTA</h1>
        <p className="text-gray-600">
          Enter your <span className="font-medium">school email</span> and we’ll send you a magic login link.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="yourname@school.edu"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition"
          >
            Send Magic Link
          </button>
        </form>

        <p className="text-xs text-gray-400">
          We’ll never share your email. You must use a verified school address.
        </p>
      </div>
    </main>
  )
}
