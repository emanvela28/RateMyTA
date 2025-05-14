import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { secureAdminRoute } from "@/lib/secureAdmin";

export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  await secureAdminRoute();

  const { id } = await context.params;

  try {
    await prisma.tA.delete({
      where: { id: Number(id) },
    });
    return NextResponse.json({ message: "TA deleted" });
  } catch (error) {
    console.error(error); // (optional) always nice to log server-side errors
    return NextResponse.json({ error: "Failed to delete TA" }, { status: 500 });
  }
}
