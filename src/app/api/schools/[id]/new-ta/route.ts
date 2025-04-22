import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { moderateName, moderateText } from '@/lib/moderation'

// Update: Explicitly define valid as a union to avoid TS 2367
type ModerationResult = { valid: true | false | 'flagged'; reason?: string }

interface ReviewData {
  rating: number
  difficulty: number
  comment: string
  courseCode: string
  takeAgain: boolean
  forCredit: boolean
  usedTextbook: boolean
  attendance: boolean
  grade: string
  tags: string[]
  taId: number
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const schoolId = Number(params.id)
    const body = await req.json()

    console.log('📦 Incoming request body:', body)

    const requiredFields = ['name', 'department', 'courseCode', 'comment', 'rating', 'difficulty']
    const missingFields = requiredFields.filter(field => !body[field])

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }

    // Run moderation (cast to avoid TS complaints)
    const nameCheck = moderateName(body.name) as ModerationResult;
    const commentCheck = await moderateText(body.comment) as ModerationResult;
    
    console.log('Moderation results:', {
      name: { value: body.name, result: nameCheck },
      comment: { value: body.comment, result: commentCheck }
    });

    // Soft moderation: mark as pending if flagged
    const isPending = (
      nameCheck.valid === 'flagged' ||
      commentCheck.valid === 'flagged' ||
      body.pending === true // Fallback to incoming value
    );

    console.log('Final pending decision:', isPending);

    // Create the TA
    const newTA = await prisma.tA.create({
      data: {
        name: body.name,
        department: body.department,
        pending: isPending,
        schoolId: schoolId
      }
    })

    const dbResult = await prisma.$queryRaw<{pending: number}>`
    SELECT pending FROM TA WHERE id = ${newTA.id}
    `;
    console.log('Database verification:', {
      prismaValue: newTA.pending,
      rawValue: dbResult.pending,
      type: typeof dbResult.pending
    });
    
    // Create the review
    const newReview = await prisma.review.create({
      data: {
        rating: Number(body.rating),
        difficulty: Number(body.difficulty),
        comment: body.comment,
        courseCode: body.courseCode,
        takeAgain: body.takeAgain?.toLowerCase() === 'yes',
        forCredit: body.forCredit?.toLowerCase() === 'yes',
        usedTextbook: body.usedTextbook?.toLowerCase() === 'yes',
        attendance: body.attendance?.toLowerCase() === 'yes',
        grade: body.grade,
        tags: JSON.stringify(body.tags || []),
        taId: newTA.id
      }
    })

    return NextResponse.json(
      {
        success: true,
        data: {
          ta: newTA,
          review: newReview
        },
        message: isPending
          ? 'Submission received and pending approval'
          : 'Submission successful'
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('🔥 Error creating TA and review:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Failed to process your submission'
      },
      { status: 500 }
    )
  }
}
