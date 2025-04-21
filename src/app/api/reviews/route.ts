import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth' // ✅ proper location
import { getServerSession } from 'next-auth'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  // 🛑 Block unauthenticated users
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const {
      taId,
      rating,
      difficulty,
      comment,
      courseCode,
      grade,
      takeAgain,
      forCredit,
      usedTextbook,
      attendance,
      tags,
    } = body

    // 🧪 Basic validation
    if (
      !taId ||
      !rating ||
      !difficulty ||
      !comment ||
      !courseCode ||
      !grade ||
      typeof takeAgain !== 'string' ||
      typeof forCredit !== 'string' ||
      typeof usedTextbook !== 'string' ||
      typeof attendance !== 'string' ||
      !Array.isArray(tags)
    ) {
      return NextResponse.json({ error: 'Missing or invalid fields' }, { status: 400 })
    }

    // ✅ Lookup user from session
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 403 })
    }

    // 🔄 Convert "Yes"/"No" to boolean
    const parseBool = (val: string) => val.toLowerCase() === 'yes'

    const review = await prisma.review.create({
      data: {
        taId: Number(taId),
        userId: user.id, // ✅ link review to user
        rating: Number(rating),
        difficulty: Number(difficulty),
        comment,
        courseCode,
        grade,
        takeAgain: parseBool(takeAgain),
        forCredit: parseBool(forCredit),
        usedTextbook: parseBool(usedTextbook),
        attendance: parseBool(attendance),
        tags: tags.join(','), // ← make sure you're storing as a string
      },
    })

    return NextResponse.json({ success: true, review }, { status: 201 })
  } catch (error) {
    console.error('Review submission error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
