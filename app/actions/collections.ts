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

    revalidatePath('/collections');
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

    revalidatePath('/collections');
    revalidatePath(`/collections/${collectionId}`);
    return { success: true };
  } catch (error) {
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

    revalidatePath('/collections');
    return { success: true };
  } catch (error) {
    return {
      success: false,
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

    // Check if question exists and user has access (owns the question)
    const question = await prisma.question.findUnique({
      where: { id: questionId },
    });

    if (!question || question.deletedAt || question.userId !== session.user.id) {
      return { success: false, error: 'Question not found or unauthorized' };
    }

    // Check if already exists - convert to string for comparison
    const questionIdStr = String(questionId);
    const alreadyExists = collection.questionIds?.some(id => String(id) === questionIdStr);
    
    if (!alreadyExists) {
      // For MongoDB with Prisma, we need to handle array updates carefully
      // Ensure we're working with an array
      const currentIds = Array.isArray(collection.questionIds) ? collection.questionIds : [];
      
      const updatedIds = [...currentIds, questionId];
      
      await prisma.collection.update({
        where: { id: collectionId },
        data: {
          questionIds: updatedIds,
        },
      });
    } else {
      return { success: false, error: 'Question already in collection' };
    }

    revalidatePath(`/collections/${collectionId}`);
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

    revalidatePath(`/collections/${collectionId}`);
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

    // Fetch all collections without WHERE clause to avoid Prisma's type conversion issue
    const allCollections = await prisma.collection.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        description: true,
        color: true,
        questionIds: true,
        createdAt: true,
        userId: true,
        deletedAt: true,
      },
    });

    // Filter in JavaScript to match exact userId string comparison
    const collections = allCollections.filter(c => 
      String(c.userId) === String(targetUserId) && c.deletedAt === null
    );

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

    // If array is empty, skip the query
    if (!collection.questionIds || collection.questionIds.length === 0) {
      return {
        success: true,
        collection: {
          ...collection,
          questions: [],
        },
      };
    }
    
    const questions = await prisma.question.findMany({
      where: {
        id: {
          in: collection.questionIds as string[]
        },
        // Don't filter by deletedAt - collection should include questions even if they're deleted
        // This allows viewing historical collections
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
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch collection',
    };
  }
}
