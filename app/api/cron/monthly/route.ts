import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { generateMonthlySummary } from "@/lib/gemini";
import { subMonths } from "date-fns";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 今日が1日以外なら何もしない（毎日起動するが月初だけ実行）
  const now = new Date();
  const jstNow = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  if (jstNow.getDate() !== 1) {
    return NextResponse.json({ skipped: true, reason: "not the 1st of the month" });
  }

  const targetDate = subMonths(jstNow, 1);
  const year = targetDate.getFullYear();
  const month = targetDate.getMonth() + 1;

  const { data: storeRows } = await supabase
    .from("weekly_summaries")
    .select("store_name")
    .eq("year", year);

  const stores = [...new Set((storeRows ?? []).map((r) => r.store_name))];
  const results: string[] = [];

  for (const store_name of stores) {
    const { data: weeklies } = await supabase
      .from("weekly_summaries")
      .select("summary, week")
      .eq("store_name", store_name)
      .eq("year", year)
      .order("week", { ascending: true });

    if (!weeklies || weeklies.length === 0) continue;

    const summary = await generateMonthlySummary(
      store_name,
      year,
      month,
      weeklies.map((w) => w.summary),
    );

    await supabase.from("monthly_summaries").upsert(
      { store_name, year, month, summary, auto_generated: true },
      { onConflict: "store_name,year,month" },
    );

    results.push(store_name);
  }

  return NextResponse.json({ generated: results, year, month });
}
