import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  // 1. Find all reports targeting a TA
  const reports = await prisma.report.findMany({
    where: { targetType: "TA" },
  });

  const taIds = reports.map((report) => report.targetId);

  // 2. Find the TAs matching those IDs
  const tas = await prisma.tA.findMany({
    where: { id: { in: taIds } },
    include: {
      school: {
        select: { name: true },
      },
    },
  });

  // 3. Merge the reports and TAs, but filter out deleted TAs
  const reportedTAs = reports
    .map((report) => {
      const ta = tas.find((t) => t.id === report.targetId);
      if (!ta) return null; // TA no longer exists — skip it

      return {
        reportId: report.id,
        taId: report.targetId,
        taName: ta.name,
        schoolName: ta.school?.name || "(Unknown)",
        reason: report.reason,
        createdAt: report.createdAt,
      };
    })
    .filter((r) => r !== null); // remove null entries


  return NextResponse.json(reportedTAs);
}
