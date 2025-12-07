import { AIFeedback } from '@/types';

export interface AIFeedback {
  summary: string;
  strengths: string[];
  improvements: string[];
  overallScore: number;
}

export async function generateAnswerFeedback(
  question: string,
  answer: string
): Promise<AIFeedback> {
  const apiKey = process.env.AI_API_KEY;
  const aiProvider = process.env.AI_PROVIDER || 'openai';

  if (!apiKey) {
    throw new Error('AI_API_KEY environment variable not set');
  }

  if (aiProvider === 'openai') {
    return callOpenAI(question, answer, apiKey);
  } else if (aiProvider === 'gemini') {
    return callGemini(question, answer, apiKey);
  } else if (aiProvider === 'groq') {
    return callGroq(question, answer, apiKey);
  } else {
    throw new Error(`Unsupported AI provider: ${aiProvider}`);
  }
}

async function callOpenAI(
  question: string,
  userAnswer: string,
  apiKey: string
): Promise<AIFeedback> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4-turbo',
      messages: [
        {
          role: 'system',
          content: `You are an expert technical interview coach. Analyze this interview answer and provide structured feedback in JSON format.

Return ONLY valid JSON with:
{
  "summary": "1-2 sentence overall assessment",
  "strengths": ["strength 1", "strength 2"],
  "improvements": ["improvement 1", "improvement 2"],
  "overallScore": 7
}`,
        },
        {
          role: 'user',
          content: `Question: "${question}"\n\nAnswer: "${userAnswer}"\n\nProvide feedback in JSON format.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    }),
  });

  if (!response.ok) {
    throw new Error('OpenAI API error');
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content;

  if (!content) {
    throw new Error('No response from OpenAI');
  }

  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Failed to parse AI response');
  }

  return JSON.parse(jsonMatch[0]) as AIFeedback;
}

async function callGemini(
  question: string,
  userAnswer: string,
  apiKey: string
): Promise<AIFeedback> {
  const response = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are an expert technical interview coach. Analyze this interview answer and provide structured feedback in JSON format.

Question: "${question}"
User's Answer: "${userAnswer}"

Return ONLY valid JSON with:
{
  "summary": "1-2 sentence overall assessment",
  "strengths": ["strength 1", "strength 2"],
  "improvements": ["improvement 1", "improvement 2"],
  "overallScore": 7
}`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    const errorMsg = error.error?.message || `HTTP ${response.status}`;
    throw new Error(`Gemini API error: ${errorMsg}`);
  }

  const data = await response.json();

  const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!content) {
    throw new Error('No response content from Gemini API');
  }

  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Failed to parse JSON from Gemini response');
  }

  return JSON.parse(jsonMatch[0]) as AIFeedback;
}

async function callGroq(
  question: string,
  userAnswer: string,
  apiKey: string
): Promise<AIFeedback> {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'mixtral-8x7b-32768',
      messages: [
        {
          role: 'system',
          content: `You are an expert technical interview coach. Analyze this interview answer and provide structured feedback in JSON format.

Return ONLY valid JSON with:
{
  "summary": "1-2 sentence overall assessment",
  "strengths": ["strength 1", "strength 2"],
  "improvements": ["improvement 1", "improvement 2"],
  "overallScore": 7
}`,
        },
        {
          role: 'user',
          content: `Question: "${question}"\n\nAnswer: "${userAnswer}"\n\nProvide feedback in JSON format.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    }),
  });

  if (!response.ok) {
    throw new Error('Groq API error');
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content;

  if (!content) {
    throw new Error('No response from Groq');
  }

  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Failed to parse AI response');
  }

  return JSON.parse(jsonMatch[0]) as AIFeedback;
}
