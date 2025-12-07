import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Interview Prep Hub",
  description: "Prepare for technical interviews with organized questions, practice tracking, and AI-powered feedback",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased flex flex-col min-h-screen">
        <main className="flex-1">{children}</main>
        <footer className="bg-gray-900 text-white py-6 mt-auto">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-sm mb-2">
              Built by <span className="font-semibold">YOUR_NAME</span>
            </p>
            <div className="flex justify-center gap-6">
              <a
                href="YOUR_GITHUB_URL"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition"
              >
                GitHub
              </a>
              <a
                href="YOUR_LINKEDIN_URL"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
