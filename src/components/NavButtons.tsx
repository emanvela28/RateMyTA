'use client'

import { useRouter } from 'next/navigation'

export default function NavButtons({ schoolId, taId }: { schoolId?: number; taId?: number }) {
  const router = useRouter()

  return (
    <div className="mt-8 flex flex-wrap gap-4 justify-center">
      <button
        onClick={() => router.push('/')}
        className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition"
      >
        🔙 Back to Home
      </button>

      {schoolId && (
        <button
          onClick={() => router.push(`/schools/${schoolId}`)}
          className="bg-blue-100 text-blue-700 px-4 py-2 rounded hover:bg-blue-200 transition"
        >
          🏫 View School Page
        </button>
      )}

      {taId && (
        <button
          onClick={() => router.push(`/tas/${taId}`)}
          className="bg-green-100 text-green-800 px-4 py-2 rounded hover:bg-green-200 transition"
        >
          👨‍🏫 View TA Page
        </button>
      )}
    </div>
  )
}
