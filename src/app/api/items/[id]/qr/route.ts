import QRCode from "qrcode";
import { NextResponse } from "next/server";
import { getScanUrl } from "@/lib/app-url";
import { createServiceClient } from "@/lib/supabase/server";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("inventory_items")
      .select("id, name")
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    const png = await QRCode.toBuffer(getScanUrl(id), {
      type: "png",
      width: 512,
      margin: 2,
      color: { dark: "#0f172a", light: "#ffffff" },
    });

    return new NextResponse(new Uint8Array(png), {
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": `inline; filename="wsdfe-${id.slice(0, 8)}.png"`,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 },
    );
  }
}
