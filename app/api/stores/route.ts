import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

function getClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Supabase env not set");
  return createClient(url, key);
}

export async function GET() {
  try {
    const supabase = getClient();
    const { data, error } = await supabase
      .from("stores")
      .select("name")
      .order("id", { ascending: true });
    if (error) throw error;
    return NextResponse.json(data.map((r: { name: string }) => r.name));
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json();
    const supabase = getClient();
    const { error } = await supabase.from("stores").insert({ name });
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { name } = await request.json();
    const supabase = getClient();
    const { error } = await supabase.from("stores").delete().eq("name", name);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
