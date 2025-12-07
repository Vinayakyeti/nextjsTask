"use client";

import { useState, useEffect } from "react";
import { getUserCollections, deleteCollection } from "@/app/actions/collections";
import Link from "next/link";

type Collection = {
  id: string;
  name: string;
  description?: string | null;
  questionIds: string[];
  createdAt: Date;
};

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = async () => {
    setLoading(true);
    const result = await getUserCollections();
    if (result.success && result.collections) {
      setCollections(result.collections);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this collection?")) return;

    const result = await deleteCollection(id);
    if (result.success) {
      setCollections((prev) => prev.filter((c) => c.id !== id));
    }
  };

  if (loading) {
    return <div className="text-white">Loading collections...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Question Collections</h1>
        <Link
          href="/collections/new"
          className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg font-semibold transition"
        >
          New Collection
        </Link>
      </div>

      {collections.length === 0 ? (
        <div className="text-center py-12 bg-zinc-900 rounded-lg border border-zinc-800">
          <p className="text-zinc-400 mb-4">No collections found</p>
          <Link
            href="/collections/new"
            className="text-cyan-400 hover:text-cyan-300 font-semibold transition"
          >
            Create your first collection
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {collections.map((collection) => (
            <div
              key={collection.id}
              className="bg-zinc-900 p-6 rounded-lg shadow border border-zinc-800"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2 text-white">
                    {collection.name}
                  </h3>
                  {collection.description && (
                    <p className="text-zinc-400 mb-3">
                      {collection.description}
                    </p>
                  )}
                  <p className="text-sm text-zinc-500">
                    {collection.questionIds.length} question
                    {collection.questionIds.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/collections/${collection.id}`}
                    className="text-cyan-400 hover:text-cyan-300 text-sm font-semibold transition"
                  >
                    View
                  </Link>
                  <Link
                    href={`/collections/${collection.id}/edit`}
                    className="text-emerald-400 hover:text-emerald-300 text-sm font-semibold transition"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(collection.id)}
                    className="text-red-400 hover:text-red-300 text-sm font-semibold transition"
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
