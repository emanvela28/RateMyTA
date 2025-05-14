import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { secureAdminRoute } from "@/lib/secureAdmin";

export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  await secureAdminRoute(); // ✅ First, secure the route

  const { id } = await context.params; // ✅ Await params!

  try {
    await prisma.tA.delete({
      where: { id: Number(id) },
    });
    return NextResponse.json({ message: "TA rejected and deleted" });
  } catch (error) {
    console.error(error); // ✅ Good practice: log server errors
    return NextResponse.json({ error: "Failed to reject TA" }, { status: 500 });
  }
}
