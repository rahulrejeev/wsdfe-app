"use client";

import { useState } from "react";
import type { InventoryItem } from "@/lib/types";

function QrModal({
  item,
  onClose,
}: {
  item: InventoryItem;
  onClose: () => void;
}) {
  const qrUrl = `/api/qr/${item.id}`;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-slate-900">{item.name}</h3>
        <p className="mt-1 text-sm text-slate-500">Print and stick on the box</p>
        <img
          src={qrUrl}
          alt={`QR code for ${item.name}`}
          className="mx-auto mt-4 h-64 w-64"
        />
        <div className="mt-4 grid grid-cols-2 gap-2">
          <a
            href={qrUrl}
            download={`wsdfe-${item.name.replace(/\s+/g, "-").toLowerCase()}.png`}
            className="rounded-xl bg-slate-900 py-3 text-center text-sm font-semibold text-white"
          >
            Download
          </a>
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700"
          >
            Print
          </button>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="mt-3 w-full rounded-xl py-3 text-sm font-medium text-slate-500"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export function AdminTable({ initialItems }: { initialItems: InventoryItem[] }) {
  const [items, setItems] = useState(initialItems);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("0");
  const [sku, setSku] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [qrItem, setQrItem] = useState<InventoryItem | null>(null);

  async function refreshItems() {
    const response = await fetch("/api/items");
    if (response.ok) {
      setItems(await response.json());
    }
  }

  async function addItem(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const response = await fetch("/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        quantity: parseInt(quantity, 10) || 0,
        sku: sku || null,
      }),
    });

    setLoading(false);

    if (!response.ok) {
      const data = await response.json();
      setError(data.error ?? "Failed to add item");
      return;
    }

    setName("");
    setQuantity("0");
    setSku("");
    await refreshItems();
  }

  async function updateItem(
    id: string,
    updates: Partial<Pick<InventoryItem, "name" | "quantity" | "sku">>,
  ) {
    const response = await fetch(`/api/items/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });

    if (response.ok) {
      await refreshItems();
    }
  }

  async function deleteItem(id: string) {
    if (!confirm("Delete this stock line?")) return;

    const response = await fetch(`/api/items/${id}`, { method: "DELETE" });
    if (response.ok) {
      await refreshItems();
    }
  }

  return (
    <div className="space-y-6">
      <form
        onSubmit={addItem}
        className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
      >
        <h2 className="text-base font-semibold text-slate-900">Add stock line</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-4">
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Item name (e.g. Angle boxes 20m)"
            className="rounded-xl border border-slate-200 px-3 py-2 sm:col-span-2"
          />
          <input
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            placeholder="SKU (optional)"
            className="rounded-xl border border-slate-200 px-3 py-2"
          />
          <input
            type="number"
            min="0"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Qty"
            className="rounded-xl border border-slate-200 px-3 py-2"
          />
        </div>
        {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="mt-4 rounded-xl bg-amber-500 px-4 py-2 font-semibold text-white disabled:opacity-50"
        >
          Add line & generate QR
        </button>
      </form>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Item</th>
                <th className="px-4 py-3">SKU</th>
                <th className="px-4 py-3">Qty</th>
                <th className="px-4 py-3">QR</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                    No stock lines yet. Add your first item above.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="border-t border-slate-100">
                    <td className="px-4 py-3">
                      <input
                        defaultValue={item.name}
                        onBlur={(e) => {
                          if (e.target.value !== item.name) {
                            updateItem(item.id, { name: e.target.value });
                          }
                        }}
                        className="w-full min-w-[180px] rounded-lg border border-transparent px-2 py-1 hover:border-slate-200 focus:border-amber-400"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        defaultValue={item.sku ?? ""}
                        onBlur={(e) => {
                          const next = e.target.value || null;
                          if (next !== item.sku) {
                            updateItem(item.id, { sku: next });
                          }
                        }}
                        className="w-full min-w-[100px] rounded-lg border border-transparent px-2 py-1 hover:border-slate-200 focus:border-amber-400"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        min="0"
                        defaultValue={item.quantity}
                        onBlur={(e) => {
                          const next = parseInt(e.target.value, 10);
                          if (Number.isFinite(next) && next !== item.quantity) {
                            updateItem(item.id, { quantity: next });
                          }
                        }}
                        className="w-20 rounded-lg border border-transparent px-2 py-1 hover:border-slate-200 focus:border-amber-400"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => setQrItem(item)}
                        className="rounded-lg bg-slate-100 px-3 py-1.5 font-medium text-slate-700"
                      >
                        View QR
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => deleteItem(item.id)}
                        className="text-red-500"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {qrItem ? <QrModal item={qrItem} onClose={() => setQrItem(null)} /> : null}
    </div>
  );
}
