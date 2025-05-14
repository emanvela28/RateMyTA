import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { secureAdminRoute } from "@/lib/secureAdmin";


export async function DELETE(
  request: Request,
  { params }: { params: { reviewId: string } }
) {
  const { reviewId } = params;
  await secureAdminRoute();


  try {
    await prisma.review.delete({
      where: {
        id: Number(reviewId),
      },
    });
    return NextResponse.json({ message: "Review deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
  }
}
