'use server';

import { auth } from '@/auth';
import { generateAnswerFeedback, type AIFeedback } from '@/lib/ai';
import { logError } from '@/lib/logger';

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
