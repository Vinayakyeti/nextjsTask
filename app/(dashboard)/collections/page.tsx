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
    return <div>Loading collections...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Question Collections</h1>
        <Link
          href="/collections/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          New Collection
        </Link>
      </div>

      {collections.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">No collections found</p>
          <Link
            href="/collections/new"
            className="text-blue-600 hover:underline"
          >
            Create your first collection
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {collections.map((collection) => (
            <div
              key={collection.id}
              className="bg-white p-6 rounded-lg shadow border"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">
                    {collection.name}
                  </h3>
                  {collection.description && (
                    <p className="text-gray-600 mb-3">
                      {collection.description}
                    </p>
                  )}
                  <p className="text-sm text-gray-500">
                    {collection.questionIds.length} question
                    {collection.questionIds.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/collections/${collection.id}`}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    View
                  </Link>
                  <Link
                    href={`/collections/${collection.id}/edit`}
                    className="text-green-600 hover:underline text-sm"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(collection.id)}
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
