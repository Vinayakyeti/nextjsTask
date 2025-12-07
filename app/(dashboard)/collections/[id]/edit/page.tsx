"use client";

import { useEffect, useState } from "react";
import { getCollectionById, updateCollection, addQuestionToCollection, removeQuestionFromCollection } from "@/app/actions/collections";
import { getUserQuestions } from "@/app/actions/questions";
import { useRouter } from "next/navigation";

type Question = {
  id: string;
  title: string;
  difficulty: string;
  category: string;
  tags: string[];
  companyName: string | null;
};

type Collection = {
  id: string;
  name: string;
  description: string | null;
  questions: Question[];
  createdAt: Date;
};

export default function EditCollectionPage({ params }: { params: Promise<{ id: string }> }) {
  const [collection, setCollection] = useState<Collection | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [availableQuestions, setAvailableQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [id, setId] = useState("");
  const router = useRouter();

  useEffect(() => {
    params.then(p => {
      setId(p.id);
      loadCollection(p.id);
      loadAvailableQuestions();
    });
  }, [params]);

  const loadCollection = async (collectionId: string) => {
    try {
      const result = await getCollectionById(collectionId);
      if (result.success && result.collection) {
        setCollection(result.collection);
        setName(result.collection.name);
        setDescription(result.collection.description || "");
        setSelectedQuestions(result.collection.questions.map(q => q.id));
      } else {
        setError(result.error || "Collection not found");
      }
    } catch (err) {
      setError("Failed to load collection");
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableQuestions = async () => {
    try {
      setQuestionsLoading(true);
      const result = await getUserQuestions(1, 1000);
      if (result.success && result.questions) {
        setAvailableQuestions(result.questions);
      }
    } catch (err) {
      // Failed to load questions
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
    setUpdating(true);

    try {
      // Update collection details
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      
      const updateResult = await updateCollection(id, formData);
      if (!updateResult.success) {
        setError(updateResult.error || "Failed to update collection");
        return;
      }

      // Handle question additions/removals
      const currentQuestionIds = collection?.questions.map(q => q.id) || [];
      
      // Remove questions that were deselected
      for (const questionId of currentQuestionIds) {
        if (!selectedQuestions.includes(questionId)) {
          await removeQuestionFromCollection(id, questionId);
        }
      }

      // Add newly selected questions
      for (const questionId of selectedQuestions) {
        if (!currentQuestionIds.includes(questionId)) {
          await addQuestionToCollection(id, questionId);
        }
      }

      router.push(`/collections/${id}`);
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-white">Loading collection...</div>;
  }

  if (error && !collection) {
    return (
      <div className="bg-red-900 text-red-200 p-4 rounded-lg border border-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-white">Edit Collection</h1>

      {error && (
        <div className="bg-red-900 text-red-200 p-3 rounded mb-4 text-sm border border-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-zinc-900 p-6 rounded-lg shadow border border-zinc-800">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1 text-white">
            Collection Name *
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-zinc-800 text-white border-zinc-700 placeholder-zinc-500"
            placeholder="e.g., Top 50 Coding Questions"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1 text-white">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-zinc-800 text-white border-zinc-700 placeholder-zinc-500"
            placeholder="What is this collection about?"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-3 text-white">Questions in Collection</label>
          {questionsLoading ? (
            <p className="text-zinc-400 text-sm">Loading questions...</p>
          ) : availableQuestions.length === 0 ? (
            <p className="text-zinc-400 text-sm">No questions available</p>
          ) : (
            <div className="border rounded-md p-4 max-h-96 overflow-y-auto space-y-2 border-zinc-700 bg-zinc-800">
              {availableQuestions.map(question => (
                <div key={question.id} className="flex items-start gap-3 p-3 hover:bg-zinc-700 rounded cursor-pointer transition" onClick={() => toggleQuestion(question.id)}>
                  <input
                    type="checkbox"
                    checked={selectedQuestions.includes(question.id)}
                    onChange={() => toggleQuestion(question.id)}
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
            disabled={updating}
            className="bg-cyan-600 text-white px-6 py-2 rounded-md hover:bg-cyan-700 disabled:bg-zinc-700 disabled:cursor-not-allowed"
          >
            {updating ? "Updating..." : "Update Collection"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-zinc-800 text-zinc-300 px-6 py-2 rounded-md hover:bg-zinc-700 border border-zinc-700"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
