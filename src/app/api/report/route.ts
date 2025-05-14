import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const normalizedTargetType = body.targetType?.toUpperCase();

    if (!["TA", "REVIEW"].includes(normalizedTargetType)) {
      return NextResponse.json({ error: "Invalid target type" }, { status: 400 });
    }

    const newReport = await prisma.report.create({
      data: {
        targetType: normalizedTargetType,
        targetId: body.targetId,
        reason: body.reason,
      },
    });

    return NextResponse.json(newReport, { status: 201 });
  } catch (error) {
    console.error('Error creating report:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
