import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Test database connection
    await prisma.$connect();
    
    const userCount = await prisma.user.count();
    const questionCount = await prisma.question.count();
    const companyCount = await prisma.company.count();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database connected successfully',
      stats: {
        users: userCount,
        questions: questionCount,
        companies: companyCount,
      },
    });
  } catch (error) {
    return NextResponse.json(
      success: false, 
      error: 'Database connection failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
