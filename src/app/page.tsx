'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type School = {
  id: number
  name: string
  location: string
}

export default function HomePage() {
  const [schools, setSchools] = useState<School[]>([])
  const [search, setSearch] = useState('')
  const [filtered, setFiltered] = useState<School[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/schools')
      .then((res) => res.json())
      .then((data) => setSchools(data))
  }, [])

  useEffect(() => {
    const lower = search.toLowerCase()
    const matches = schools
      .filter((s) => s.name.toLowerCase().includes(lower))
      .slice(0, 5)
    setFiltered(matches)
  }, [search, schools])

  const handleSelect = (id: number) => {
    setIsLoading(true)
    setTimeout(() => {
      router.push(`/schools/${id}`)
    }, 100) // small delay (100ms) lets React show the loading UI
  }
  

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#eef3fb] to-[#dee9f8] flex items-center justify-center px-4 relative">
      <div className="w-full max-w-xl text-center space-y-6">
        <div>
          <h1 className="text-5xl font-extrabold text-gray-900">RateMyTA</h1>
          <p className="text-lg text-gray-700 mt-2">
            Choose your school, find your TA, and help students everywhere.
          </p>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Search for your school..."
            className="w-full py-4 px-6 text-lg rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {search.length > 0 && (
            <ul className="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-lg overflow-hidden z-10">
              {filtered.map((school) => (
                <li
                  key={school.id}
                  onClick={() => handleSelect(school.id)}
                  className="px-5 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-none"
                >
                  <p className="text-base font-semibold text-gray-800">{school.name}</p>
                  <p className="text-sm text-gray-500">{school.location}</p>
                </li>
              ))}
              {filtered.length === 0 && (
                <li className="px-4 py-2 text-gray-500">No schools found.</li>
              )}
            </ul>
          )}
        </div>
      </div>

      {/* ✅ Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
          <img
            src="/pencil.gif" // Make sure this exists in /public
            alt="Loading..."
            className="w-16 h-16"
          />
        </div>
      )}
    </main>
  )
}
