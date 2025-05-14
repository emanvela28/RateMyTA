'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LinkWithSpinner({ href, label }: { href: string; label: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleClick = () => {
    setLoading(true)
    router.push(href)
  }

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      {loading ? (
        <svg
          className="animate-spin h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
      ) : (
        label
      )}
    </button>
  )
}
