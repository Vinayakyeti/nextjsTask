'use server';

import { prisma } from '@/lib/prisma';
import { createQuestionSchema, updateQuestionSchema } from '@/lib/validations';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { Difficulty, Category } from '@prisma/client';

export async function createQuestion(formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const data = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      difficulty: formData.get('difficulty') as Difficulty,
      category: formData.get('category') as Category,
      tags: (formData.get('tags') as string)?.split(',').map(t => t.trim()).filter(Boolean) || [],
      companyName: (formData.get('companyName') as string) || undefined,
    };

    const validated = createQuestionSchema.parse(data);

    const question = await prisma.question.create({
      data: {
        ...validated,
        userId: session.user.id,
      },
    });

    revalidatePath('/dashboard/questions');
    return { success: true, questionId: question.id };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create question',
    };
  }
}

export async function updateQuestion(questionId: string, formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    // Check ownership
    const question = await prisma.question.findUnique({
      where: { id: questionId },
    });

    if (!question || question.userId !== session.user.id) {
      return { success: false, error: 'Question not found or unauthorized' };
    }

    const data = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      difficulty: formData.get('difficulty') as Difficulty,
      category: formData.get('category') as Category,
      tags: (formData.get('tags') as string)?.split(',').map(t => t.trim()).filter(Boolean) || [],
      companyName: (formData.get('companyName') as string) || undefined,
    };

    const validated = updateQuestionSchema.parse(data);

    const updated = await prisma.question.update({
      where: { id: questionId },
      data: validated,
    });

    revalidatePath('/dashboard/questions');
    revalidatePath(`/dashboard/questions/${questionId}`);
    return { success: true, questionId: updated.id };
  } catch (error) {
    console.error('Update question error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update question',
    };
  }
}

export async function deleteQuestion(questionId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    // Check ownership
    const question = await prisma.question.findUnique({
      where: { id: questionId },
    });

    if (!question || question.userId !== session.user.id) {
      return { success: false, error: 'Question not found or unauthorized' };
    }

    await prisma.question.update({
      where: { id: questionId },
      data: { deletedAt: new Date() },
    });

    revalidatePath('/dashboard/questions');
    return { success: true };
  } catch (error) {
    return {s: false,
      error: error instanceof Error ? error.message : 'Failed to delete question',
    };
  }
}

export async function getUserQuestions(userId?: string) {
  try {
    const session = await auth();
    const targetUserId = userId || session?.user?.id;

    if (!targetUserId) {
      return { success: false, error: 'Unauthorized' };
    }

    const questions = await prisma.question.findMany({
      where: {
        userId: targetUserId,
        deletedAt: null,
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        difficulty: true,
        category: true,
        tags: true,
        companyName: true,
        createdAt: true,
      },
    });

    return { success: true, questions };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to fetch questions',
      questions: [],
    };
  }
}

export async function getQuestionById(questionId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const question = await prisma.question.findUnique({
      where: { id: questionId },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        practiceSessions: {
          where: { userId: session.user.id },
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });

    if (!question || question.deletedAt) {
      return { success: false, error: 'Question not found' };
    }

    return { success: true, question };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to fetch question',
    };
  }
}
