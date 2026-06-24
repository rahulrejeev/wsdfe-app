import { QrScanner } from "@/components/QrScanner";
import { Header } from "@/components/Header";

export default function ScanPage() {
  return (
    <div className="min-h-full bg-slate-50">
      <Header title="Scan stock" backHref="/" />
      <main className="mx-auto max-w-lg px-4 py-6">
        <p className="mb-4 text-sm text-slate-600">
          Point your camera at a box QR code to update stock.
        </p>
        <QrScanner />
      </main>
    </div>
  );
}
