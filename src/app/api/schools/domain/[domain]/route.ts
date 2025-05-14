import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  context: { params: { domain: string } }
) {
  const domain = decodeURIComponent(context.params.domain);

  const school = await prisma.school.findFirst({
    where: { domain },
    select: { id: true, name: true },
  });

  if (!school) {
    return NextResponse.json({ error: 'School not found' }, { status: 404 });
  }

  return NextResponse.json(school);
}
