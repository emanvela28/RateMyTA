// /src/app/api/schools/[id]/domain/route.ts
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params

  const school = await prisma.school.findUnique({
    where: { id: Number(id) },
    select: { domain: true, name: true },
  })

  if (!school) {
    return NextResponse.json({ error: 'School not found' }, { status: 404 })
  }

  return NextResponse.json({ domain: school.domain, name: school.name })
}
