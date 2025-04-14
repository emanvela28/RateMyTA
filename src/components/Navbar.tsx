'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
  
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      setQuery('') // ✅ clear the input after navigating
    }
  }
  

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-blue-600">
          RateMyTA
        </Link>

        <form onSubmit={handleSearch} className="flex space-x-2">
          <input
            type="text"
            placeholder="Search schools or TAs"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm w-64"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-3 py-2 rounded-md text-sm hover:bg-blue-700"
          >
            Search
          </button>
        </form>

        <nav className="space-x-4 text-gray-700">
          <Link href="/schools" className="hover:text-blue-600 transition">
            Schools
          </Link>
          <Link href="/about" className="hover:text-blue-600 transition">
            About
          </Link>
          <Link href="/login" className="text-blue-600 hover:underline">
            Log in
          </Link>
        </nav>
      </div>
    </header>
  )
}
