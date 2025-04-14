import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  const schoolId = Number(id)

  const body = await req.json()
  console.log('📦 Incoming request body:', body)

  const {
    name,
    department,
    rating,
    difficulty,
    comment,
    courseCode,
    takeAgain,
    forCredit,
    usedTextbook,
    attendance,
    grade,
    tags,
  } = body

  if (!schoolId || !name || !department || !courseCode || !comment) {
    console.log('❌ Missing required fields')
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  try {
    const newTA = await prisma.tA.create({
      data: {
        name,
        department,
        school: {
          connect: { id: schoolId },
        },
        reviews: {
          create: {
            rating: Number(rating),
            difficulty: Number(difficulty),
            comment,
            courseCode,
            takeAgain: takeAgain.toLowerCase() === 'yes',
            forCredit: forCredit.toLowerCase() === 'yes',
            usedTextbook: usedTextbook.toLowerCase() === 'yes',
            attendance: attendance.toLowerCase() === 'yes',
            grade,
            tags: JSON.stringify(tags),
          },
        },
      },
    })

    // ✅ Return full TA object so frontend can access `ta.id`
    return NextResponse.json({ success: true, ta: newTA }, { status: 201 })
  } catch (err) {
    console.error('🔥 Error creating TA and review:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
