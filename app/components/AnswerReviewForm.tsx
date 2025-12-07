'use client';

import { useState } from 'react';
import { getAnswerFeedback } from '@/app/actions/ai';
import type { AIFeedback } from '@/lib/ai';

export default function AnswerReviewForm() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<AIFeedback | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFeedback(null);
    setLoading(true);

    const result = await getAnswerFeedback(question, answer);

    if (result.success && result.feedback) {
      setFeedback(result.feedback);
    } else {
      setError(result.error || 'Failed to get feedback');
    }

    setLoading(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
          AI Answer Review
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Get AI-powered feedback on your interview answer to improve your responses.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Question Input */}
          <div>
            <label htmlFor="question" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Interview Question
            </label>
            <textarea
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Paste the interview question here..."
              rows={4}
              maxLength={2000}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 resize-none"
              required
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {question.length}/2000 characters
            </p>
          </div>

          {/* Answer Input */}
          <div>
            <label htmlFor="answer" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Your Answer
            </label>
            <textarea
              id="answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type or paste your answer here..."
              rows={6}
              maxLength={5000}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 resize-none"
              required
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {answer.length}/5000 characters
            </p>
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
            disabled={loading || !question.trim() || !answer.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </span>
            ) : (
              'Get AI Feedback'
            )}
          </button>
        </form>

        {/* Feedback Display */}
        {feedback && (
          <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700 space-y-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Your Feedback</h3>

            {/* Overall Score */}
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900">
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-300">
                    {feedback.overallScore}/10
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Overall Score</p>
                <p className="text-lg text-slate-900 dark:text-white">{feedback.summary}</p>
              </div>
            </div>

            {/* Strengths */}
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <span className="text-green-600 dark:text-green-400">✓</span> Strengths
              </h4>
              <ul className="space-y-2">
                {feedback.strengths.map((strength, idx) => (
                  <li
                    key={idx}
                    className="flex gap-3 text-slate-700 dark:text-slate-300 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg"
                  >
                    <span className="text-green-600 dark:text-green-400 flex-shrink-0 font-bold">•</span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Improvements */}
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <span className="text-orange-600 dark:text-orange-400">↗</span> Areas for Improvement
              </h4>
              <ul className="space-y-2">
                {feedback.improvements.map((improvement, idx) => (
                  <li
                    key={idx}
                    className="flex gap-3 text-slate-700 dark:text-slate-300 bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg"
                  >
                    <span className="text-orange-600 dark:text-orange-400 flex-shrink-0 font-bold">•</span>
                    <span>{improvement}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Reset Button */}
            <button
              onClick={() => {
                setQuestion('');
                setAnswer('');
                setFeedback(null);
              }}
              className="w-full mt-4 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-semibold py-2 rounded-lg transition-colors"
            >
              Review Another Answer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
