import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      const email = user.email || "";
      const domain = email.split("@")[1];

      const school = await prisma.school.findFirst({
        where: { domain },
      });

      if (!school) {
        console.log("Unauthorized domain attempt:", domain);
        return false;
      }

      // Link user to school (only if not already set)
      await prisma.user.update({
        where: { email },
        data: {
          schoolId: school.id,
        },
      });

      return true;
    },
    async session({ session, user }) {
      session.user.id = user.id;
      session.user.schoolId = user.schoolId;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
