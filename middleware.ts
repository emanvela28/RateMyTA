import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  console.log('✅ middleware is running:', req.nextUrl.pathname)

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  const isProtectedReviewRoute = req.nextUrl.pathname.startsWith('/api/reviews')

  if (!token && isProtectedReviewRoute && req.method === 'POST') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/reviews'], // Only run on /api/reviews
}
