"use client";

import { useState, useEffect } from "react";
import { createCollection, addQuestionToCollection } from "@/app/actions/collections";
import { getUserQuestions } from "@/app/actions/questions";
import { useRouter } from "next/navigation";

type Question = {
  id: string;
  title: string;
  difficulty: string;
  category: string;
  companyName?: string;
};

export default function NewCollectionPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [availableQuestions, setAvailableQuestions] = useState<Question[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [questionsLoading, setQuestionsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      setQuestionsLoading(true);
      const result = await getUserQuestions(1, 100);
      if (result.success && result.questions) {
        setAvailableQuestions(result.questions);
      } else {
        setError('Failed to load questions');
      }
    } catch (err) {
      setError('Failed to load questions: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setQuestionsLoading(false);
    }
  };

  const toggleQuestion = (questionId: string) => {
    setSelectedQuestions(prev => 
      prev.includes(questionId) 
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      if (description) formData.append("description", description);
      const result = await createCollection(formData);

      if (result.error) {
        setError(result.error);
      } else {
        // Add selected questions to collection
        if (result.collectionId && selectedQuestions.length > 0) {
          for (const questionId of selectedQuestions) {
            await addQuestionToCollection(result.collectionId, questionId);
          }
        }
        router.push("/collections");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-6 text-white">Create New Collection</h1>

        {error && (
          <div className="bg-red-900 text-red-200 p-4 rounded-lg mb-4 text-sm border border-red-700">
            {error}
          </div>
        )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-zinc-900 p-6 rounded-lg shadow border border-zinc-800">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold mb-2 text-white">
            Collection Name *
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-2.5 bg-zinc-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 border border-zinc-700 placeholder-zinc-500"
            placeholder="e.g., Top 50 Coding Questions"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-semibold mb-2 text-white">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-4 py-2.5 bg-zinc-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 border border-zinc-700 placeholder-zinc-500"
            placeholder="What is this collection about?"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-3 text-white">Add Questions</label>
          {questionsLoading ? (
            <p className="text-zinc-400 text-sm">Loading questions...</p>
          ) : availableQuestions.length === 0 ? (
            <div className="border border-zinc-700 rounded-lg p-4 bg-zinc-800">
              <p className="text-zinc-400 text-sm mb-3">No questions available yet.</p>
              <p className="text-zinc-500 text-xs">
                You need to create questions first. Go to the <a href="/questions/new" className="text-cyan-400 hover:underline">Questions page</a> to create one.
              </p>
            </div>
          ) : (
            <div className="border border-zinc-700 rounded-lg p-4 max-h-96 overflow-y-auto space-y-2 bg-zinc-800">
              {availableQuestions.map(question => (
                <div key={question.id} className="flex items-start gap-3 p-3 hover:bg-zinc-700 rounded cursor-pointer transition" onClick={() => toggleQuestion(question.id)}>
                  <input
                    type="checkbox"
                    checked={selectedQuestions.includes(question.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      toggleQuestion(question.id);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-5 h-5 text-cyan-600 rounded border border-zinc-600 cursor-pointer mt-0.5 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">{question.title}</p>
                    <p className="text-xs text-zinc-400">
                      {question.category} • {question.difficulty}
                      {question.companyName && ` • ${question.companyName}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {selectedQuestions.length > 0 && (
            <p className="text-sm text-cyan-400 mt-2">{selectedQuestions.length} question(s) selected</p>
          )}
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-cyan-600 hover:bg-cyan-700 disabled:bg-zinc-700 text-white font-semibold px-6 py-2 rounded-lg transition disabled:cursor-not-allowed"
          >
            {loading ? "Creating..." : "Create Collection"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-6 py-2 rounded-lg transition border border-zinc-700"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
    </div>
  );
}
