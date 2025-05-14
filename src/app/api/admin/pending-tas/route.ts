import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const pendingTAs = await prisma.tA.findMany({
    where: { pending: true },
    include: { school: true },
  });
  return NextResponse.json(pendingTAs);
}
