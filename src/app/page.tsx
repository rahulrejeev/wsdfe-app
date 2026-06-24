import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-full bg-slate-950 text-white">
      <header className="px-4 py-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">
          WSDFE
        </p>
        <h1 className="text-lg font-semibold">Inventory</h1>
      </header>
      <main className="mx-auto flex max-w-lg flex-1 flex-col px-4 py-10">
        <div className="mb-10">
          <p className="text-sm uppercase tracking-[0.2em] text-amber-400">
            Fire & electrical
          </p>
          <h2 className="mt-2 text-4xl font-bold leading-tight">
            Stock room, sorted.
          </h2>
          <p className="mt-4 text-slate-400">
            Scan a QR on any box to take or return stock. Admins manage the
            spreadsheet and print labels.
          </p>
        </div>

        <div className="mt-auto space-y-3">
          <Link
            href="/scan"
            className="flex w-full items-center justify-center rounded-2xl bg-amber-500 py-5 text-lg font-semibold text-slate-950"
          >
            Scan QR code
          </Link>
          <Link
            href="/admin"
            className="flex w-full items-center justify-center rounded-2xl border border-slate-700 py-5 text-lg font-semibold text-white"
          >
            Admin spreadsheet
          </Link>
        </div>
      </main>
    </div>
  );
}
