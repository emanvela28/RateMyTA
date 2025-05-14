'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import UserMenu from './UserMenu'

export default function Navbar() {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      setQuery('')
    }
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-5 flex items-center justify-between relative">
        {/* Left: Logo */}
        <div className="flex-shrink-0">
          <Link href="/" className="text-xl font-bold text-blue-600">
            RateMyTA
          </Link>
        </div>

        {/* Center: Search */}
        <form
          onSubmit={handleSearch}
          className="absolute left-1/2 transform -translate-x-1/2 flex space-x-2"
        >
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

        {/* Right: Navigation */}
        <nav className="flex items-center space-x-6 text-sm font-medium text-gray-700">
          <Link href="/reviews" className="font-medium hover:underline">
            Reviews
          </Link>
          <Link href="/about" className="hover:text-blue-600 transition">
            About
          </Link>
          <UserMenu />
        </nav>
      </div>
    </header>
  )
}
