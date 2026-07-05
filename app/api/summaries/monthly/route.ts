import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { generateMonthlySummary } from "@/lib/gemini";
import { subMonths } from "date-fns";

export async function POST(request: NextRequest) {
  const body = await request.json() as { store_name: string; monthsAgo?: number };
  const { store_name, monthsAgo = 1 } = body;

  if (!store_name) {
    return NextResponse.json({ error: "store_name is required" }, { status: 400 });
  }

  // まず指定月を試み、週報がなければ直近の週報がある月を使う
  let weeklies: { summary: string; week: number }[] | null = null;
  let year = 0;
  let month = 0;

  for (let attempt = 0; attempt < 6; attempt++) {
    const targetDate = subMonths(new Date(), monthsAgo + attempt);
    year = targetDate.getFullYear();
    month = targetDate.getMonth() + 1;

    const { data, error: weekliesError } = await supabase
      .from("weekly_summaries")
      .select("summary, week")
      .eq("store_name", store_name)
      .eq("year", year)
      .order("week", { ascending: true });

    if (weekliesError) {
      return NextResponse.json({ error: weekliesError.message }, { status: 500 });
    }
    if (data && data.length > 0) {
      weeklies = data;
      break;
    }
  }

  if (!weeklies || weeklies.length === 0) {
    return NextResponse.json({ error: "週報がありません" }, { status: 404 });
  }

  const summary = await generateMonthlySummary(
    store_name,
    year,
    month,
    weeklies.map((w) => w.summary),
  );

  const { data, error } = await supabase
    .from("monthly_summaries")
    .upsert(
      { store_name, year, month, summary, auto_generated: false },
      { onConflict: "store_name,year,month" },
    )
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data, { status: 201 });
}
