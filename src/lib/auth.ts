// /src/lib/auth.ts

import { PrismaAdapter } from '@next-auth/prisma-adapter'
import EmailProvider from 'next-auth/providers/email'
import { prisma } from './prisma'
import type { NextAuthOptions } from 'next-auth'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
  ],

  pages: {
    signIn: '/auth/signin',
    verifyRequest: '/auth/verify-request',
    error: '/auth/error',
  },

  callbacks: {
    async signIn({ user }) {
      try {
        const email = user.email ?? ''
        const domain = email.split('@')[1]

        const school = await prisma.school.findFirst({
          where: { domain },
        })

        if (!school) {
          console.warn(`Unauthorized domain: ${domain}`)
          return false
        }

        // Associate user with a school if not yet linked
        await prisma.user.updateMany({
          where: {
            email,
            schoolId: null,
          },
          data: {
            schoolId: school.id,
          },
        })

        return true
      } catch (err) {
        console.error('❌ signIn callback error:', err)
        return false
      }
    },

    async session({ session }) {
      // Optionally add schoolId to session.user
      if (session.user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email },
          select: { id: true, schoolId: true },
        })

        if (dbUser) {
          session.user.id = dbUser.id
          session.user.schoolId = dbUser.schoolId
        }
      }

      return session
    },
  },

  session: {
    strategy: 'jwt',
  },
}
