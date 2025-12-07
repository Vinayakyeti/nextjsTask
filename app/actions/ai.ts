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
    console.log('[getAnswerFeedback] Starting feedback generation');

    // Verify user is authenticated
    const session = await auth();
    if (!session?.user?.id) {
      console.error('[getAnswerFeedback] Unauthorized - no session');
      return { success: false, error: 'Unauthorized: Please log in' };
    }

    console.log(`[getAnswerFeedback] User authenticated: ${session.user.id}`);

    // Validate inputs
    if (!question?.trim() || question.length < 5) {
      console.warn('[getAnswerFeedback] Invalid question - too short');
      return { success: false, error: 'Question must be at least 5 characters' };
    }

    if (!answer?.trim() || answer.length < 5) {
      console.warn('[getAnswerFeedback] Invalid answer - too short');
      return { success: false, error: 'Answer must be at least 5 characters' };
    }

    console.log('[getAnswerFeedback] Calling generateAnswerFeedback...');
    const feedback = await generateAnswerFeedback(question, answer);
    console.log('[getAnswerFeedback] Feedback generated successfully');

    return { success: true, feedback };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to generate feedback';
    console.error('[getAnswerFeedback] Error:', message);
    console.error('[getAnswerFeedback] Full error:', error);

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
