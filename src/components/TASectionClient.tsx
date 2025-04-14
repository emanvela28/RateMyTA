'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type TA = {
  id: number
  name: string
  department: string
}

export default function TASectionClient({
  schoolId,
  tas,
}: {
  schoolId: number
  tas: TA[]
}) {
  const [search, setSearch] = useState('')
  const [filtered, setFiltered] = useState<TA[]>(tas)
  const router = useRouter()

  useEffect(() => {
    const lower = search.toLowerCase()
    const matches = tas.filter((ta) => ta.name.toLowerCase().includes(lower))
    setFiltered(matches)
  }, [search, tas])

  return (
    <div className="mt-10 space-y-6">
      <div className="text-left">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Search TAs</h2>
        <input
          type="text"
          placeholder="Search for a TA..."
          className="w-full py-3 px-4 text-md rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filtered.length > 0 ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {filtered.map((ta) => (
            <li key={ta.id}>
              <Link href={`/tas/${ta.id}`}>
                <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-blue-500 transition-all cursor-pointer bg-white">
                  <h3 className="text-lg font-bold text-gray-900">{ta.name}</h3>
                  <p className="text-sm text-gray-600">{ta.department}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center mt-4 text-gray-600">
          <p>No matching TA found.</p>
          <button
            onClick={() => router.push(`/schools/${schoolId}/new-ta`)}
            className="mt-4 inline-block bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Add TA & Leave Review
          </button>
        </div>
      )}
    </div>
  )
}
