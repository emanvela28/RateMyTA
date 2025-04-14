import { prisma } from '@/lib/prisma'
import NavButtons from '@/components/NavButtons'
import { type Metadata } from 'next'

type PageProps = {
  params: { id: string }
}

export default async function ReviewDetailPage({ params }: PageProps) {
  const reviewId = Number(params.id)

  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    include: { ta: { include: { school: true } } },
  })

  if (!review) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Review not found.</p>
      </main>
    )
  }

  const { ta, ta: { school } } = review

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-xl p-6 space-y-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">{ta.name}</h1>
        <p className="text-gray-600 mb-2">{ta.department}</p>
        <p className="text-sm text-gray-500">
          {school.name} ({school.location})
        </p>

        <hr className="my-4" />

        <div className="space-y-2">
          <p><strong>Course Code:</strong> {review.courseCode}</p>
          <p><strong>Rating:</strong> {review.rating}/5</p>
          <p><strong>Difficulty:</strong> {review.difficulty}/5</p>
          <p><strong>Take Again:</strong> {review.takeAgain ? 'Yes' : 'No'}</p>
          <p><strong>For Credit:</strong> {review.forCredit ? 'Yes' : 'No'}</p>
          <p><strong>Used Textbook:</strong> {review.usedTextbook ? 'Yes' : 'No'}</p>
          <p><strong>Attendance Mandatory:</strong> {review.attendance ? 'Yes' : 'No'}</p>
          <p><strong>Grade Received:</strong> {review.grade}</p>

          <p><strong>Tags:</strong> {
            JSON.parse(review.tags || '[]').join(', ') || 'None'
          }</p>

          <div>
            <p className="font-semibold">Comment:</p>
            <p className="italic text-gray-700">{review.comment}</p>
          </div>
        </div>
        <NavButtons schoolId={ta.schoolId} taId={ta.id} />
      </div>
    </main>
  )
}
