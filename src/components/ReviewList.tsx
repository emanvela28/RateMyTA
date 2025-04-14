'use client'

import { useState } from 'react'
import LinkWithLoading from '@/components/LinkWithLoading' // ✅ Import it

type Review = {
  id: number
  rating: number
  difficulty: number
  comment: string
  courseCode: string
}

type Props = {
  reviews: Review[]
  courseCodes: string[]
}

export default function ReviewList({ reviews, courseCodes }: Props) {
  const [selectedCourse, setSelectedCourse] = useState('')

  const filteredReviews = selectedCourse
    ? reviews.filter((r) => r.courseCode === selectedCourse)
    : reviews

  return (
    <div>
      {courseCodes.length > 1 && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Course
          </label>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          >
            <option value="">All Courses</option>
            {courseCodes.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
        </div>
      )}

      {filteredReviews.length === 0 ? (
        <p className="text-gray-500 italic">No reviews for this course.</p>
      ) : (
        <ul className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
          {filteredReviews.map((review) => (
            <li key={review.id}>
              <LinkWithLoading href={`/review/${review.id}`}>
                <div className="bg-gray-100 rounded-md p-4 hover:bg-gray-200 transition cursor-pointer">
                  <p className="text-gray-800 font-semibold">
                    Rating: {review.rating}/5 – Difficulty: {review.difficulty}/5
                  </p>
                  <p className="text-gray-600 italic mb-1">{review.comment}</p>
                  <p className="text-sm text-gray-500">Course: {review.courseCode}</p>
                </div>
              </LinkWithLoading>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
