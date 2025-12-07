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
      <nav className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-14 md:h-16">
            <Link href="/dashboard" className="text-lg md:text-xl font-bold text-white hover:text-cyan-400 transition flex-shrink-0">
              Interview Prep Hub
            </Link>
            <div className="hidden md:flex gap-6">
              <Link href="/dashboard" className="text-zinc-300 hover:text-white transition text-sm">
                Dashboard
              </Link>
              <Link href="/questions" className="text-zinc-300 hover:text-white transition text-sm">
                Questions
              </Link>
              <Link href="/collections" className="text-zinc-300 hover:text-white transition text-sm">
                Collections
              </Link>
              <Link href="/ai-review" className="text-zinc-300 hover:text-white font-medium transition text-sm">
                ✨ AI Review
              </Link>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <span className="text-xs md:text-sm text-zinc-300 hidden sm:inline truncate max-w-[150px]">{session.user?.email}</span>
              <LogoutButton />
            </div>
          </div>
          {/* Mobile navigation */}
          <div className="md:hidden flex gap-3 pb-3 overflow-x-auto">
            <Link href="/dashboard" className="text-zinc-300 hover:text-white transition text-sm whitespace-nowrap px-2 py-1">
              Dashboard
            </Link>
            <Link href="/questions" className="text-zinc-300 hover:text-white transition text-sm whitespace-nowrap px-2 py-1">
              Questions
            </Link>
            <Link href="/collections" className="text-zinc-300 hover:text-white transition text-sm whitespace-nowrap px-2 py-1">
              Collections
            </Link>
            <Link href="/ai-review" className="text-zinc-300 hover:text-white font-medium transition text-sm whitespace-nowrap px-2 py-1">
              ✨ AI Review
            </Link>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-4 md:py-6 px-3 sm:px-4 lg:px-8">
        {children}
      </main>
    </div>
  );
}
