/**
 * AI utility for calling external AI APIs
 * Currently configured for OpenAI, but can work with Gemini, Groq, etc.
 */

export interface AIFeedback {
  summary: string;
  strengths: string[];
  improvements: string[];
  overallScore: number; // 1-10
}

export interface AIGeneratedQuestion {
  title: string;
  description: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  category: 'TECHNICAL' | 'BEHAVIORAL' | 'SYSTEM_DESIGN' | 'CODING';
  tags: string[];
  suggestedAnswer?: string;
}

export async function generateInterviewQuestions(
  topic: string,
  difficulty: string,
  count: number = 3
): Promise<AIGeneratedQuestion[]> {
  const apiKey = process.env.AI_API_KEY;
  const aiProvider = process.env.AI_PROVIDER || 'openai';

  console.log(`[AI] Generating questions - Provider: ${aiProvider}, Topic: ${topic}, Difficulty: ${difficulty}, Count: ${count}`);
  console.log(`[AI] API Key exists: ${!!apiKey}, Key length: ${apiKey?.length || 0}`);

  if (!apiKey) {
    const error = new Error('AI_API_KEY environment variable not set');
    console.error('[AI] Error:', error.message);
    throw error;
  }

  if (apiProvider === 'openai') {
    return callOpenAIForQuestions(topic, difficulty, count, apiKey);
  } else if (apiProvider === 'gemini') {
    return callGeminiForQuestions(topic, difficulty, count, apiKey);
  } else if (aiProvider === 'groq') {
    return callGroqForQuestions(topic, difficulty, count, apiKey);
  } else {
    const error = new Error(`Unsupported AI provider: ${aiProvider}`);
    console.error('[AI] Error:', error.message);
    throw error;
  }
}

async function callOpenAIForQuestions(
  topic: string,
  difficulty: string,
  count: number,
  apiKey: string
): Promise<AIGeneratedQuestion[]> {
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
          content: `You are an expert technical interviewer. Generate realistic interview questions in JSON format.
          
Return an array of ${count} questions with this structure:
[
  {
    "title": "Question title",
    "description": "Detailed question description",
    "difficulty": "EASY|MEDIUM|HARD",
    "category": "TECHNICAL|BEHAVIORAL|SYSTEM_DESIGN|CODING",
    "tags": ["tag1", "tag2"],
    "suggestedAnswer": "Brief answer/approach"
  }
]

Make questions practical, clear, and aligned with the topic: "${topic}".
Difficulty: ${difficulty}`,
        },
        {
          role: 'user',
          content: `Generate ${count} interview questions about "${topic}" at ${difficulty} difficulty level.`,
        },
      ],
      temperature: 0.8,
      max_tokens: 2000,
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

  const jsonMatch = content.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw new Error('Failed to parse AI response');
  }

  return JSON.parse(jsonMatch[0]) as AIGeneratedQuestion[];
}

async function callGeminiForQuestions(
  topic: string,
  difficulty: string,
  count: number,
  apiKey: string
): Promise<AIGeneratedQuestion[]> {
  console.log(`[Gemini] Calling Gemini API for question generation`);
  
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
                text: `You are an expert technical interviewer. Generate realistic interview questions in JSON format.

Return ONLY a valid JSON array of ${count} questions with this structure:
[
  {
    "title": "Question title",
    "description": "Detailed question description",
    "difficulty": "EASY|MEDIUM|HARD",
    "category": "TECHNICAL|BEHAVIORAL|SYSTEM_DESIGN|CODING",
    "tags": ["tag1", "tag2"],
    "suggestedAnswer": "Brief answer/approach"
  }
]

Topic: "${topic}"
Difficulty: ${difficulty}

Make questions practical, clear, and realistic.`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 2000,
        },
      }),
    }
  );

  console.log(`[Gemini] API response status: ${response.status}`);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    const errorMsg = error.error?.message || `HTTP ${response.status}`;
    console.error(`[Gemini] API error: ${errorMsg}`);
    console.error(`[Gemini] Full error response:`, error);
    throw new Error(`Gemini API error: ${errorMsg}`);
  }

  const data = await response.json();
  console.log(`[Gemini] Received response data successfully`);
  
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!content) {
    console.error(`[Gemini] No content in response:`, data);
    throw new Error('No response content from Gemini API');
  }

  const jsonMatch = content.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    console.error(`[Gemini] Could not parse JSON from response:`, content.substring(0, 500));
    throw new Error('Failed to parse JSON from Gemini response');
  }

  console.log(`[Gemini] Successfully parsed ${jsonMatch[0].split(',').length} question(s)`);
  return JSON.parse(jsonMatch[0]) as AIGeneratedQuestion[];
}

async function callGroqForQuestions(
  topic: string,
  difficulty: string,
  count: number,
  apiKey: string
): Promise<AIGeneratedQuestion[]> {
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
          content: `You are an expert technical interviewer. Generate realistic interview questions in JSON format.
          
Return an array of ${count} questions with this structure:
[
  {
    "title": "Question title",
    "description": "Detailed question description",
    "difficulty": "EASY|MEDIUM|HARD",
    "category": "TECHNICAL|BEHAVIORAL|SYSTEM_DESIGN|CODING",
    "tags": ["tag1", "tag2"],
    "suggestedAnswer": "Brief answer/approach"
  }
]

Make questions practical, clear, and aligned with the topic: "${topic}".
Difficulty: ${difficulty}`,
        },
        {
          role: 'user',
          content: `Generate ${count} interview questions about "${topic}" at ${difficulty} difficulty level.`,
        },
      ],
      temperature: 0.8,
      max_tokens: 2000,
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

  const jsonMatch = content.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw new Error('Failed to parse AI response');
  }

  return JSON.parse(jsonMatch[0]) as AIGeneratedQuestion[];
}

export async function generateAnswerFeedback(
  question: string,
  userAnswer: string
): Promise<AIFeedback> {
  const apiKey = process.env.AI_API_KEY;
  const aiProvider = process.env.AI_PROVIDER || 'openai';

  if (!apiKey) {
    throw new Error('AI_API_KEY environment variable not set');
  }

  if (aiProvider === 'openai') {
    return callOpenAI(question, userAnswer, apiKey);
  } else if (aiProvider === 'gemini') {
    return callGemini(question, userAnswer, apiKey);
  } else if (aiProvider === 'groq') {
    return callGroq(question, userAnswer, apiKey);
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
          content: `You are an expert technical interview coach. Analyze the following interview answer and provide structured feedback in JSON format.
          
Return a JSON object with:
{
  "summary": "1-2 sentence overall assessment",
  "strengths": ["strength 1", "strength 2"],
  "improvements": ["improvement 1", "improvement 2"],
  "overallScore": 7
}

Be constructive and specific. Focus on clarity, structure, technical accuracy, and communication.`,
        },
        {
          role: 'user',
          content: `Question: "${question}"\n\nUser's Answer: "${userAnswer}"`,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content;

  if (!content) {
    throw new Error('No response from OpenAI');
  }

  // Parse JSON from response
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
          content: `You are an expert technical interview coach. Analyze the following interview answer and provide structured feedback in JSON format.

Return a JSON object with:
{
  "summary": "1-2 sentence overall assessment",
  "strengths": ["strength 1", "strength 2"],
  "improvements": ["improvement 1", "improvement 2"],
  "overallScore": 7
}`,
        },
        {
          role: 'user',
          content: `Question: "${question}"\n\nUser's Answer: "${userAnswer}"`,
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
