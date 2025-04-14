// src/app/api/tas/route.ts

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const tas = await prisma.tA.findMany({
    include: { reviews: true, school: true },
  })
  return NextResponse.json(tas)
}

export async function POST(req: Request) {
  const body = await req.json()
  const { name, department, schoolId } = body

  const newTA = await prisma.tA.create({
    data: {
      name,
      department,
      schoolId: parseInt(schoolId),
    },
  })

  return NextResponse.json(newTA, { status: 201 })
}
