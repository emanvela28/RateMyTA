import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // adjust if your prisma client path is different

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const newReview = await prisma.siteReview.create({
      data: {
        bugEncountered: body.bugEncountered,
        bugDetails: body.bugDetails,
        easeOfUse: body.easeOfUse,
        experience: body.experience,
        additionalFeedback: body.additionalFeedback,
      },
    });

    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    console.error('Error creating site review:', error);
    return NextResponse.json({ message: 'Error', error }, { status: 500 });
  }
}
