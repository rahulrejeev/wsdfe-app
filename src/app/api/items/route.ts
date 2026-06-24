import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("inventory_items")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const { isAdminAuthenticated } = await import("@/lib/auth");
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const quantity =
      typeof body.quantity === "number" ? Math.max(0, body.quantity) : 0;
    const sku =
      typeof body.sku === "string" && body.sku.trim()
        ? body.sku.trim()
        : null;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("inventory_items")
      .insert({ name, quantity, sku })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
