'use client';

import { useState, useEffect } from 'react';
import { generateQuestions } from '@/app/actions/ai';
import type { AIGeneratedQuestion } from '@/lib/ai';

// Suppress hydration mismatch warnings caused by browser extensions
if (typeof window !== 'undefined') {
  const originalError = console.error;
  console.error = (...args) => {
    if (
      args[0]?.includes?.('hydrated') ||
      args[0]?.includes?.('Hydration mismatch')
    ) {
      return;
    }
    originalError(...args);
  };
}

export default function QuestionGeneratorForm() {
  const [mounted, setMounted] = useState(false);
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('MEDIUM');
  const [count, setCount] = useState(3);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<AIGeneratedQuestion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [autoSave, setAutoSave] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[QuestionGeneratorForm] Form submitted');
    setError(null);
    setQuestions([]);
    setSaved(false);
    setLoading(true);

    console.log(`[QuestionGeneratorForm] Calling generateQuestions - Topic: ${topic}, Difficulty: ${difficulty}, Count: ${count}, AutoSave: ${autoSave}`);
    const result = await generateQuestions(topic, difficulty, count, autoSave);
    console.log('[QuestionGeneratorForm] generateQuestions result:', result);

    if (result.success && result.questions) {
      console.log(`[QuestionGeneratorForm] Success - received ${result.questions.length} questions`);
      setQuestions(result.questions);
    } else {
      console.error('[QuestionGeneratorForm] Error:', result.error);
      setError(result.error || 'Failed to generate questions');
    }

    setLoading(false);
  };

  const handleSaveQuestion = async (question: AIGeneratedQuestion, index: number) => {
    try {
      const formData = new FormData();
      formData.append('title', question.title);
      formData.append('description', question.description);
      formData.append('difficulty', question.difficulty);
      formData.append('category', question.category);
      formData.append('tags', question.tags.join(','));

      const { createQuestion } = await import('@/app/actions/questions');
      const result = await createQuestion(formData);

      if (result.success) {
        // Mark as saved
        const newQuestions = [...questions];
        setQuestions(newQuestions);
        setSaved(true);
      }
    } catch (err) {
      setError('Failed to save question');
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
          🤖 AI Question Generator
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Generate realistic interview questions for any topic. AI will create questions tailored to your needs.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6 mb-8">
          {/* Topic Input */}
          <div>
            <label htmlFor="topic" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Topic or Skill *
            </label>
            <input
              id="topic"
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., React Hooks, System Design, Binary Trees, AWS Lambda"
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              required
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {topic.length}/200 characters
            </p>
          </div>

          {/* Difficulty Select */}
          <div>
            <label htmlFor="difficulty" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Difficulty Level
            </label>
            <select
              id="difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            >
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
          </div>

          {/* Count Slider */}
          <div>
            <label htmlFor="count" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Number of Questions: {count}
            </label>
            <input
              id="count"
              type="range"
              min="1"
              max="10"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-300 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Generate 1-10 questions at a time
            </p>
          </div>

          {/* Auto-save Checkbox */}
          <div className="flex items-center gap-3">
            <input
              id="autoSave"
              type="checkbox"
              checked={autoSave}
              onChange={(e) => setAutoSave(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 cursor-pointer"
            />
            <label htmlFor="autoSave" className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
              Auto-save generated questions to my library
            </label>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !topic.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </span>
            ) : (
              'Generate Questions'
            )}
          </button>
        </form>

        {/* Generated Questions Display */}
        {questions.length > 0 && (
          <div className="space-y-6 border-t border-slate-200 dark:border-slate-700 pt-8">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Generated Questions ({questions.length})
            </h3>

            {saved && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <p className="text-sm text-green-800 dark:text-green-200">✓ All questions saved to your library!</p>
              </div>
            )}

            {questions.map((question, index) => (
              <div key={index} className="border border-slate-200 dark:border-slate-700 rounded-lg p-6 hover:shadow-md transition-shadow">
                {/* Question Title */}
                <div className="mb-3">
                  <div className="flex items-start justify-between gap-4">
                    <h4 className="text-lg font-semibold text-slate-900 dark:text-white flex-1">
                      {question.title}
                    </h4>
                    <div className="flex gap-2 flex-shrink-0">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                        {question.difficulty}
                      </span>
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
                        {question.category}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-slate-700 dark:text-slate-300 mb-4 whitespace-pre-wrap">
                  {question.description}
                </p>

                {/* Tags */}
                {question.tags && question.tags.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">Tags:</p>
                    <div className="flex flex-wrap gap-2">
                      {question.tags.map((tag, tagIdx) => (
                        <span
                          key={tagIdx}
                          className="inline-block px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggested Answer */}
                {question.suggestedAnswer && (
                  <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
                    <p className="text-xs font-medium text-blue-900 dark:text-blue-300 mb-1">Suggested Approach:</p>
                    <p className="text-sm text-blue-800 dark:text-blue-200 whitespace-pre-wrap">
                      {question.suggestedAnswer}
                    </p>
                  </div>
                )}

                {/* Save Button */}
                <button
                  onClick={() => handleSaveQuestion(question, index)}
                  className="inline-block px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded transition-colors"
                >
                  Save to Library
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
