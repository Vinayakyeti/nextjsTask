'use client';

import { useState } from 'react';
import { getAnswerFeedback } from '@/app/actions/ai';
import { AIFeedback } from '@/lib/ai';

export function AnswerReviewForm() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<AIFeedback | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[AnswerReviewForm] Form submitted');
    
    setError(null);
    setFeedback(null);
    setLoading(true);

    try {
      console.log('[AnswerReviewForm] Calling getAnswerFeedback');
      const result = await getAnswerFeedback(question, answer);
      console.log('[AnswerReviewForm] Result:', result);

      if (result.success && result.feedback) {
        console.log('[AnswerReviewForm] Success - received feedback');
        setFeedback(result.feedback);
      } else {
        console.error('[AnswerReviewForm] Error:', result.error);
        setError(result.error || 'Failed to generate feedback');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      console.error('[AnswerReviewForm] Error:', message);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">AI Answer Review</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Interview Question
            </label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Enter the interview question..."
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
            <p className="text-xs text-slate-500 mt-1">{question.length}/200 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Your Answer
            </label>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Enter your answer to the question..."
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={5}
            />
            <p className="text-xs text-slate-500 mt-1">{answer.length}/2000 characters</p>
          </div>

          <button
            type="submit"
            disabled={loading || !question.trim() || !answer.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition"
          >
            {loading ? 'Generating feedback...' : 'Get AI Feedback'}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {feedback && (
          <div className="mt-8 space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-2">Summary</h3>
              <p className="text-blue-800 dark:text-blue-300">{feedback.summary}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-green-900 dark:text-green-200 mb-3">Strengths</h3>
                <ul className="space-y-2">
                  {feedback.strengths.map((strength, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-green-600 dark:text-green-400 mt-1">✓</span>
                      <span className="text-green-800 dark:text-green-300">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-200 mb-3">Areas for Improvement</h3>
                <ul className="space-y-2">
                  {feedback.improvements.map((improvement, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-yellow-600 dark:text-yellow-400 mt-1">→</span>
                      <span className="text-yellow-800 dark:text-yellow-300">{improvement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-200 mb-4">Overall Score</h3>
              <div className="flex items-center gap-4">
                <div className="text-5xl font-bold text-purple-600 dark:text-purple-400">{feedback.overallScore}</div>
                <div className="flex-1">
                  <div className="w-full bg-purple-200 dark:bg-purple-800 rounded-full h-4">
                    <div
                      className="bg-purple-600 dark:bg-purple-400 h-4 rounded-full"
                      style={{ width: `${(feedback.overallScore / 10) * 100}%` }}
                    />
                  </div>
                  <p className="text-sm text-purple-700 dark:text-purple-300 mt-2">out of 10</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
