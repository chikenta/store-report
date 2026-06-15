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
  const reportedAt = reported_at ?? new Date().toISOString();

  // 同日・同シフトの既存日報を検索
  const dateStart = reportedAt.slice(0, 10) + "T00:00:00.000Z";
  const dateEnd = reportedAt.slice(0, 10) + "T23:59:59.999Z";
  const { data: existing } = await supabase
    .from("reports")
    .select("*")
    .eq("store_name", store_name)
    .eq("shift", shift)
    .gte("reported_at", dateStart)
    .lte("reported_at", dateEnd)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (existing) {
    // 既存の transcript に追記して再要約
    const mergedTranscript = existing.transcript + "\n---\n" + transcript;
    const summary = await summarizeReport(mergedTranscript);

    const { data, error } = await supabase
      .from("reports")
      .update({ transcript: mergedTranscript, summary })
      .eq("id", existing.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data, { status: 200 });
  }

  // 新規登録
  const summary = await summarizeReport(transcript);

  const { data, error } = await supabase
    .from("reports")
    .insert({
      store_name,
      shift,
      transcript,
      summary,
      reported_at: reportedAt,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data, { status: 201 });
}
