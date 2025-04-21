import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params

  const ta = await prisma.tA.findUnique({
    where: { id: Number(id) },
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
