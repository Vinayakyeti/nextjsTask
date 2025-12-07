'use server';

import { prisma } from '@/lib/prisma';
import { createPracticeSessionSchema } from '@/lib/validations';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

export async function createPracticeSession(data: {
  questionId: string;
  answer: string;
  duration: number;
  rating?: number;
}) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const validated = createPracticeSessionSchema.parse(data);

    const practiceSession = await prisma.practiceSession.create({
      data: {
        userId: session.user.id,
        questionId: validated.questionId,
        answer: validated.answer,
        duration: validated.duration,
        rating: validated.rating,
      },
    });

    revalidatePath('/dashboard/practice/history');
    revalidatePath(`/dashboard/questions/${validated.questionId}`);
    
    return { success: true, sessionId: practiceSession.id };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save practice session',
    };
  }
}

export async function getPracticeHistory(userId?: string) {
  try {
    const session = await auth();
    const targetUserId = userId || session?.user?.id;

    if (!targetUserId) {
      return { success: false, error: 'Unauthorized' };
    }

    const sessions = await prisma.practiceSession.findMany({
      where: { userId: targetUserId },
      include: {
        question: {
          select: {
            id: true,
            title: true,
            difficulty: true,
            category: true,
            companyName: true,
          },
        },
      },
      orderBy: { completedAt: 'desc' },
      take: 50,
    });

    return { success: true, sessions };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to fetch practice history',
      sessions: [],
    };
  }
}

export async function getPracticeStats() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const [totalSessions, avgDuration, sessionsByDifficulty] = await Promise.all([
      // Total sessions
      prisma.practiceSession.count({
        where: { userId: session.user.id },
      }),
      
      // Average duration
      prisma.practiceSession.aggregate({
        where: { userId: session.user.id },
        _avg: { duration: true },
      }),
      
      // Sessions by difficulty
      prisma.practiceSession.groupBy({
        by: ['questionId'],
        where: { userId: session.user.id },
        _count: true,
      }),
    ]);

    // Get difficulty breakdown
    const questionIds = sessionsByDifficulty.map(s => s.questionId);
    const questions = await prisma.question.findMany({
      where: { id: { in: questionIds } },
      select: { id: true, difficulty: true },
    });

    const difficultyMap = questions.reduce((acc, q) => {
      acc[q.id] = q.difficulty;
      return acc;
    }, {} as Record<string, string>);

    const difficultyStats = sessionsByDifficulty.reduce((acc, session) => {
      const difficulty = difficultyMap[session.questionId];
      if (difficulty) {
        acc[difficulty] = (acc[difficulty] || 0) + session._count;
      }
      return acc;
    }, {} as Record<string, number>);

    return {
      success: true,
      stats: {
        totalSessions,
        avgDuration: Math.round(avgDuration._avg.duration || 0),
        byDifficulty: difficultyStats,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to fetch stats',
    };
  }
}
