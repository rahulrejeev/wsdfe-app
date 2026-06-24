"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useRouter } from "next/navigation";

export function QrScanner() {
  const router = useRouter();
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [starting, setStarting] = useState(true);

  useEffect(() => {
    let mounted = true;
    const scanner = new Html5Qrcode("qr-reader");
    scannerRef.current = scanner;

    async function start() {
      try {
        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText) => {
            const queryMatch = decodedText.match(/[?&]item=([0-9a-f-]{36})/i);
            if (queryMatch) {
              scanner.stop().catch(() => undefined);
              router.push(`/scan?item=${queryMatch[1]}`);
              return;
            }

            const pathMatch = decodedText.match(/\/scan\/([0-9a-f-]{36})/i);
            if (pathMatch) {
              scanner.stop().catch(() => undefined);
              router.push(`/scan?item=${pathMatch[1]}`);
              return;
            }

            if (/^[0-9a-f-]{36}$/i.test(decodedText)) {
              scanner.stop().catch(() => undefined);
              router.push(`/scan?item=${decodedText}`);
            }
          },
          () => undefined,
        );
        if (mounted) setStarting(false);
      } catch {
        if (mounted) {
          setError("Camera access denied or unavailable. Open a QR link directly.");
          setStarting(false);
        }
      }
    }

    start();

    return () => {
      mounted = false;
      scanner.stop().catch(() => undefined);
      scanner.clear();
    };
  }, [router]);

  return (
    <div className="space-y-4">
      <div
        id="qr-reader"
        className="overflow-hidden rounded-2xl border border-slate-200 bg-black"
      />
      {starting ? (
        <p className="text-center text-sm text-slate-500">Starting camera…</p>
      ) : null}
      {error ? (
        <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {error}
        </p>
      ) : null}
    </div>
  );
}
