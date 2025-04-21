import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const ta = await prisma.tA.findUnique({
    where: { id: Number(params.id) },
    include: { school: true },
  })

  if (!ta || !ta.school) {
    return NextResponse.json({ error: 'TA or school not found' }, { status: 404 })
  }

  return NextResponse.json({ domain: ta.school.domain })
}
