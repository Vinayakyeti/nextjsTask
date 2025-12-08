"use client";

import { signInAction } from "@/app/actions/auth";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      const result = await signInAction(formData);

      if (result.error) {
        setError(result.error);
        setLoading(false);
      } else if (result.success) {
        // Successful login - redirect will happen via server action
        // Keep loading state to prevent user interaction
      }
    } catch (err) {
      setError("An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-900 p-8 rounded-xl">
        <h1 className="text-3xl font-bold text-center mb-8 text-white">Login</h1>

        {error && (
          <div className="bg-red-900 text-red-200 p-4 rounded-lg mb-6 text-sm border border-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold mb-2 text-white">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-zinc-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 border border-zinc-700 placeholder-zinc-500"
              placeholder="demo@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold mb-2 text-white">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-zinc-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 border border-zinc-700 placeholder-zinc-500"
              placeholder="password123"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-zinc-700 text-white font-semibold py-2.5 rounded-lg transition duration-200 disabled:cursor-not-allowed mt-6"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-zinc-400 mt-8">
          Don't have an account?{" "}
          <Link href="/signup" className="text-cyan-400 hover:text-cyan-300 font-semibold transition">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
