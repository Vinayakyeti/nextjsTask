"use client";

import { useEffect, useState } from "react";
import { getCollectionById, removeQuestionFromCollection } from "@/app/actions/collections";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Question = {
  id: string;
  title: string;
  difficulty: string;
  category: string;
  tags?: string[];
  companyName?: string;
};

type Collection = {
  id: string;
  name: string;
  description?: string;
  questions: Question[];
  createdAt: Date;
};

export default function ViewCollectionPage({ params }: { params: Promise<{ id: string }> }) {
  const [collection, setCollection] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [id, setId] = useState("");
  const router = useRouter();

  useEffect(() => {
    params.then(p => {
      setId(p.id);
      loadCollection(p.id);
    });
  }, [params]);

  const loadCollection = async (collectionId: string) => {
    try {
      setLoading(true);
      const result = await getCollectionById(collectionId);
      if (result.success && result.collection) {
        setCollection(result.collection);
      } else {
        setError(result.error || "Collection not found");
      }
    } catch (err) {
      setError("Failed to load collection");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveQuestion = async (questionId: string) => {
    if (!confirm("Remove this question from the collection?")) return;

    try {
      const result = await removeQuestionFromCollection(id, questionId);
      if (result.success) {
        setCollection(prev => 
          prev ? {
            ...prev,
            questions: prev.questions.filter(q => q.id !== questionId)
          } : null
        );
      } else {
        setError(result.error || "Failed to remove question");
      }
    } catch (err) {
      setError("An error occurred");
    }
  };

  const handleRefresh = async () => {
    if (id) {
      loadCollection(id);
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-white">Loading collection...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-900 text-red-200 p-4 rounded-lg border border-red-700">
        {error}
        <Link href="/collections" className="block mt-4 text-cyan-400 hover:text-cyan-300">
          Back to collections
        </Link>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="text-center py-8 text-white">
        Collection not found
        <Link href="/collections" className="block mt-4 text-cyan-400 hover:text-cyan-300">
          Back to collections
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-white">{collection.name}</h1>
          {collection.description && (
            <p className="text-zinc-400">{collection.description}</p>
          )}
          <p className="text-sm text-zinc-500 mt-2">
            Created {new Date(collection.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            className="bg-zinc-800 text-zinc-300 px-4 py-2 rounded-md hover:bg-zinc-700 border border-zinc-700"
          >
            Refresh
          </button>
          <Link
            href={`/collections/${id}/edit`}
            className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700"
          >
            Edit
          </Link>
          <Link
            href="/collections"
            className="bg-zinc-800 text-zinc-300 px-4 py-2 rounded-md hover:bg-zinc-700 border border-zinc-700"
          >
            Back
          </Link>
        </div>
      </div>

      <div className="bg-zinc-900 rounded-lg shadow p-6 border border-zinc-800">
        <h2 className="text-xl font-semibold mb-4 text-white">
          Questions ({collection.questions.length})
        </h2>

        {collection.questions.length === 0 ? (
          <p className="text-zinc-400 text-center py-8">
            No questions in this collection yet.
            <Link href={`/collections/${id}/edit`} className="block text-cyan-400 hover:text-cyan-300 mt-2">
              Add questions
            </Link>
          </p>
        ) : (
          <div className="space-y-3">
            {collection.questions.map(question => (
              <div
                key={question.id}
                className="flex justify-between items-start p-4 border border-zinc-800 rounded-lg hover:bg-zinc-800 bg-zinc-900"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-white">{question.title}</h3>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <span className="text-xs bg-zinc-800 text-zinc-300 px-2 py-1 rounded">
                      {question.difficulty}
                    </span>
                    <span className="text-xs bg-cyan-900 text-cyan-300 px-2 py-1 rounded">
                      {question.category}
                    </span>
                    {question.companyName && (
                      <span className="text-xs bg-purple-900 text-purple-300 px-2 py-1 rounded">
                        {question.companyName}
                      </span>
                    )}
                  </div>
                  {question.tags && question.tags.length > 0 && (
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {question.tags.map(tag => (
                        <span key={tag} className="text-xs text-zinc-400">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleRemoveQuestion(question.id)}
                  className="text-red-400 hover:text-red-300 text-sm ml-4"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
