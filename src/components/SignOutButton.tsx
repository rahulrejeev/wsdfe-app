"use client";

export function SignOutButton() {
  async function handleSignOut() {
    await fetch("/api/auth/login", { method: "DELETE" });
    window.location.href = "/";
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="rounded-xl px-4 py-2 text-sm font-medium text-slate-500"
    >
      Sign out
    </button>
  );
}
