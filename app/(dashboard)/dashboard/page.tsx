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
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      <p className="text-gray-600 mb-8">Welcome back, {session?.user?.name || "User"}!</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Questions</h3>
          <p className="text-3xl font-bold text-blue-600">{questionsCount}</p>
          <Link href="/questions" className="text-sm text-blue-600 hover:underline mt-2 inline-block">
            View all →
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Collections</h3>
          <p className="text-3xl font-bold text-green-600">{collectionsCount}</p>
          <Link href="/collections" className="text-sm text-green-600 hover:underline mt-2 inline-block">
            View all →
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Practice Sessions</h3>
          <p className="text-3xl font-bold text-purple-600">0</p>
          <span className="text-sm text-gray-400 mt-2 inline-block">Coming soon</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <Link
              href="/questions/new"
              className="block px-4 py-3 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition"
            >
              + Add New Question
            </Link>
            <Link
              href="/collections/new"
              className="block px-4 py-3 bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition"
            >
              + Create Collection
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <h2 className="text-lg font-semibold mb-4">Getting Started</h2>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>✓ Create your first question to track interview problems</li>
            <li>✓ Organize questions into collections by topic or company</li>
            <li>✓ Practice with AI feedback (coming soon)</li>
            <li>✓ Track your progress over time</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
