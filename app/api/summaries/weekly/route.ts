import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { generateWeeklySummary } from "@/lib/gemini";
import { getISOWeek, getISOWeekYear, startOfISOWeek, endOfISOWeek, subWeeks, format } from "date-fns";

export async function POST(request: NextRequest) {
  const body = await request.json() as { store_name: string; weeksAgo?: number };
  const { store_name, weeksAgo = 1 } = body;

  if (!store_name) {
    return NextResponse.json({ error: "store_name is required" }, { status: 400 });
  }

  const targetDate = subWeeks(new Date(), weeksAgo);
  const year = getISOWeekYear(targetDate);
  const week = getISOWeek(targetDate);
  const weekStart = startOfISOWeek(targetDate);
  const weekEnd = endOfISOWeek(targetDate);
  const periodLabel = `${format(weekStart, "M/d")}〜${format(weekEnd, "M/d")}`;

  const { data: reports, error: reportsError } = await supabase
    .from("reports")
    .select("summary")
    .eq("store_name", store_name)
    .gte("reported_at", weekStart.toISOString())
    .lte("reported_at", weekEnd.toISOString())
    .order("reported_at", { ascending: true });

  if (reportsError) {
    return NextResponse.json({ error: reportsError.message }, { status: 500 });
  }

  if (!reports || reports.length === 0) {
    return NextResponse.json({ error: "この週に日報がありません" }, { status: 404 });
  }

  const summary = await generateWeeklySummary(
    store_name,
    periodLabel,
    reports.map((r) => r.summary),
  );

  const { data, error } = await supabase
    .from("weekly_summaries")
    .upsert(
      { store_name, year, week, period_label: periodLabel, summary, auto_generated: false },
      { onConflict: "store_name,year,week" },
    )
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data, { status: 201 });
}
