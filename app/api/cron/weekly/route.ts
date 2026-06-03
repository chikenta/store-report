import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { generateWeeklySummary } from "@/lib/gemini";
import {
  getISOWeek,
  getISOWeekYear,
  startOfISOWeek,
  endOfISOWeek,
  subWeeks,
  format,
} from "date-fns";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const targetDate = subWeeks(new Date(), 1);
  const year = getISOWeekYear(targetDate);
  const week = getISOWeek(targetDate);
  const weekStart = startOfISOWeek(targetDate);
  const weekEnd = endOfISOWeek(targetDate);
  const periodLabel = `${format(weekStart, "M/d")}〜${format(weekEnd, "M/d")}`;

  const { data: storeRows } = await supabase
    .from("reports")
    .select("store_name")
    .gte("reported_at", weekStart.toISOString())
    .lte("reported_at", weekEnd.toISOString());

  const stores = [...new Set((storeRows ?? []).map((r) => r.store_name))];
  const results: string[] = [];

  for (const store_name of stores) {
    const { data: reports } = await supabase
      .from("reports")
      .select("summary")
      .eq("store_name", store_name)
      .gte("reported_at", weekStart.toISOString())
      .lte("reported_at", weekEnd.toISOString())
      .order("reported_at", { ascending: true });

    if (!reports || reports.length === 0) continue;

    const summary = await generateWeeklySummary(
      store_name,
      periodLabel,
      reports.map((r) => r.summary),
    );

    await supabase.from("weekly_summaries").upsert(
      { store_name, year, week, period_label: periodLabel, summary, auto_generated: true },
      { onConflict: "store_name,year,week" },
    );

    results.push(store_name);
  }

  return NextResponse.json({ generated: results, week, year });
}
