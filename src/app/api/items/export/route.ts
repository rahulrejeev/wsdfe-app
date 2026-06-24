import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("inventory_items")
      .select("name, sku, quantity, updated_at")
      .order("name", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const header = ["Name", "SKU", "Quantity", "Last Updated"];
    const rows = (data ?? []).map((item) => [
      escapeCsv(item.name),
      escapeCsv(item.sku ?? ""),
      String(item.quantity),
      item.updated_at,
    ]);

    const csv = [header, ...rows].map((row) => row.join(",")).join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": 'attachment; filename="wsdfe-inventory.csv"',
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 },
    );
  }
}

function escapeCsv(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}
