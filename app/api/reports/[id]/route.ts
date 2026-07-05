import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { summarizeReport } from "@/lib/gemini";

export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { data: report, error: fetchError } = await supabase
    .from("reports")
    .select("transcript")
    .eq("id", id)
    .single();

  if (fetchError || !report) {
    return NextResponse.json({ error: "報告が見つかりません" }, { status: 404 });
  }

  const summary = await summarizeReport(report.transcript);

  const { data, error } = await supabase
    .from("reports")
    .update({ summary })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { error } = await supabase.from("reports").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return new NextResponse(null, { status: 204 });
}
