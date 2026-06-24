"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Header } from "@/components/Header";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    setLoading(false);

    if (!response.ok) {
      setError("Incorrect password");
      return;
    }

    const next = searchParams.get("next") || "/admin";
    router.push(next);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-sm space-y-4">
      <label className="block">
        <span className="text-sm font-medium text-slate-700">Admin password</span>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
          autoComplete="current-password"
        />
      </label>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-slate-900 py-3 font-semibold text-white disabled:opacity-50"
      >
        Sign in
      </button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-full bg-slate-50">
      <Header title="Admin sign in" backHref="/" />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <Suspense fallback={<p className="text-center text-slate-500">Loading…</p>}>
          <LoginForm />
        </Suspense>
      </main>
    </div>
  );
}
