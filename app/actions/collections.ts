'use server';

import { prisma } from '@/lib/prisma';
import { createCollectionSchema, updateCollectionSchema } from '@/lib/validations';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

export async function createCollection(formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const data = {
      name: formData.get('name') as string,
      description: (formData.get('description') as string) || undefined,
      color: (formData.get('color') as string) || undefined,
    };

    const validated = createCollectionSchema.parse(data);

    const collection = await prisma.collection.create({
      data: {
        ...validated,
        userId: session.user.id,
        questionIds: [],
      },
    });

    revalidatePath('/dashboard/collections');
    return { success: true, collectionId: collection.id };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create collection',
    };
  }
}

export async function updateCollection(collectionId: string, formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    // Check ownership
    const collection = await prisma.collection.findUnique({
      where: { id: collectionId },
    });

    if (!collection || collection.userId !== session.user.id) {
      return { success: false, error: 'Collection not found or unauthorized' };
    }

    const data = {
      name: formData.get('name') as string,
      description: (formData.get('description') as string) || undefined,
      color: (formData.get('color') as string) || undefined,
    };

    const validated = updateCollectionSchema.parse(data);

    await prisma.collection.update({
      where: { id: collectionId },
      data: validated,
    });

    revalidatePath('/dashboard/collections');
    revalidatePath(`/dashboard/collections/${collectionId}`);
    return { success: true };
  } catch (error) {
    console.error('Update collection error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update collection',
    };
  }
}

export async function deleteCollection(collectionId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    // Check ownership
    const collection = await prisma.collection.findUnique({
      where: { id: collectionId },
    });

    if (!collection || collection.userId !== session.user.id) {
      return { success: false, error: 'Collection not found or unauthorized' };
    }

    await prisma.collection.update({
      where: { id: collectionId },
      data: { deletedAt: new Date() },
    });

    revalidatePath('/dashboard/collections');
    return { success: true };
  } catch (error) {
    return {s: false,
      error: error instanceof Error ? error.message : 'Failed to delete collection',
    };
  }
}

export async function addQuestionToCollection(collectionId: string, questionId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const collection = await prisma.collection.findUnique({
      where: { id: collectionId },
    });

    if (!collection || collection.userId !== session.user.id) {
      return { success: false, error: 'Collection not found or unauthorized' };
    }

    // Check if question exists and user has access
    const question = await prisma.question.findUnique({
      where: { id: questionId },
    });

    if (!question || question.deletedAt) {
      return { success: false, error: 'Question not found' };
    }

    // Add question if not already in collection
    if (!collection.questionIds.includes(questionId)) {
      await prisma.collection.update({
        where: { id: collectionId },
        data: {
          questionIds: [...collection.questionIds, questionId],
        },
      });
    }

    revalidatePath(`/dashboard/collections/${collectionId}`);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to add question',
    };
  }
}

export async function removeQuestionFromCollection(collectionId: string, questionId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const collection = await prisma.collection.findUnique({
      where: { id: collectionId },
    });

    if (!collection || collection.userId !== session.user.id) {
      return { success: false, error: 'Collection not found or unauthorized' };
    }

    await prisma.collection.update({
      where: { id: collectionId },
      data: {
        questionIds: collection.questionIds.filter(id => id !== questionId),
      },
    });

    revalidatePath(`/dashboard/collections/${collectionId}`);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to remove question',
    };
  }
}

export async function getUserCollections(userId?: string) {
  try {
    const session = await auth();
    const targetUserId = userId || session?.user?.id;

    if (!targetUserId) {
      return { success: false, error: 'Unauthorized' };
    }

    const collections = await prisma.collection.findMany({
      where: {
        userId: targetUserId,
        deletedAt: null,
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        description: true,
        color: true,
        questionIds: true,
        createdAt: true,
      },
    });

    return { success: true, collections };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to fetch collections',
      collections: [],
    };
  }
}

export async function getCollectionById(collectionId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const collection = await prisma.collection.findUnique({
      where: { id: collectionId },
    });

    if (!collection || collection.deletedAt || collection.userId !== session.user.id) {
      return { success: false, error: 'Collection not found or unauthorized' };
    }

    const questions = await prisma.question.findMany({
      where: {
        id: { in: collection.questionIds },
        deletedAt: null,
      },
      select: {
        id: true,
        title: true,
        difficulty: true,
        category: true,
        companyName: true,
        tags: true,
      },
    });

    return {
      success: true,
      collection: {
        ...collection,
        questions,
      },
    };
  } catch (error) {
    console.error('Get collection error:', error);
    return {
      success: false,
      error: 'Failed to fetch collection',
    };
  }
}
