'use client'

import { useRouter } from 'next/navigation'

export default function NavButtons({ schoolId, taId }: { schoolId?: number; taId?: number }) {
  const router = useRouter()

  return (
    <div className="mt-6 flex flex-wrap gap-3 justify-center">
      <button
        onClick={() => router.push('/')}
        className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md shadow-sm hover:bg-gray-200 transition text-sm font-medium"
      >
        ← Back to Home
      </button>

      {schoolId && (
        <button
          onClick={() => router.push(`/schools/${schoolId}`)}
          className="bg-blue-100 text-blue-700 px-4 py-2 rounded-md shadow-sm hover:bg-blue-200 transition text-sm font-medium"
        >
          🏫 View School Page
        </button>
      )}

      {taId && (
        <button
          onClick={() => router.push(`/tas/${taId}`)}
          className="bg-green-100 text-green-800 px-4 py-2 rounded-md shadow-sm hover:bg-green-200 transition text-sm font-medium"
        >
          👨‍🏫 View TA Page
        </button>
      )}
    </div>
  )
}
