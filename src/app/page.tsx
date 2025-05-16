'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'


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
    <main className="min-h-screen bg-gradient-to-b from-[#eef3fb] to-[#dee9f8] relative">
      {/* Full-screen background image */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/charles-deloye-2RouMSg9Rnw-unsplash.jpg')" }}
      />
    
      
      {/* Content container */}
      <div className="relative min-h-screen flex items-center justify-center px-4 py-16 z-10">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 max-w-xl w-full text-center shadow-lg">
          <h1 className="text-5xl font-extrabold text-gray-900">RateMyTA</h1>
          <p className="text-lg text-gray-700 mt-2">
            Choose your school, find your TA, and help students everywhere.
          </p>

          <input
            type="text"
            placeholder="Search for your school..."
            className="mt-6 w-full py-4 px-6 text-lg rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {search.length > 0 && (
            <ul className="mt-2 bg-white rounded-xl shadow-lg overflow-hidden z-10 text-left">
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
    </main>
  )
}