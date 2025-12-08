import Link from "next/link";
import { auth } from "@/auth";
import { getUserQuestions } from "@/app/actions/questions";
import { getUserCollections } from "@/app/actions/collections";

export default async function DashboardPage() {
  const session = await auth();
  const questionsResult = await getUserQuestions();
  const collectionsResult = await getUserCollections();

  const questionsCount = questionsResult.success ? questionsResult.questions?.length || 0 : 0;
  const collectionsCount = collectionsResult.success ? collectionsResult.collections?.length || 0 : 0;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2 text-white">Dashboard</h1>
      <p className="text-zinc-400 mb-8">Welcome back, {session?.user?.name || "User"}!</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-zinc-900 p-6 rounded-lg shadow border border-zinc-800">
          <h3 className="text-sm font-medium text-zinc-400 mb-2">Total Questions</h3>
          <p className="text-3xl font-bold text-cyan-400">{questionsCount}</p>
          <Link href="/questions" className="text-sm text-cyan-400 hover:text-cyan-300 mt-2 inline-block transition">
            View all →
          </Link>
        </div>

        <div className="bg-zinc-900 p-6 rounded-lg shadow border border-zinc-800">
          <h3 className="text-sm font-medium text-zinc-400 mb-2">Collections</h3>
          <p className="text-3xl font-bold text-emerald-400">{collectionsCount}</p>
          <Link href="/collections" className="text-sm text-emerald-400 hover:text-emerald-300 mt-2 inline-block transition">
            View all →
          </Link>
        </div>

        <div className="bg-zinc-900 p-6 rounded-lg shadow border border-zinc-800">
          <h3 className="text-sm font-medium text-zinc-400 mb-2">Practice Sessions</h3>
          <p className="text-3xl font-bold text-purple-400">0</p>
          <span className="text-sm text-zinc-500 mt-2 inline-block">Coming soon</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-zinc-900 p-6 rounded-lg shadow border border-zinc-800">
          <h2 className="text-lg font-semibold mb-4 text-white">Quick Actions</h2>
          <div className="space-y-2">
            <Link
              href="/questions/new"
              className="block px-4 py-3 bg-cyan-900 text-cyan-200 rounded-md hover:bg-cyan-800 transition"
            >
              + Add New Question
            </Link>
            <Link
              href="/collections/new"
              className="block px-4 py-3 bg-emerald-900 text-emerald-200 rounded-md hover:bg-emerald-800 transition"
            >
              + Create Collection
            </Link>
          </div>
        </div>

        <div className="bg-zinc-900 p-6 rounded-lg shadow border border-zinc-800">
          <h2 className="text-lg font-semibold mb-4 text-white">Getting Started</h2>
          <ul className="space-y-2 text-sm text-zinc-400">
            <li>✓ Create your first question to track interview problems</li>
            <li>✓ Organize questions into collections by topic or company</li>
            <li>✓ Track your progress over time</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
