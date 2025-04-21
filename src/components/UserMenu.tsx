'use client'

import { useSession, signIn, signOut } from 'next-auth/react'

export default function UserMenu() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <span className="text-sm text-gray-400">Loading...</span>
  }

  if (!session) {
    return (
      <button
        onClick={() => signIn()}
        className="bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm font-medium hover:bg-blue-700 transition"
      >
        Log In
      </button>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-700 font-medium hidden md:inline">
        {session.user?.email}
      </span>
      <button
        onClick={() => signOut()}
        className="bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm font-medium hover:bg-blue-700 transition"
      >
        Log Out
      </button>
    </div>
  )
}
