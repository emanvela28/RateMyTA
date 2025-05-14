import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth"; // your next-auth options file

export async function secureAdminRoute() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.email !== "avelazquez48@ucmerced.edu") {
    throw new Error("Unauthorized");
  }
}
