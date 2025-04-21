'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import ReviewForm from '@/components/ReviewForm'
import NavButtons from '@/components/NavButtons'

export default function ReviewPage() {
  const params = useParams();
  const taId = Number(params.id);
  const [schoolId, setSchoolId] = useState<number | null>(null)

  useEffect(() => {
    fetch(`/api/tas/${taId}`)
      .then(res => res.json())
      .then(data => setSchoolId(data.schoolId))
      .catch(err => console.error('Failed to load TA info:', err))
  }, [taId])

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
