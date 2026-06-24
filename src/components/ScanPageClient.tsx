"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/Header";
import { QrScanner } from "@/components/QrScanner";
import { ScanItemView } from "@/components/ScanItemView";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function ScanPageContent() {
  const searchParams = useSearchParams();
  const itemParam = searchParams.get("item");
  const [itemId, setItemId] = useState<string | null>(null);

  useEffect(() => {
    if (itemParam && UUID_PATTERN.test(itemParam)) {
      setItemId(itemParam);
      return;
    }

    const pathMatch = window.location.pathname.match(
      /^\/scan\/([0-9a-f-]{36})$/i,
    );
    if (pathMatch) {
      setItemId(pathMatch[1]);
    }
  }, [itemParam]);

  if (itemId) {
    return (
      <>
        <Header title="Update stock" backHref="/scan" />
        <main className="mx-auto max-w-lg px-4 py-6">
          <ScanItemView itemId={itemId} />
        </main>
      </>
    );
  }

  return (
    <>
      <Header title="Scan stock" backHref="/" />
      <main className="mx-auto max-w-lg px-4 py-6">
        <p className="mb-4 text-sm text-slate-600">
          Point your camera at a box QR code to update stock.
        </p>
        <QrScanner />
      </main>
    </>
  );
}

export function ScanPageClient() {
  return (
    <div className="min-h-full bg-slate-50">
      <Suspense
        fallback={
          <div className="px-4 py-12 text-center text-slate-500">Loading…</div>
        }
      >
        <ScanPageContent />
      </Suspense>
    </div>
  );
}
