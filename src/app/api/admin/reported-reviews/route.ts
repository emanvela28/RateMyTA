import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  // 1. Find all reports targeting a Review
  const reports = await prisma.report.findMany({
    where: { targetType: "Review" },
  });

  const reviewIds = reports.map((report) => report.targetId);

  // 2. Find the reviews matching those IDs
  const reviews = await prisma.review.findMany({
    where: { id: { in: reviewIds } },
    include: {
      ta: {
        select: {
          name: true,
          school: {
            select: { name: true },
          },
        },
      },
    },
  });

  // 3. Merge the reports and reviews
  const reportedReviews = reviews.map((review) => {
    const matchingReport = reports.find((r) => r.targetId === review.id);
    return {
      reportId: matchingReport?.id,
      reviewId: review.id,
      comment: review.comment,
      courseCode: review.courseCode,
      taName: review.ta?.name,
      schoolName: review.ta?.school?.name,
      reason: matchingReport?.reason,
      createdAt: matchingReport?.createdAt,
    };
  });

  return NextResponse.json(reportedReviews);
}
