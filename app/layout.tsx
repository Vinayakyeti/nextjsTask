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
      <body className="antialiased flex flex-col min-h-screen bg-black text-white">
        <main className="flex-1">{children}</main>
        <footer className="bg-zinc-900 text-white py-6 mt-auto border-t border-zinc-800">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-sm mb-2">
              Built by <span className="font-semibold">Vinayak</span>
            </p>
            <div className="flex justify-center gap-6">
              <a
                href="https://github.com/Vinayakyeti"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-white transition"
              >
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/vinayak-tiwari15/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-white transition"
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
