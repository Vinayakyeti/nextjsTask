"use client";

import { useState, useEffect } from "react";
import { getUserQuestions, deleteQuestion } from "@/app/actions/questions";
import Link from "next/link";

type Question = {
  id: string;
  title: string;
  difficulty: string;
  category: string;
  tags: string[];
  createdAt: Date;
};

type PaginationInfo = {
  page: number;
  limit: number;
  total: number;
  pages: number;
};

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("ALL");
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });
  const [error, setError] = useState<string>("");

  useEffect(() => {
    loadQuestions(1);
  }, []);

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

  const filteredQuestions = questions.filter((q) => {
    if (filter === "ALL") return true;
    return q.difficulty === filter || q.category === filter;
  });

  if (loading && questions.length === 0) {
    return <div className="text-center py-12">Loading questions...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Interview Questions</h1>
        <Link
          href="/questions/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Add Question
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      <div className="flex gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setFilter("ALL")}
          className={`px-3 py-1 rounded transition ${filter === "ALL" ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("EASY")}
          className={`px-3 py-1 rounded transition ${filter === "EASY" ? "bg-green-600 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
        >
          Easy
        </button>
        <button
          onClick={() => setFilter("MEDIUM")}
          className={`px-3 py-1 rounded transition ${filter === "MEDIUM" ? "bg-yellow-600 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
        >
          Medium
        </button>
        <button
          onClick={() => setFilter("HARD")}
          className={`px-3 py-1 rounded transition ${filter === "HARD" ? "bg-red-600 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
        >
          Hard
        </button>
      </div>

      {filteredQuestions.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">No questions found</p>
          <Link
            href="/questions/new"
            className="text-blue-600 hover:underline"
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
                className="bg-white p-4 rounded-lg shadow border hover:shadow-md transition"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">
                      {question.title}
                    </h3>
                    <div className="flex gap-2 mb-2 flex-wrap">
                      <span
                        className={`px-2 py-1 text-xs rounded font-medium ${
                          question.difficulty === "EASY"
                            ? "bg-green-100 text-green-700"
                            : question.difficulty === "MEDIUM"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {question.difficulty}
                      </span>
                      <span className="px-2 py-1 text-xs rounded font-medium bg-blue-100 text-blue-700">
                        {question.category}
                      </span>
                    </div>
                    {question.tags.length > 0 && (
                      <div className="flex gap-1 flex-wrap">
                        {question.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-600"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleDelete(question.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium transition"
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
          <div className="flex justify-between items-center mt-8 pt-6 border-t">
            <div className="text-sm text-gray-600">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} questions
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => loadQuestions(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-3 py-2 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                aria-label="Previous page"
              >
                Previous
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(pagination.pages, 5) }).map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => loadQuestions(i + 1)}
                    className={`px-3 py-2 rounded-md transition ${
                      pagination.page === i + 1
                        ? "bg-blue-600 text-white"
                        : "border hover:bg-gray-50"
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
                className="px-3 py-2 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
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
