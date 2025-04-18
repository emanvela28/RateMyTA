import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const schools = await prisma.school.findMany()
  return NextResponse.json(schools)
}
