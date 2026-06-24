"use client";

import { useState } from "react";

export function QuantityAdjuster({
  quantity,
  onAdjust,
  disabled,
}: {
  quantity: number;
  onAdjust: (delta: number) => Promise<void>;
  disabled?: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [customAmount, setCustomAmount] = useState("1");

  async function handleAdjust(delta: number) {
    setLoading(true);
    try {
      await onAdjust(delta);
    } finally {
      setLoading(false);
    }
  }

  async function handleCustomTake() {
    const amount = parseInt(customAmount, 10);
    if (!Number.isFinite(amount) || amount <= 0) return;
    await handleAdjust(-amount);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-slate-900 px-6 py-8 text-center text-white">
        <p className="text-sm uppercase tracking-wider text-slate-400">
          In stock
        </p>
        <p className="mt-2 text-6xl font-bold tabular-nums">{quantity}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          disabled={disabled || loading}
          onClick={() => handleAdjust(-1)}
          className="rounded-2xl bg-red-500 py-5 text-xl font-semibold text-white disabled:opacity-50"
        >
          − Take 1
        </button>
        <button
          type="button"
          disabled={disabled || loading}
          onClick={() => handleAdjust(1)}
          className="rounded-2xl bg-emerald-500 py-5 text-xl font-semibold text-white disabled:opacity-50"
        >
          + Return 1
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <p className="mb-3 text-sm font-medium text-slate-600">Take multiple</p>
        <div className="flex gap-2">
          <input
            type="number"
            min="1"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-lg"
          />
          <button
            type="button"
            disabled={disabled || loading}
            onClick={handleCustomTake}
            className="shrink-0 rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white disabled:opacity-50"
          >
            Take
          </button>
        </div>
      </div>
    </div>
  );
}
