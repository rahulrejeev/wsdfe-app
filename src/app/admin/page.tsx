import Link from "next/link";
import { AdminTable } from "@/components/AdminTable";
import { Header } from "@/components/Header";
import { SignOutButton } from "@/components/SignOutButton";
import { createServiceClient } from "@/lib/supabase/server";
import type { InventoryItem } from "@/lib/types";

export default async function AdminPage() {
  let items: InventoryItem[] = [];

  try {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("inventory_items")
      .select("*")
      .order("name", { ascending: true });
    items = data ?? [];
  } catch {
    items = [];
  }

  return (
    <div className="min-h-full bg-slate-50">
      <Header title="Stock spreadsheet" backHref="/" />
      <main className="mx-auto max-w-5xl space-y-4 px-4 py-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-600">
            Add lines, edit quantities, and print QR codes for each box.
          </p>
          <div className="flex gap-2">
            <a
              href="/api/items/export"
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700"
            >
              Export CSV
            </a>
            <SignOutButton />
          </div>
        </div>
        <AdminTable initialItems={items} />
        <p className="text-center text-sm text-slate-500">
          Engineers scan QR codes on{" "}
          <Link href="/scan" className="font-medium text-amber-600">
            the scan page
          </Link>
          .
        </p>
      </main>
    </div>
  );
}
