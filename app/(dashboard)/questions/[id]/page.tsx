"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { getQuestionById } from "@/app/actions/questions";
import { addQuestionToCollection, getUserCollections } from "@/app/actions/collections";

type Question = {
  id: string;
  title: string;
  description: string | null;
  difficulty: string;
  category: string;
  tags: string[];
  companyName: string | null;
  createdAt: Date;
  userId: string;
};

type Collection = {
  id: string;
  name: string;
};

export default function ViewQuestionPage() {
  const router = useRouter();
  const params = useParams();
  const questionId = params.id as string;

  const [question, setQuestion] = useState<Question | null>(null);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCollectionMenu, setShowCollectionMenu] = useState(false);
  const [addingToCollection, setAddingToCollection] = useState<string | null>(null);

  useEffect(() => {
    loadQuestion();
    loadCollections();
  }, [questionId]);

  const loadQuestion = async () => {
    try {
      setLoading(true);
      const result = await getQuestionById(questionId);
      if (result.success && result.question) {
        setQuestion(result.question as Question);
      } else {
        setError(result.error || "Question not found");
      }
    } catch (err) {
      setError("Failed to load question");
    } finally {
      setLoading(false);
    }
  };

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

  const handleAddToCollection = async (collectionId: string) => {
    try {
      setAddingToCollection(collectionId);
      const result = await addQuestionToCollection(collectionId, questionId);
      if (result.success) {
        setError("");
        setShowCollectionMenu(false);
        alert("Question added to collection successfully!");
      } else {
        setError(result.error || "Failed to add question to collection");
      }
    } catch (err) {
      setError("Failed to add question to collection");
    } finally {
      setAddingToCollection(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-400"></div>
            <p className="text-zinc-400 mt-4">Loading question...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !question) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black p-6">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/questions"
            className="text-cyan-400 hover:text-cyan-300 font-semibold mb-6 inline-block transition"
          >
            ← Back to Questions
          </Link>
          <div className="bg-zinc-900 p-6 rounded-lg shadow border border-red-800">
            <p className="text-red-400 font-semibold">{error || "Question not found"}</p>
          </div>
        </div>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "EASY":
        return "bg-emerald-900 text-emerald-300";
      case "MEDIUM":
        return "bg-yellow-900 text-yellow-300";
      case "HARD":
        return "bg-red-900 text-red-300";
      default:
        return "bg-zinc-800 text-zinc-300";
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      TECHNICAL: "bg-blue-900 text-blue-300",
      BEHAVIORAL: "bg-purple-900 text-purple-300",
      SYSTEM_DESIGN: "bg-indigo-900 text-indigo-300",
      CODING: "bg-orange-900 text-orange-300",
    };
    return colors[category] || "bg-zinc-800 text-zinc-300";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <Link
            href="/questions"
            className="text-cyan-400 hover:text-cyan-300 font-semibold transition"
          >
            ← Back to Questions
          </Link>
          <Link
            href={`/questions/new?edit=${questionId}`}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg transition"
          >
            Edit Question
          </Link>
        </div>

        {/* Main Content */}
        <div className="bg-zinc-900 rounded-lg shadow border border-zinc-800 p-8 mb-8">
          {/* Title */}
          <h1 className="text-4xl font-bold text-white mb-6">{question.title}</h1>

          {/* Badges */}
          <div className="flex gap-3 mb-8 flex-wrap">
            <span
              className={`px-3 py-1 rounded-full font-medium text-sm ${getDifficultyColor(
                question.difficulty
              )}`}
            >
              {question.difficulty}
            </span>
            <span
              className={`px-3 py-1 rounded-full font-medium text-sm ${getCategoryColor(
                question.category
              )}`}
            >
              {question.category}
            </span>
            {question.companyName && (
              <span className="px-3 py-1 rounded-full font-medium text-sm bg-pink-900 text-pink-300">
                {question.companyName}
              </span>
            )}
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-zinc-300 mb-4">Description</h2>
            <div className="bg-zinc-800 rounded-lg p-6 text-zinc-200 whitespace-pre-wrap leading-relaxed border border-zinc-700">
              {question.description || "No description provided"}
            </div>
          </div>

          {/* Tags */}
          {question.tags && question.tags.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-zinc-300 mb-4">Tags</h2>
              <div className="flex gap-2 flex-wrap">
                {question.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-zinc-700 text-zinc-300 rounded-full text-sm font-medium hover:bg-zinc-600 transition"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="pt-6 border-t border-zinc-700">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-zinc-500">Created</p>
                <p className="text-zinc-200 font-semibold">
                  {new Date(question.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div>
                <p className="text-zinc-500">Question ID</p>
                <p className="text-zinc-200 font-semibold font-mono text-xs">{question.id}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Add to Collection Section */}
        <div className="bg-zinc-900 rounded-lg shadow border border-zinc-800 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Add to Collection</h2>
          <div className="relative">
            <button
              onClick={() => setShowCollectionMenu(!showCollectionMenu)}
              className="w-full px-4 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg transition text-left flex justify-between items-center"
            >
              <span>{showCollectionMenu ? "Select a Collection" : "Choose Collection"}</span>
              <span className="text-lg">{showCollectionMenu ? "▼" : "▶"}</span>
            </button>

            {showCollectionMenu && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg z-10">
                {collections.length === 0 ? (
                  <div className="p-4 text-zinc-400 text-sm">
                    No collections available.
                    <Link
                      href="/collections/new"
                      className="block text-cyan-400 hover:text-cyan-300 mt-2 font-semibold"
                    >
                      Create a collection
                    </Link>
                  </div>
                ) : (
                  <div className="py-1">
                    {collections.map((collection) => (
                      <button
                        key={collection.id}
                        onClick={() => handleAddToCollection(collection.id)}
                        disabled={addingToCollection === collection.id}
                        className="w-full text-left px-4 py-3 text-sm text-zinc-300 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                      >
                        {addingToCollection === collection.id ? "Adding..." : collection.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
