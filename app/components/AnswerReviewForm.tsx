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
    
    setError(null);
    setFeedback(null);
    setLoading(true);

    try {
      const result = await getAnswerFeedback(question, answer);

      if (result.success && result.feedback) {
        setFeedback(result.feedback);
      } else {
        setError(result.error || 'Failed to generate feedback');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-zinc-900 rounded-lg shadow-lg p-8 border border-zinc-800">
        <h2 className="text-2xl font-bold text-white mb-6">AI Answer Review</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="question" className="block text-sm font-medium text-white mb-2">
              Interview Question
            </label>
            <textarea
              id="question"
              name="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Enter the interview question..."
              className="w-full px-4 py-2 border border-zinc-700 rounded-lg bg-zinc-800 text-white placeholder-zinc-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              rows={3}
            />
            <p className="text-xs text-zinc-400 mt-1">{question.length}/200 characters</p>
          </div>

          <div>
            <label htmlFor="answer" className="block text-sm font-medium text-white mb-2">
              Your Answer
            </label>
            <textarea
              id="answer"
              name="answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Enter your answer to the question..."
              className="w-full px-4 py-2 border border-zinc-700 rounded-lg bg-zinc-800 text-white placeholder-zinc-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              rows={5}
            />
            <p className="text-xs text-zinc-400 mt-1">{answer.length}/2000 characters</p>
          </div>

          <button
            type="submit"
            disabled={loading || !question.trim() || !answer.trim()}
            className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-zinc-700 text-white font-medium py-2 px-4 rounded-lg transition"
          >
            {loading ? 'Generating feedback...' : 'Get AI Feedback'}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-900 border border-red-700 rounded-lg">
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {feedback && (
          <div className="mt-8 space-y-6">
            <div className="bg-cyan-900 border border-cyan-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-cyan-200 mb-2">Summary</h3>
              <p className="text-cyan-300">{feedback.summary}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-emerald-900 border border-emerald-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-emerald-200 mb-3">Strengths</h3>
                <ul className="space-y-2">
                  {feedback.strengths.map((strength, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-400 mt-1">✓</span>
                      <span className="text-emerald-300">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-yellow-900 border border-yellow-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-yellow-200 mb-3">Areas for Improvement</h3>
                <ul className="space-y-2">
                  {feedback.improvements.map((improvement, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-yellow-400 mt-1">→</span>
                      <span className="text-yellow-300">{improvement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-purple-900 border border-purple-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-purple-200 mb-4">Overall Score</h3>
              <div className="flex items-center gap-4">
                <div className="text-5xl font-bold text-purple-400">{feedback.overallScore}</div>
                <div className="flex-1">
                  <div className="w-full bg-purple-800 rounded-full h-4">
                    <div
                      className="bg-purple-400 h-4 rounded-full"
                      style={{ width: `${(feedback.overallScore / 10) * 100}%` }}
                    />
                  </div>
                  <p className="text-sm text-purple-300 mt-2">out of 10</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
