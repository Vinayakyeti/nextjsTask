'use server';

import { auth } from '@/auth';
import { generateAnswerFeedback } from '@/lib/ai';
import { logError } from '@/lib/logger';
import { AIFeedback } from '@/lib/ai';

export async function getAnswerFeedback(
  question: string,
  answer: string
): Promise<{
  success: boolean;
  feedback?: AIFeedback;
  error?: string;
}> {
  try {
    // Verify user is authenticated
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized: Please log in' };
    }

    // Validate inputs
    if (!question?.trim() || question.length < 5) {
      return { success: false, error: 'Question must be at least 5 characters' };
    }

    if (!answer?.trim() || answer.length < 5) {
      return { success: false, error: 'Answer must be at least 5 characters' };
    }

    const feedback = await generateAnswerFeedback(question, answer);

    return { success: true, feedback };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to generate feedback';

    logError('Answer feedback generation failed', error instanceof Error ? error : new Error(message), {
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
