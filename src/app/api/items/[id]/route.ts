import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("inventory_items")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;

  try {
    const body = await request.json();
    const supabase = createServiceClient();

    const { data: existing, error: fetchError } = await supabase
      .from("inventory_items")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    const { isAdminAuthenticated } = await import("@/lib/auth");
    const isAdmin = await isAdminAuthenticated();

    if (typeof body.delta === "number") {
      const delta = Math.trunc(body.delta);
      if (delta === 0) {
        return NextResponse.json({ error: "Delta cannot be zero" }, { status: 400 });
      }

      const newQuantity = existing.quantity + delta;
      if (newQuantity < 0) {
        return NextResponse.json(
          { error: "Insufficient stock" },
          { status: 400 },
        );
      }

      const { data, error } = await supabase
        .from("inventory_items")
        .update({ quantity: newQuantity })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      await supabase.from("inventory_log").insert({
        item_id: id,
        delta,
        quantity_after: newQuantity,
      });

      return NextResponse.json(data);
    }

    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updates: Record<string, string | number | null> = {};

    if (typeof body.name === "string" && body.name.trim()) {
      updates.name = body.name.trim();
    }
    if (typeof body.quantity === "number") {
      updates.quantity = Math.max(0, body.quantity);
    }
    if (body.sku !== undefined) {
      updates.sku =
        typeof body.sku === "string" && body.sku.trim() ? body.sku.trim() : null;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No updates provided" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("inventory_items")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { isAdminAuthenticated } = await import("@/lib/auth");
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    const supabase = createServiceClient();
    const { error } = await supabase.from("inventory_items").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 },
    );
  }
}
