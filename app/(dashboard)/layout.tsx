import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LogoutButton } from "@/app/components/LogoutButton";

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
    <div className="min-h-screen bg-black">
      <nav className="bg-zinc-900 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/dashboard" className="text-xl font-bold text-white hover:text-cyan-400 transition">
                Interview Prep Hub
              </Link>
              <div className="flex gap-6">
                <Link href="/dashboard" className="text-zinc-300 hover:text-white transition">
                  Dashboard
                </Link>
                <Link href="/questions" className="text-zinc-300 hover:text-white transition">
                  Questions
                </Link>
                <Link href="/collections" className="text-zinc-300 hover:text-white transition">
                  Collections
                </Link>
                <Link href="/ai-review" className="text-zinc-300 hover:text-white font-medium transition">
                  ✨ AI Review
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-zinc-300">{session.user?.email}</span>
              <LogoutButton />
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
