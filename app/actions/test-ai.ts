'use server';

import { generateInterviewQuestions } from '@/lib/ai';

/**
 * Test function to diagnose AI API issues
 * Call this to see detailed error messages
 */
export async function testAIAPI() {
  try {
    console.log('Testing Gemini API...');
    console.log('API Key exists:', !!process.env.AI_API_KEY);
    console.log('Provider:', process.env.AI_PROVIDER);

    const questions = await generateInterviewQuestions('JavaScript', 'EASY', 1);
    
    return {
      success: true,
      message: 'AI API is working!',
      questions,
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('AI API Test Error:', errorMsg);
    
    return {
      success: false,
      error: errorMsg,
      hint: errorMsg.includes('401') || errorMsg.includes('authentication') 
        ? 'API key is invalid or expired. Please generate a new key.'
        : errorMsg.includes('404')
        ? 'Gemini model not found. Check AI_PROVIDER setting.'
        : 'Unknown API error. Check console logs.',
    };
  }
}
