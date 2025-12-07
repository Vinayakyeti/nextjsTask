import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/dashboard" className="text-xl font-bold hover:text-blue-600">
                Interview Prep Hub
              </Link>
              <div className="flex gap-6">
                <Link href="/dashboard" className="text-gray-700 hover:text-blue-600">
                  Dashboard
                </Link>
                <Link href="/questions" className="text-gray-700 hover:text-blue-600">
                  Questions
                </Link>
                <Link href="/collections" className="text-gray-700 hover:text-blue-600">
                  Collections
                </Link>
                <Link href="/generate-questions" className="text-gray-700 hover:text-blue-600 font-medium">
                  🤖 Generate
                </Link>
                <Link href="/ai-review" className="text-gray-700 hover:text-blue-600 font-medium">
                  ✨ AI Review
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-700">{session.user?.email}</span>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
