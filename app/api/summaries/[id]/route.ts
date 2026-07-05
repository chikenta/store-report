import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") ?? "weekly"; // "weekly" | "monthly"

  const table = type === "monthly" ? "monthly_summaries" : "weekly_summaries";
  const { error } = await supabase.from(table).delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return new NextResponse(null, { status: 204 });
}
