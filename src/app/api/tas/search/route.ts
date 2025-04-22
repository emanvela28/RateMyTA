import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma' // adjust if your prisma import path is different

export async function GET(req: Request) {
    try {
      const { searchParams } = new URL(req.url);
      const name = searchParams.get('name')?.trim();
      const schoolId = parseInt(searchParams.get('schoolId') || '');
  
      if (!name || isNaN(schoolId)) {
        return NextResponse.json([], { status: 400 });
      }
  
      const matches = await prisma.tA.findMany({
        where: { schoolId },
        take: 10,
      });
  
      const filtered = matches.filter((ta) =>
        ta.name.toLowerCase().includes(name.toLowerCase())
      );
  
      return NextResponse.json(filtered);
    } catch (error) {
      console.error('Error in /api/tas/search:', error);
      return NextResponse.json([], { status: 500 });
    }
  }
  