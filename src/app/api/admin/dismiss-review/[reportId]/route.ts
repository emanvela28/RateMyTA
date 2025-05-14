import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { secureAdminRoute } from "@/lib/secureAdmin";

export async function DELETE(
  request: Request,
  context: { params: { reportId: string } }
) {
  await secureAdminRoute();

  const { reportId } = await context.params;

  try {
    await prisma.report.delete({
      where: {
        id: Number(reportId),
      },
    });
    return NextResponse.json({ message: "Review report dismissed" });
  } catch (error) {
    console.error(error); // (optional) better debugging
    return NextResponse.json({ error: "Failed to dismiss review report" }, { status: 500 });
  }
}
