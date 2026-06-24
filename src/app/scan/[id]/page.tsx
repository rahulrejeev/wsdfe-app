import { Header } from "@/components/Header";
import { ScanItemView } from "@/components/ScanItemView";

type PageProps = { params: Promise<{ id: string }> };

export default async function ScanItemPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className="min-h-full bg-slate-50">
      <Header title="Update stock" backHref="/scan" />
      <main className="mx-auto max-w-lg px-4 py-6">
        <ScanItemView itemId={id} />
      </main>
    </div>
  );
}
