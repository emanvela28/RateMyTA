import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import NavButtons from '@/components/NavButtons';
import ReviewList from '@/components/ReviewList';
import type { TA, Review, School } from '@prisma/client';
import ReportButton from '@/components/ReportButton';

type FullTA = {
  id: number;
  name: string;
  department: string;
  pending: boolean;
  schoolId: number;
  school: School;
  reviews: Review[];
};

type Props = {
  params: { id: string };
};

export default async function TAPage({ params }: Props) {
  const { id } = await params;
  const taId = Number(id);

  const ta = (await prisma.tA.findUnique({
    where: { id: taId },
    include: {
      school: true,
      reviews: true,
    },
  })) as FullTA;

  if (!ta || ta.pending) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gray-50">
        <div className="bg-white shadow-md rounded-xl p-8 max-w-md text-center space-y-4">
          <h1 className="text-2xl font-bold text-gray-800">
            This TA profile is pending approval.
          </h1>
          <p className="text-gray-600 text-sm">
            Once it's approved by an admin, the reviews and profile will be visible.
          </p>
          <div className="mt-6">
            <NavButtons schoolId={ta?.schoolId} />
          </div>
        </div>
      </main>
    );
  }

  const reviewCount = ta.reviews.length;
  const averageRating = reviewCount
    ? (ta.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount).toFixed(1)
    : 'N/A';
  const averageDifficulty = reviewCount
    ? (ta.reviews.reduce((sum, r) => sum + r.difficulty, 0) / reviewCount).toFixed(1)
    : 'N/A';
  const wouldTakeAgainCount = ta.reviews.filter((r) => r.takeAgain).length;
  const wouldTakeAgainPercent =
    reviewCount > 0 ? Math.round((wouldTakeAgainCount / reviewCount) * 100) : 'N/A';

  const courseCodes = [...new Set(ta.reviews.map((r) => r.courseCode))];

  const ratingDist = [1, 2, 3, 4, 5].map((score) => ({
    score,
    count: ta.reviews.filter((r) => r.rating === score).length,
  }));

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-8 space-y-6">
        {/* TA Info and Buttons */}
        <div className="flex justify-between items-start">
          <div className="space-y-2">
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

          <div className="flex justify-end">
            <ReportButton targetType="TA" targetId={taId} />
          </div>
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
                    style={{ width: `${(r.count / reviewCount) * 100 || 0}%` }}
                  />
                </div>
                <span className="ml-2 text-sm text-gray-500">{r.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <ReviewList reviews={ta.reviews} courseCodes={courseCodes} />

        {/* Navigation Buttons */}
        <NavButtons taId={ta.id} schoolId={ta.schoolId} />
      </div>
    </main>
  );
}
