import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const acceptedTAs = await prisma.tA.findMany({
    where: { pending: false },
    include: { school: true },
  });
  return NextResponse.json(acceptedTAs);
}
