'use server';

import { auth } from '@/auth';
import { generateAnswerFeedback, generateInterviewQuestions, type AIFeedback, type AIGeneratedQuestion } from '@/lib/ai';
import { logError } from '@/lib/logger';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getAnswerFeedback(
  question: string,
  answer: string
): Promise<{ success: boolean; feedback?: AIFeedback; error?: string }> {
  try {
    // Verify user is authenticated
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized: Please log in' };
    }

    // Validate inputs
    if (!question?.trim()) {
      return { success: false, error: 'Question cannot be empty' };
    }

    if (!answer?.trim()) {
      return { success: false, error: 'Answer cannot be empty' };
    }

    if (question.length > 2000) {
      return { success: false, error: 'Question is too long (max 2000 characters)' };
    }

    if (answer.length > 5000) {
      return { success: false, error: 'Answer is too long (max 5000 characters)' };
    }

    // Call AI service
    const feedback = await generateAnswerFeedback(question, answer);

    return { success: true, feedback };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to generate feedback';

    logError('AI feedback generation failed', error instanceof Error ? error : new Error(message), {
      userId: (await auth())?.user?.id,
    });

    // Return user-friendly error
    return {
      success: false,
      error: message.includes('API error')
        ? 'AI service temporarily unavailable. Please try again later.'
        : message,
    };
  }
}

export async function generateQuestions(
  topic: string,
  difficulty: string,
  count: number = 3,
  autoSave: boolean = false
): Promise<{
  success: boolean;
  questions?: AIGeneratedQuestion[];
  error?: string;
}> {
  try {
    console.log(`[generateQuestions] Starting - Topic: ${topic}, Difficulty: ${difficulty}, Count: ${count}, AutoSave: ${autoSave}`);
    
    // Verify user is authenticated
    const session = await auth();
    if (!session?.user?.id) {
      console.error('[generateQuestions] Unauthorized - no session');
      return { success: false, error: 'Unauthorized: Please log in' };
    }

    console.log(`[generateQuestions] User authenticated: ${session.user.id}`);

    // Validate inputs
    if (!topic?.trim() || topic.length < 3) {
      console.warn('[generateQuestions] Invalid topic - too short');
      return { success: false, error: 'Topic must be at least 3 characters' };
    }

    if (topic.length > 200) {
      console.warn('[generateQuestions] Invalid topic - too long');
      return { success: false, error: 'Topic is too long (max 200 characters)' };
    }

    if (!['EASY', 'MEDIUM', 'HARD'].includes(difficulty)) {
      console.warn('[generateQuestions] Invalid difficulty:', difficulty);
      return { success: false, error: 'Invalid difficulty level' };
    }

    if (count < 1 || count > 10) {
      console.warn('[generateQuestions] Invalid count:', count);
      return { success: false, error: 'Generate between 1-10 questions' };
    }

    // Generate questions using AI
    console.log('[generateQuestions] Calling generateInterviewQuestions...');
    const questions = await generateInterviewQuestions(topic, difficulty, count);
    console.log(`[generateQuestions] Generated ${questions.length} questions successfully`);

    // Auto-save if requested
    if (autoSave) {
      try {
        console.log('[generateQuestions] Auto-saving questions to database...');
        await Promise.all(
          questions.map(q =>
            prisma.question.create({
              data: {
                title: q.title,
                description: q.description,
                difficulty: q.difficulty,
                category: q.category,
                tags: q.tags,
                userId: session.user.id,
              },
            })
          )
        );
        console.log('[generateQuestions] Auto-save completed');
        revalidatePath('/dashboard/questions');
      } catch (err) {
        console.error('[generateQuestions] Auto-save failed:', err);
        logError('Failed to auto-save generated questions', err as Error, {
          userId: session.user.id,
        });
        // Don't fail the entire request if save fails
      }
    }

    console.log('[generateQuestions] Returning success with questions');
    return { success: true, questions };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to generate questions';
    console.error('[generateQuestions] Error:', message);
    console.error('[generateQuestions] Full error:', error);
    
    logError('Question generation failed', error instanceof Error ? error : new Error(message), {
      userId: (await auth())?.user?.id,
    });

    return {
      success: false,
      error: message.includes('API error')
        ? 'AI service temporarily unavailable. Please try again later.'
        : message,
    };
  }
}
