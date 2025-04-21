// src/app/api/tas/[id]/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const ta = await prisma.tA.findUnique({
    where: { id: Number(params.id) },
    select: {
      id: true,
      name: true,
      schoolId: true,
    },
  })

  if (!ta) {
    return NextResponse.json({ error: 'TA not found' }, { status: 404 })
  }

  return NextResponse.json(ta)
}
