"use client";

import { useState, useEffect } from "react";
import { getUserQuestions, deleteQuestion } from "@/app/actions/questions";
import { addQuestionToCollection } from "@/app/actions/collections";
import { getUserCollections } from "@/app/actions/collections";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Question = {
  id: string;
  title: string;
  difficulty: string;
  category: string;
  tags: string[];
  createdAt: Date;
};

type Collection = {
  id: string;
  name: string;
};

type PaginationInfo = {
  page: number;
  limit: number;
  total: number;
  pages: number;
};

export default function QuestionsPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("ALL");
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });
  const [error, setError] = useState<string>("");
  const [addingToCollection, setAddingToCollection] = useState<string | null>(null);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [showCollectionMenu, setShowCollectionMenu] = useState<string | null>(null);

  useEffect(() => {
    router.refresh();
    loadQuestions(1);
    loadCollections();
  }, [router]);

  const loadCollections = async () => {
    try {
      const result = await getUserCollections();
      if (result.success && result.collections) {
        setCollections(result.collections);
      }
    } catch (err) {
      // Failed to load collections
    }
  };

  const loadQuestions = async (page: number) => {
    setLoading(true);
    setError("");
    const result = await getUserQuestions(page, 20);
    if (result.success && result.questions) {
      setQuestions(result.questions);
      if (result.pagination) {
        setPagination(result.pagination);
      }
    } else {
      setError(result.error || "Failed to load questions");
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this question?")) return;
    
    const result = await deleteQuestion(id);
    if (result.success) {
      setQuestions((prev) => prev.filter((q) => q.id !== id));
      setPagination(prev => ({ ...prev, total: prev.total - 1 }));
    } else {
      setError(result.error || "Failed to delete question");
    }
  };

  const handleAddToCollection = async (questionId: string, collectionId: string) => {
    try {
      setAddingToCollection(`${questionId}-${collectionId}`);
      const result = await addQuestionToCollection(collectionId, questionId);
      if (result.success) {
        setError("");
        setShowCollectionMenu(null);
        alert("Question added to collection successfully!");
      } else {
        setError(result.error || "Failed to add question to collection");
        alert("Error: " + (result.error || "Failed to add question to collection"));
      }
    } catch (err) {
      setError("An error occurred while adding question to collection");
      alert("Error: An error occurred while adding question to collection");
    } finally {
      setAddingToCollection(null);
    }
  };

  const filteredQuestions = questions.filter((q) => {
    if (filter === "ALL") return true;
    return q.difficulty === filter || q.category === filter;
  });

  if (loading && questions.length === 0) {
    return <div className="text-center py-12 text-white">Loading questions...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Interview Questions</h1>
        <Link
          href="/questions/new"
          className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg font-semibold transition"
        >
          Add Question
        </Link>
      </div>

      {error && (
        <div className="bg-red-900 text-red-200 p-4 rounded-lg mb-6 border border-red-700">
          {error}
        </div>
      )}

      <div className="flex gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setFilter("ALL")}
          className={`px-3 py-1 rounded transition ${filter === "ALL" ? "bg-cyan-600 text-white" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"}`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("EASY")}
          className={`px-3 py-1 rounded transition ${filter === "EASY" ? "bg-emerald-600 text-white" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"}`}
        >
          Easy
        </button>
        <button
          onClick={() => setFilter("MEDIUM")}
          className={`px-3 py-1 rounded transition ${filter === "MEDIUM" ? "bg-yellow-600 text-white" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"}`}
        >
          Medium
        </button>
        <button
          onClick={() => setFilter("HARD")}
          className={`px-3 py-1 rounded transition ${filter === "HARD" ? "bg-red-600 text-white" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"}`}
        >
          Hard
        </button>
      </div>

      {filteredQuestions.length === 0 ? (
        <div className="text-center py-12 bg-zinc-900 rounded-lg border border-zinc-800">
          <p className="text-zinc-400 mb-4">No questions found</p>
          <Link
            href="/questions/new"
            className="text-cyan-400 hover:text-cyan-300 font-semibold transition"
          >
            Create your first question
          </Link>
        </div>
      ) : (
        <>
          <div className="grid gap-4 mb-6">
            {filteredQuestions.map((question) => (
              <div
                key={question.id}
                className="bg-zinc-900 p-4 rounded-lg shadow border border-zinc-800 hover:border-zinc-700 transition"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2 text-white">
                      {question.title}
                    </h3>
                    <div className="flex gap-2 mb-2 flex-wrap">
                      <span
                        className={`px-2 py-1 text-xs rounded font-medium ${
                          question.difficulty === "EASY"
                            ? "bg-emerald-900 text-emerald-300"
                            : question.difficulty === "MEDIUM"
                            ? "bg-yellow-900 text-yellow-300"
                            : "bg-red-900 text-red-300"
                        }`}
                      >
                        {question.difficulty}
                      </span>
                      <span className="px-2 py-1 text-xs rounded font-medium bg-cyan-900 text-cyan-300">
                        {question.category}
                      </span>
                    </div>
                    {question.tags.length > 0 && (
                      <div className="flex gap-1 flex-wrap">
                        {question.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 text-xs rounded bg-zinc-800 text-zinc-400"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4 relative">
                    <div className="relative">
                      <button
                        onClick={() => setShowCollectionMenu(showCollectionMenu === question.id ? null : question.id)}
                        className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition"
                        aria-label="Add to collection"
                      >
                        Add to Collection
                      </button>
                      {showCollectionMenu === question.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg z-10">
                          {collections.length === 0 ? (
                            <div className="p-3 text-zinc-400 text-sm">
                              No collections available.
                              <Link href="/collections/new" className="block text-cyan-400 hover:text-cyan-300 mt-2">
                                Create a collection
                              </Link>
                            </div>
                          ) : (
                            <div className="py-1">
                              {collections.map(collection => (
                                <button
                                  key={collection.id}
                                  onClick={() => handleAddToCollection(question.id, collection.id)}
                                  disabled={addingToCollection === `${question.id}-${collection.id}`}
                                  className="w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                >
                                  {addingToCollection === `${question.id}-${collection.id}` ? "Adding..." : collection.name}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleDelete(question.id)}
                      className="text-red-400 hover:text-red-300 text-sm font-medium transition"
                      aria-label="Delete question"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-zinc-800">
            <div className="text-sm text-zinc-400">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} questions
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => loadQuestions(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-3 py-2 border border-zinc-700 rounded-lg text-zinc-300 hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
                aria-label="Previous page"
              >
                Previous
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(pagination.pages, 5) }).map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => loadQuestions(i + 1)}
                    className={`px-3 py-2 rounded-lg transition ${
                      pagination.page === i + 1
                        ? "bg-cyan-600 text-white"
                        : "border border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                    }`}
                    aria-label={`Page ${i + 1}`}
                    aria-current={pagination.page === i + 1 ? "page" : undefined}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() => loadQuestions(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="px-3 py-2 border border-zinc-700 rounded-lg text-zinc-300 hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
                aria-label="Next page"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
