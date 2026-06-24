"use client";

import { useCallback, useEffect, useState } from "react";
import type { InventoryItem } from "@/lib/types";
import { QuantityAdjuster } from "./QuantityAdjuster";

export function ScanItemView({ itemId }: { itemId: string }) {
  const [item, setItem] = useState<InventoryItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadItem = useCallback(async () => {
    setLoading(true);
    setError(null);

    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        const response = await fetch(`/api/items/${itemId}`);
        if (response.ok) {
          setItem(await response.json());
          setLoading(false);
          return;
        }
        if (response.status === 404) {
          setError("Item not found");
          setLoading(false);
          return;
        }
      } catch {
        if (attempt < 2) {
          await new Promise((resolve) => setTimeout(resolve, 600 * (attempt + 1)));
        }
      }
    }

    setError("Could not load item. Check your connection and try again.");
    setLoading(false);
  }, [itemId]);

  useEffect(() => {
    loadItem();
  }, [loadItem]);

  async function handleAdjust(delta: number) {
    const response = await fetch(`/api/items/${itemId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ delta }),
    });

    if (!response.ok) {
      const data = await response.json();
      setError(data.error ?? "Update failed");
      return;
    }

    setError(null);
    setItem(await response.json());
  }

  if (loading) {
    return <p className="text-center text-slate-500">Loading item…</p>;
  }

  if (error && !item) {
    return (
      <p className="rounded-xl bg-red-50 px-4 py-3 text-center text-red-700">
        {error}
      </p>
    );
  }

  if (!item) return null;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">{item.name}</h2>
        {item.sku ? (
          <p className="mt-1 text-sm text-slate-500">SKU: {item.sku}</p>
        ) : null}
      </div>

      {error ? (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <QuantityAdjuster quantity={item.quantity} onAdjust={handleAdjust} />
    </div>
  );
}
