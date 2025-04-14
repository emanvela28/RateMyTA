import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import NavButtons from '@/components/NavButtons'
import ReviewList from '@/components/ReviewList'


type Props = {
  params: { id: string }
}

export default async function TAPage({ params }: Props) {
  const taId = Number(params.id)

  const ta = await prisma.tA.findUnique({
    where: { id: taId },
    include: {
      school: true,
      reviews: true,
    },
  })


  if (!ta) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">TA not found.</p>
      </main>
    )
  }

  const reviewCount = ta.reviews.length
  const averageRating = reviewCount
    ? (ta.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount).toFixed(1)
    : 'N/A'
  const averageDifficulty = reviewCount
    ? (ta.reviews.reduce((sum, r) => sum + r.difficulty, 0) / reviewCount).toFixed(1)
    : 'N/A'
    const wouldTakeAgainCount = ta.reviews.filter(
      (r) => r.takeAgain === true
    ).length
    
    const wouldTakeAgainPercent =
      reviewCount > 0 ? Math.round((wouldTakeAgainCount / reviewCount) * 100) : 'N/A'
    

  // For filtering (in a real app you'd store selected filter in state)
  const courseCodes = [...new Set(ta.reviews.map((r) => r.courseCode))]

  // Rating distribution (1–5)
  const ratingDist = [1, 2, 3, 4, 5].map((score) => ({
    score,
    count: ta.reviews.filter((r) => r.rating === score).length,
  }))

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-8 space-y-6">
        {/* TA Info */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{ta.name}</h1>
          <p className="text-gray-600">{ta.department}</p>
          <p className="text-sm text-gray-500 mb-4">
            Teaching at: {ta.school.name} ({ta.school.location})
          </p>

          <Link
            href={`/tas/${ta.id}/review`}
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Leave a Review
          </Link>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-4 text-center text-gray-700">
          <div>
            <p className="text-2xl font-bold">{averageRating}</p>
            <p className="text-sm">Average Rating</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{averageDifficulty}</p>
            <p className="text-sm">Avg. Difficulty</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{wouldTakeAgainPercent}%</p>
            <p className="text-sm">Would Take Again</p>
          </div>
        </div>

        {/* Rating Distribution */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Rating Distribution</h3>
          <div className="space-y-1">
            {ratingDist.reverse().map((r) => (
              <div key={r.score} className="flex items-center">
                <span className="w-12 text-sm">{r.score}★</span>
                <div className="w-full bg-gray-200 h-3 rounded">
                  <div
                    className="bg-blue-600 h-3 rounded"
                    style={{
                      width: `${(r.count / reviewCount) * 100 || 0}%`,
                    }}
                  ></div>
                </div>
                <span className="ml-2 text-sm text-gray-500">{r.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <ReviewList reviews={ta.reviews} courseCodes={courseCodes} />

        <NavButtons taId={ta.id} schoolId={ta.schoolId} />
      </div>
    </main>
  )
}
