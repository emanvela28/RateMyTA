import ReviewForm from '@/components/ReviewForm'
import NavButtons from '@/components/NavButtons'

export default function ReviewPage({ params }: { params: { id: string } }) {
  const taId = Number(params.id)

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-xl p-8 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Leave a Review</h1>

        <ReviewForm taId={taId} />

        {/* ✅ Works with just TA ID */}
        <NavButtons taId={taId} />
      </div>
    </main>
  )
}
