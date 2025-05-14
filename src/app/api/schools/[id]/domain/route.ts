import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params; // Use context.params

    const school = await prisma.school.findUnique({
      where: { id: Number(id) },
      select: { domain: true, name: true },
    });

    if (!school) {
      return NextResponse.json({ error: 'School not found' }, { status: 404 });
    }

    return NextResponse.json({ domain: school.domain, name: school.name });
  } catch (error) {
    console.error('Error fetching school domain:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
