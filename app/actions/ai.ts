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

    console.log('Getting answer feedback for question and answer...');
    const feedback = await generateAnswerFeedback(question, answer);

    return { success: true, feedback };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to generate feedback';
    console.error('Answer feedback generation error:', message, error);

    logError('Answer feedback generation failed', error instanceof Error ? error : new Error(message), {
      userId: (await auth())?.user?.id,
    });

    // Return more specific error messages
    if (message.includes('API error') || message.includes('403') || message.includes('401')) {
      return {
        success: false,
        error: 'API Key issue: Please check if your Gemini API key is valid and has proper permissions.',
      };
    }

    if (message.includes('HTTP 429')) {
      return {
        success: false,
        error: 'Rate limit exceeded: Please try again in a few moments.',
      };
    }

    if (message.includes('parse') || message.includes('JSON')) {
      return {
        success: false,
        error: 'Failed to parse AI response. The API might be returning unexpected data.',
      };
    }

    return {
      success: false,
      error: message || 'Failed to generate feedback. Please try again.',
    };
  }
}
