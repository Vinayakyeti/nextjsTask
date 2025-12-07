"use client";

import { signUpAction } from "@/app/actions/auth";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Password validation checks
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasMinLength = password.length >= 8;
  const hasNumber = /[0-9]/.test(password);
  const isPasswordValid = hasUpperCase && hasLowerCase && hasMinLength && hasNumber;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      const result = await signUpAction(formData);

      if (result.error) {
        setError(result.error);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-900 p-8 rounded-xl">
        <h1 className="text-3xl font-bold text-center mb-8 text-white">Create Account</h1>

        {error && (
          <div className="bg-red-900 text-red-200 p-4 rounded-lg mb-6 text-sm border border-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold mb-2 text-white">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-zinc-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 border border-zinc-700 placeholder-zinc-500"
              placeholder="John Doe"
            />
          </div>

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
              placeholder="john@example.com"
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
              minLength={8}
              className="w-full px-4 py-2.5 bg-zinc-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 border border-zinc-700 placeholder-zinc-500"
              placeholder="Min. 8 characters"
            />
            
            {password && (
              <div className="mt-4 p-4 bg-zinc-800 rounded-lg border border-zinc-700">
                <p className="text-xs font-semibold text-white mb-3">Password requirements:</p>
                <div className="space-y-2.5">
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded flex items-center justify-center ${hasMinLength ? 'bg-emerald-500' : 'bg-zinc-700'}`}>
                      {hasMinLength && <span className="text-white text-xs font-bold">✓</span>}
                    </div>
                    <span className={`text-xs font-medium ${hasMinLength ? 'text-emerald-400' : 'text-zinc-400'}`}>
                      At least 8 characters
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded flex items-center justify-center ${hasUpperCase ? 'bg-emerald-500' : 'bg-zinc-700'}`}>
                      {hasUpperCase && <span className="text-white text-xs font-bold">✓</span>}
                    </div>
                    <span className={`text-xs font-medium ${hasUpperCase ? 'text-emerald-400' : 'text-zinc-400'}`}>
                      Uppercase letter (A-Z)
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded flex items-center justify-center ${hasLowerCase ? 'bg-emerald-500' : 'bg-zinc-700'}`}>
                      {hasLowerCase && <span className="text-white text-xs font-bold">✓</span>}
                    </div>
                    <span className={`text-xs font-medium ${hasLowerCase ? 'text-emerald-400' : 'text-zinc-400'}`}>
                      Lowercase letter (a-z)
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded flex items-center justify-center ${hasNumber ? 'bg-emerald-500' : 'bg-zinc-700'}`}>
                      {hasNumber && <span className="text-white text-xs font-bold">✓</span>}
                    </div>
                    <span className={`text-xs font-medium ${hasNumber ? 'text-emerald-400' : 'text-zinc-400'}`}>
                      Number (0-9)
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !isPasswordValid}
            className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-zinc-700 text-white font-semibold py-2.5 rounded-lg transition duration-200 disabled:cursor-not-allowed mt-6"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-sm text-zinc-400 mt-8">
          Already have an account?{" "}
          <Link href="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold transition">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
