"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, User, Loader2 } from "lucide-react";

// Inner component — uses useSearchParams so must be inside <Suspense>
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(
    error ? "Invalid credentials. Please try again." : null
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError(null);

    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (result?.error) {
      setAuthError("Invalid credentials. Please try again.");
      setIsLoading(false);
    } else {
      router.push("/admin/products");
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="username" className="block text-gray-700 font-medium">
          Administrator Username
        </label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            id="username"
            type="text"
            required
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full pl-10 h-12 rounded-md bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D61B78] focus:border-transparent"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="block text-gray-700 font-medium">
          Authorization Key
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            id="password"
            type="password"
            required
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 h-12 rounded-md bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D61B78] focus:border-transparent"
          />
        </div>
      </div>

      {authError && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm font-medium border border-red-100">
          {authError}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full h-12 text-lg font-semibold bg-[#D61B78] hover:bg-[#c0176b] disabled:opacity-60 text-white rounded-md transition-colors shadow-sm flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <><Loader2 className="w-5 h-5 animate-spin" /> Authenticating...</>
        ) : (
          "Authenticate & Enter"
        )}
      </button>
    </form>
  );
}

// Outer page wrapper — provides the Suspense boundary
export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#F4F4F4] flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="bg-[#2B3945] p-6 text-center border-b-4 border-[#D61B78]">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            SECURE ADMIN LOGIN
          </h1>
          <p className="text-[#C6A75E] text-sm mt-1 uppercase tracking-wider font-semibold">
            Shree Umiya Enterprise
          </p>
        </div>

        <div className="p-8">
          <p className="text-gray-500 mb-6 text-center text-sm">
            Enter your authorized management credentials to access the B2B catalog dashboard.
          </p>
          <Suspense fallback={<div className="h-48 flex items-center justify-center text-gray-400 text-sm">Loading...</div>}>
            <LoginForm />
          </Suspense>
        </div>

        <div className="bg-gray-50 p-4 text-center text-xs text-gray-400 border-t border-gray-100">
          This is a protected system. Unauthorized access is strictly prohibited.
        </div>
      </div>
    </div>
  );
}
