'use server';

import { prisma } from '@/lib/prisma';
import { createQuestionSchema, updateQuestionSchema, paginationSchema } from '@/lib/validations';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { Difficulty, Category } from '@prisma/client';
import { handleError, NotFoundError, ForbiddenError, ValidationError } from '@/lib/errors';
import { createAuditLog, logError } from '@/lib/logger';
import { ZodError } from 'zod';

export async function createQuestion(formData: FormData) {
  let session;
  try {
    session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized', code: 'AUTH_ERROR' };
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

    createAuditLog(session.user.id, 'CREATE', 'Question', question.id);
    revalidatePath('/dashboard/questions');
    
    return { success: true, questionId: question.id };
  } catch (error) {
    if (error instanceof ZodError && error.errors) {
      const details: Record<string, string[]> = {};
      error.errors.forEach(err => {
        const path = err.path.join('.');
        if (!details[path]) details[path] = [];
        details[path].push(err.message);
      });
      return {
        success: false,
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details,
      };
    }

    logError('Failed to update question', error as Error, { userId: session?.user?.id });
    return {
      success: false,
      error: 'Failed to create question',
      code: 'INTERNAL_ERROR',
    };
  }
}

export async function updateQuestion(questionId: string, formData: FormData) {
  let session;
  try {
    session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized', code: 'AUTH_ERROR' };
    }

    const question = await prisma.question.findUnique({
      where: { id: questionId },
    });

    if (!question) {
      throw new NotFoundError('Question not found');
    }

    if (question.userId !== session.user.id) {
      throw new ForbiddenError('You cannot modify this question');
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

    createAuditLog(session.user.id, 'UPDATE', 'Question', questionId);
    revalidatePath('/dashboard/questions');
    revalidatePath(`/dashboard/questions/${questionId}`);
    
    return { success: true, questionId: updated.id };
  } catch (error) {
    if (error instanceof ZodError && error.errors) {
      const details: Record<string, string[]> = {};
      error.errors.forEach(err => {
        const path = err.path.join('.');
        if (!details[path]) details[path] = [];
        details[path].push(err.message);
      });
      return {
        success: false,
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details,
      };
    }

    const errorResponse = handleError(error);
    logError('Failed to update question', error as Error, { questionId, userId: session?.user?.id });
    return {
      success: false,
      error: errorResponse.error,
      code: errorResponse.code,
    };
  }
}

export async function deleteQuestion(questionId: string) {
  let session;
  try {
    session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized', code: 'AUTH_ERROR' };
    }

    const question = await prisma.question.findUnique({
      where: { id: questionId },
    });

    if (!question) {
      throw new NotFoundError('Question not found');
    }

    if (question.userId !== session.user.id) {
      throw new ForbiddenError('You cannot delete this question');
    }

    await prisma.question.update({
      where: { id: questionId },
      data: { deletedAt: new Date() },
    });

    createAuditLog(session.user.id, 'DELETE', 'Question', questionId);
    revalidatePath('/dashboard/questions');
    
    return { success: true };
  } catch (error) {
    const errorResponse = handleError(error);
    logError('Failed to delete question', error as Error, { questionId, userId: session?.user?.id });
    return {
      success: false,
      error: errorResponse.error,
      code: errorResponse.code,
    };
  }
}

export async function getUserQuestions(page = 1, limit = 20) {
  let session;
  try {
    session = await auth();
    const targetUserId = session?.user?.id;

    if (!targetUserId) {
      return { success: false, error: 'Unauthorized', code: 'AUTH_ERROR' };
    }

    const validated = paginationSchema.parse({ page, limit });
    const skip = (validated.page - 1) * validated.limit;

    const [questions, total] = await Promise.all([
      prisma.question.findMany({
        where: {
          userId: targetUserId,
          deletedAt: null,
        },
        skip,
        take: validated.limit,
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
      }),
      prisma.question.count({
        where: {
          userId: targetUserId,
          deletedAt: null,
        },
      }),
    ]);

    return {
      success: true,
      questions,
      pagination: {
        page: validated.page,
        limit: validated.limit,
        total,
        pages: Math.ceil(total / validated.limit),
      },
    };
  } catch (error) {
    logError('Failed to fetch questions', error as Error, { userId: session?.user?.id });
    return {
      success: false,
      error: 'Failed to fetch questions',
      code: 'INTERNAL_ERROR',
      questions: [],
    };
  }
}

export async function getQuestionById(questionId: string) {
  let session;
  try {
    session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized', code: 'AUTH_ERROR' };
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
      throw new NotFoundError('Question not found');
    }

    return { success: true, question };
  } catch (error) {
    const errorResponse = handleError(error);
    return {
      success: false,
      error: errorResponse.error,
      code: errorResponse.code,
    };
  }
}
