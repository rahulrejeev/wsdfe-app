import Link from "next/link";

export function Header({
  title,
  backHref,
}: {
  title: string;
  backHref?: string;
}) {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-4">
        {backHref ? (
          <Link
            href={backHref}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700"
            aria-label="Go back"
          >
            ←
          </Link>
        ) : null}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">
            WSDFE
          </p>
          <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
        </div>
      </div>
    </header>
  );
}
