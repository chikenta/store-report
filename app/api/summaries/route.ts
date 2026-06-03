import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const store = searchParams.get("store");
  const type = searchParams.get("type") ?? "weekly"; // "weekly" | "monthly"

  if (type === "monthly") {
    let query = supabase
      .from("monthly_summaries")
      .select("*")
      .order("year", { ascending: false })
      .order("month", { ascending: false })
      .limit(12);
    if (store) query = query.eq("store_name", store);

    const { data, error } = await query;
    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  }

  let query = supabase
    .from("weekly_summaries")
    .select("*")
    .order("year", { ascending: false })
    .order("week", { ascending: false })
    .limit(12);
  if (store) query = query.eq("store_name", store);

  const { data, error } = await query;
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
