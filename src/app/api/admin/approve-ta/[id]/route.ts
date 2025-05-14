import { prisma } from "@/lib/prisma";
import { secureAdminRoute } from "@/lib/secureAdmin"; // ✅ just import it here
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  context: { params: { id: string } }
) {
  await secureAdminRoute(); // ✅ protect the route

  const { id } = await context.params;

  try {
    await prisma.tA.update({
      where: { id: Number(id) },
      data: { pending: false },
    });
    return NextResponse.json({ message: "TA approved" });
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
