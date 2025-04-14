import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      taId,
      studentName,
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

    // Validation
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

    // Convert string fields like "Yes"/"No" to booleans
    const parseBool = (val: string) => val.toLowerCase() === 'yes'

    const review = await prisma.review.create({
      data: {
        taId: Number(taId),
        rating: Number(rating),
        difficulty: Number(difficulty),
        comment,
        courseCode,
        grade,
        takeAgain: parseBool(takeAgain),
        forCredit: parseBool(forCredit),
        usedTextbook: parseBool(usedTextbook),
        attendance: parseBool(attendance),
        tags: JSON.stringify(tags),
      },
    })

    return NextResponse.json({ success: true, review }, { status: 201 })
  } catch (error) {
    console.error('Review submission error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
