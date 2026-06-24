import { redirect } from "next/navigation";

type PageProps = { params: Promise<{ id: string }> };

export default async function ScanItemRedirect({ params }: PageProps) {
  const { id } = await params;
  redirect(`/scan?item=${id}`);
}
