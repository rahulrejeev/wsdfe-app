"use client";

import { Suspense, useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { QrScanner } from "@/components/QrScanner";
import { ScanItemView } from "@/components/ScanItemView";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function getItemIdFromLocation(): string | null {
  const params = new URLSearchParams(window.location.search);
  const fromQuery = params.get("item");
  if (fromQuery && UUID_PATTERN.test(fromQuery)) {
    return fromQuery;
  }

  const fromPath = window.location.pathname.match(
    /^\/scan\/([0-9a-f-]{36})$/i,
  );
  if (fromPath) {
    return fromPath[1];
  }

  return null;
}

function ScanPageContent() {
  const [itemId, setItemId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setItemId(getItemIdFromLocation());
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <div className="px-4 py-12 text-center text-slate-500">Loading…</div>
    );
  }

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
