'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import ReviewForm from '@/components/ReviewForm'
import NavButtons from '@/components/NavButtons'

export default function ReviewPage() {
  const params = useParams()
  const taId = Number(params.id)
  const [schoolId, setSchoolId] = useState<number | null>(null)

  const { data: session, status } = useSession()
  const userEmail = session?.user?.email

  useEffect(() => {
    fetch(`/api/tas/${taId}`)
      .then(res => res.json())
      .then(data => setSchoolId(data.schoolId))
      .catch(err => console.error('Failed to load TA info:', err))
  }, [taId])

  if (status === 'loading') {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 text-lg">Loading...</p>
      </main>
    )
  }

  if (!session || !userEmail) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white border shadow-lg rounded-xl p-8 max-w-md w-full text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            You must be signed in to leave a review.
          </h2>
          <p className="text-gray-600 mb-6">
            Please log in using your school email to continue.
          </p>
          <a
            href="/api/auth/signin"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Log In
          </a>
          {schoolId !== null && (
            <div className="mt-6">
              <NavButtons taId={taId} schoolId={schoolId} />
            </div>
          )}
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-xl p-8 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Leave a Review</h1>

        <ReviewForm taId={taId} />

        {schoolId !== null && (
          <NavButtons taId={taId} schoolId={schoolId} />
        )}
      </div>
    </main>
  )
}
