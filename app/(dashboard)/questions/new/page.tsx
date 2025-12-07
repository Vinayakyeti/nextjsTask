"use client";

import { useState } from "react";
import { createQuestion } from "@/app/actions/questions";
import { useRouter } from "next/navigation";

export default function NewQuestionPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState<"EASY" | "MEDIUM" | "HARD">("MEDIUM");
  const [category, setCategory] = useState<"TECHNICAL" | "BEHAVIORAL" | "SYSTEM_DESIGN" | "CODING">("TECHNICAL");
  const [tags, setTags] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("difficulty", difficulty);
      formData.append("category", category);
      formData.append("tags", tags);
      const result = await createQuestion(formData);

      if (result.error) {
        setError(result.error);
      } else {
        router.refresh();
        router.push("/questions");
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
        <h1 className="text-3xl font-bold mb-6 text-white">Add New Question</h1>

        {error && (
          <div className="bg-red-900 text-red-200 p-4 rounded-lg mb-4 text-sm border border-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 bg-zinc-900 p-6 rounded-lg shadow border border-zinc-800">
          <div>
          <label htmlFor="title" className="block text-sm font-semibold mb-2 text-white">
            Question Title * <span className="text-zinc-400 text-xs">(Min: 5 characters, Max: 200)</span>
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={200}
            className="w-full px-4 py-2.5 bg-zinc-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 border border-zinc-700 placeholder-zinc-500"
            placeholder="e.g., Two Sum Problem"
          />
          <p className="text-xs text-zinc-400 mt-1">{title.length}/200 characters</p>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-semibold mb-2 text-white">
            Description * <span className="text-zinc-400 text-xs">(Min: 10 characters, Max: 5000)</span>
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={6}
            maxLength={5000}
            className="w-full px-4 py-2.5 bg-zinc-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 border border-zinc-700 placeholder-zinc-500"
            placeholder="Describe the problem, constraints, and examples..."
          />
          <p className="text-xs text-zinc-400 mt-1">{description.length}/5000 characters</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="difficulty" className="block text-sm font-semibold mb-2 text-white">
              Difficulty *
            </label>
            <select
              id="difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as any)}
              className="w-full px-4 py-2.5 bg-zinc-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 border border-zinc-700"
            >
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-semibold mb-2 text-white">
              Category *
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full px-4 py-2.5 bg-zinc-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 border border-zinc-700"
            >
              <option value="TECHNICAL">Technical</option>
              <option value="BEHAVIORAL">Behavioral</option>
              <option value="SYSTEM_DESIGN">System Design</option>
              <option value="CODING">Coding</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm font-semibold mb-2 text-white">
            Tags
          </label>
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full px-4 py-2.5 bg-zinc-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 border border-zinc-700 placeholder-zinc-500"
            placeholder="arrays, hash-table, dynamic-programming (comma-separated)"
          />
          <p className="text-xs text-zinc-400 mt-1">
            Separate tags with commas
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-cyan-600 hover:bg-cyan-700 disabled:bg-zinc-700 text-white font-semibold px-6 py-2 rounded-lg transition disabled:cursor-not-allowed"
          >
            {loading ? "Creating..." : "Create Question"}
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
