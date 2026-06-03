import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { summarizeReport } from "@/lib/gemini";
import { z } from "zod";

const createReportSchema = z.object({
  store_name: z.string().min(1),
  shift: z.enum(["早番", "遅番"]),
  transcript: z.string().min(1),
  reported_at: z.string().optional(),
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const store = searchParams.get("store");
  const limit = Number(searchParams.get("limit") ?? "50");

  let query = supabase
    .from("reports")
    .select("*")
    .order("reported_at", { ascending: false })
    .limit(limit);

  if (store) {
    query = query.eq("store_name", store);
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = createReportSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message },
      { status: 400 },
    );
  }

  const { store_name, shift, transcript, reported_at } = parsed.data;

  const summary = await summarizeReport(transcript);

  const { data, error } = await supabase
    .from("reports")
    .insert({
      store_name,
      shift,
      transcript,
      summary,
      reported_at: reported_at ?? new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data, { status: 201 });
}
