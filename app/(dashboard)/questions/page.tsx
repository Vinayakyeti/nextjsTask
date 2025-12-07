"use client";

import { useState, useEffect } from "react";
import { getUserQuestions, deleteQuestion } from "@/app/actions/questions";
import Link from "next/link";

type Question = {
  id: string;
  title: string;
  difficulty: string;
  category: string;
  company?: { name: string } | null;
  tags: string[];
  createdAt: Date;
};

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("ALL");

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    setLoading(true);
    const result = await getUserQuestions();
    if (result.success && result.questions) {
      setQuestions(result.questions);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this question?")) return;
    
    const result = await deleteQuestion(id);
    if (result.success) {
      setQuestions((prev) => prev.filter((q) => q.id !== id));
    }
  };

  const filteredQuestions = questions.filter((q) => {
    if (filter === "ALL") return true;
    return q.difficulty === filter || q.category === filter;
  });

  if (loading) {
    return <div>Loading questions...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Interview Questions</h1>
        <Link
          href="/questions/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Add Question
        </Link>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter("ALL")}
          className={`px-3 py-1 rounded ${filter === "ALL" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("EASY")}
          className={`px-3 py-1 rounded ${filter === "EASY" ? "bg-green-600 text-white" : "bg-gray-200"}`}
        >
          Easy
        </button>
        <button
          onClick={() => setFilter("MEDIUM")}
          className={`px-3 py-1 rounded ${filter === "MEDIUM" ? "bg-yellow-600 text-white" : "bg-gray-200"}`}
        >
          Medium
        </button>
        <button
          onClick={() => setFilter("HARD")}
          className={`px-3 py-1 rounded ${filter === "HARD" ? "bg-red-600 text-white" : "bg-gray-200"}`}
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
            Add your first question
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredQuestions.map((question) => (
            <div
              key={question.id}
              className="bg-white p-4 rounded-lg shadow border"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">
                    {question.title}
                  </h3>
                  <div className="flex gap-2 mb-2">
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        question.difficulty === "EASY"
                          ? "bg-green-100 text-green-700"
                          : question.difficulty === "MEDIUM"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {question.difficulty}
                    </span>
                    <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700">
                      {question.category}
                    </span>
                    {question.company && (
                      <span className="px-2 py-1 text-xs rounded bg-purple-100 text-purple-700">
                        {question.company.name}
                      </span>
                    )}
                  </div>
                  {question.tags.length > 0 && (
                    <div className="flex gap-1 flex-wrap">
                      {question.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/questions/${question.id}`}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    View
                  </Link>
                  <Link
                    href={`/questions/${question.id}/edit`}
                    className="text-green-600 hover:underline text-sm"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(question.id)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
