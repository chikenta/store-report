"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { Report, WeeklySummary, MonthlySummary } from "@/lib/store-types";
import {
  DEMO_MONTHLIES,
  DEMO_REPORTS,
  DEMO_WEEKLIES,
} from "@/lib/store-demo-data";

const STORES = ["北店", "南店", "東店", "西店"];

type Pane4Tab = "weekly" | "monthly";

type DashboardProps = {
  /** サンプルデータのみ表示（API・Supabase 不要） */
  demo?: boolean;
};

function filterDemoByStore(store: string) {
  return {
    reports: DEMO_REPORTS.filter((r) => r.store_name === store),
    weeklies: DEMO_WEEKLIES.filter((w) => w.store_name === store),
    monthlies: DEMO_MONTHLIES.filter((m) => m.store_name === store),
  };
}

export function Dashboard({ demo = false }: DashboardProps) {
  const [selectedStore, setSelectedStore] = useState(STORES[0]);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [pane4Tab, setPane4Tab] = useState<Pane4Tab>("weekly");

  const [reports, setReports] = useState<Report[]>([]);
  const [weeklies, setWeeklies] = useState<WeeklySummary[]>([]);
  const [monthlies, setMonthlies] = useState<MonthlySummary[]>([]);
  const [loadingReports, setLoadingReports] = useState(false);
  const [loadingWeeklies, setLoadingWeeklies] = useState(false);
  const [generatingWeekly, setGeneratingWeekly] = useState(false);
  const [generatingMonthly, setGeneratingMonthly] = useState(false);

  const selectedReport = reports.find((r) => r.id === selectedReportId) ?? reports[0] ?? null;

  const fetchReports = useCallback(async (store: string) => {
    setLoadingReports(true);
    try {
      const res = await fetch(`/api/reports?store=${encodeURIComponent(store)}&limit=30`);
      const data: Report[] = await res.json();
      setReports(data);
      setSelectedReportId(data[0]?.id ?? null);
    } finally {
      setLoadingReports(false);
    }
  }, []);

  const fetchSummaries = useCallback(async (store: string) => {
    setLoadingWeeklies(true);
    try {
      const [wRes, mRes] = await Promise.all([
        fetch(`/api/summaries?store=${encodeURIComponent(store)}&type=weekly`),
        fetch(`/api/summaries?store=${encodeURIComponent(store)}&type=monthly`),
      ]);
      setWeeklies(await wRes.json());
      setMonthlies(await mRes.json());
    } finally {
      setLoadingWeeklies(false);
    }
  }, []);

  useEffect(() => {
    if (demo) {
      const { reports: r, weeklies: w, monthlies: m } =
        filterDemoByStore(selectedStore);
      setReports(r);
      setSelectedReportId(r[0]?.id ?? null);
      setWeeklies(w);
      setMonthlies(m);
      setLoadingReports(false);
      setLoadingWeeklies(false);
      return;
    }
    void fetchReports(selectedStore);
    void fetchSummaries(selectedStore);
  }, [selectedStore, fetchReports, fetchSummaries, demo]);

  async function handleGenerateWeekly() {
    setGeneratingWeekly(true);
    try {
      if (demo) {
        await new Promise((r) => setTimeout(r, 800));
        return;
      }
      await fetch("/api/summaries/weekly", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ store_name: selectedStore, weeksAgo: 0 }),
      });
      await fetchSummaries(selectedStore);
    } finally {
      setGeneratingWeekly(false);
    }
  }

  async function handleGenerateMonthly() {
    setGeneratingMonthly(true);
    try {
      if (demo) {
        await new Promise((r) => setTimeout(r, 800));
        return;
      }
      await fetch("/api/summaries/monthly", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ store_name: selectedStore, monthsAgo: 0 }),
      });
      await fetchSummaries(selectedStore);
    } finally {
      setGeneratingMonthly(false);
    }
  }

  return (
    <div className="flex h-svh flex-col bg-background">
      {/* ヘッダー */}
      <header className="flex h-11 shrink-0 items-center justify-between border-b border-border px-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">店舗レポート</span>
          {demo && (
            <Badge variant="secondary" className="text-xs">
              サンプル
            </Badge>
          )}
        </div>
        <Link href={demo ? "/demo/report/new" : "/report/new"}>
          <Button size="sm">音声入力画面</Button>
        </Link>
      </header>

      {/* 4ペイン */}
      <div className="grid min-h-0 flex-1 grid-cols-[140px_220px_1fr_220px]">
        {/* Pane1: 店舗リスト */}
        <aside className="flex flex-col border-r border-border">
          <div className="border-b border-border px-3 py-2">
            <span className="text-xs font-semibold text-muted-foreground">店舗</span>
          </div>
          <ul className="flex flex-col">
            {STORES.map((store) => (
              <li key={store}>
                <button
                  onClick={() => setSelectedStore(store)}
                  className="flex w-full flex-col gap-0.5 px-3 py-2.5 text-left transition-colors hover:bg-accent data-[active=true]:bg-accent"
                  data-active={selectedStore === store}
                >
                  <span className={`text-sm ${selectedStore === store ? "font-semibold" : "text-muted-foreground"}`}>
                    {store}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Pane2: 日報一覧 */}
        <section className="flex flex-col border-r border-border">
          <div className="border-b border-border px-3 py-2">
            <span className="text-xs font-semibold text-muted-foreground">
              {selectedStore} の日報
            </span>
          </div>
          <ScrollArea className="flex-1">
            {loadingReports ? (
              <div className="flex justify-center py-8">
                <Loader2 className="size-4 animate-spin text-muted-foreground" />
              </div>
            ) : reports.length === 0 ? (
              <p className="px-3 py-4 text-xs text-muted-foreground">報告なし</p>
            ) : (
              <ul className="flex flex-col">
                {reports.map((r) => (
                  <li key={r.id}>
                    <button
                      onClick={() => setSelectedReportId(r.id)}
                      className="flex w-full flex-col gap-1 border-b border-border px-3 py-2.5 text-left transition-colors hover:bg-accent data-[active=true]:bg-accent"
                      data-active={selectedReportId === r.id}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold">
                          {format(new Date(r.reported_at), "M/d（EEE）")}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {r.shift}
                        </Badge>
                      </div>
                      <p className="line-clamp-2 text-xs text-muted-foreground">
                        {r.summary}
                      </p>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </ScrollArea>
        </section>

        {/* Pane3: 日報詳細 */}
        <section className="flex flex-col border-r border-border">
          <div className="border-b border-border px-4 py-2">
            <span className="text-xs font-semibold text-muted-foreground">日報詳細</span>
          </div>
          <ScrollArea className="flex-1 p-4">
            {selectedReport ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">
                    {selectedReport.store_name} /{" "}
                    {format(new Date(selectedReport.reported_at), "M/d（EEE）")}
                  </span>
                  <Badge variant="outline">{selectedReport.shift}</Badge>
                </div>
                <Separator />
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-semibold text-muted-foreground">
                    AI 要約
                  </span>
                  <div className="rounded-md border border-border bg-muted/40 px-3 py-2.5">
                    <p className="text-sm">{selectedReport.summary}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">日報を選択してください</p>
            )}
          </ScrollArea>
        </section>

        {/* Pane4: 週報/月報 */}
        <section className="flex flex-col">
          <div className="flex items-center gap-2 border-b border-border px-3 py-2">
            <button
              onClick={() => setPane4Tab("weekly")}
              className={`text-xs font-semibold transition-colors ${pane4Tab === "weekly" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              週報
            </button>
            <span className="text-muted-foreground">/</span>
            <button
              onClick={() => setPane4Tab("monthly")}
              className={`text-xs font-semibold transition-colors ${pane4Tab === "monthly" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              月報
            </button>
          </div>

          <ScrollArea className="flex-1">
            {loadingWeeklies ? (
              <div className="flex justify-center py-8">
                <Loader2 className="size-4 animate-spin text-muted-foreground" />
              </div>
            ) : pane4Tab === "weekly" ? (
              <div className="flex flex-col">
                {/* 次回自動生成 */}
                <div className="border-b border-border bg-muted/30 px-3 py-2">
                  <p className="text-xs text-muted-foreground">
                    次回自動生成: <span className="font-semibold text-foreground">月曜 6:00</span>
                  </p>
                </div>
                {/* 週報一覧 */}
                {weeklies.length === 0 ? (
                  <p className="px-3 py-4 text-xs text-muted-foreground">週報なし</p>
                ) : (
                  weeklies.map((w) => (
                    <div key={w.id} className="flex flex-col gap-1 border-b border-border px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold">{w.period_label}</span>
                        {w.auto_generated && (
                          <Badge variant="secondary" className="text-xs">自動</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{w.summary}</p>
                    </div>
                  ))
                )}
                {/* 手動生成 */}
                <div className="p-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleGenerateWeekly}
                    disabled={generatingWeekly}
                    className="w-full"
                  >
                    {generatingWeekly && <Loader2 className="mr-2 size-3 animate-spin" />}
                    <RefreshCw className="mr-2 size-3" />
                    今すぐ再生成
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col">
                {/* 次回自動生成 */}
                <div className="border-b border-border bg-muted/30 px-3 py-2">
                  <p className="text-xs text-muted-foreground">
                    次回自動生成: <span className="font-semibold text-foreground">翌月1日 6:00</span>
                  </p>
                </div>
                {/* 月報一覧 */}
                {monthlies.length === 0 ? (
                  <p className="px-3 py-4 text-xs text-muted-foreground">月報なし</p>
                ) : (
                  monthlies.map((m) => (
                    <div key={m.id} className="flex flex-col gap-1 border-b border-border px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold">
                          {m.year}年{m.month}月
                        </span>
                        {m.auto_generated && (
                          <Badge variant="secondary" className="text-xs">自動</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{m.summary}</p>
                    </div>
                  ))
                )}
                {/* 手動生成 */}
                <div className="p-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleGenerateMonthly}
                    disabled={generatingMonthly}
                    className="w-full"
                  >
                    {generatingMonthly && <Loader2 className="mr-2 size-3 animate-spin" />}
                    <RefreshCw className="mr-2 size-3" />
                    今すぐ再生成
                  </Button>
                </div>
              </div>
            )}
          </ScrollArea>
        </section>
      </div>
    </div>
  );
}
