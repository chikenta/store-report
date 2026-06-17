"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Loader2, Plus, RefreshCw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { Report, WeeklySummary, MonthlySummary } from "@/lib/store-types";
import {
  DEMO_MONTHLIES,
  DEMO_REPORTS,
  DEMO_WEEKLIES,
} from "@/lib/store-demo-data";

const INITIAL_STORES = ["北店", "南店", "東店", "西店"];

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
  const [stores, setStores] = useState<string[]>(INITIAL_STORES);
  const [selectedStore, setSelectedStore] = useState(INITIAL_STORES[0]);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [pane4Tab, setPane4Tab] = useState<Pane4Tab>("weekly");

  const [isAddingStore, setIsAddingStore] = useState(false);
  const [newStoreName, setNewStoreName] = useState("");
  const addInputRef = useRef<HTMLInputElement>(null);

  const [reports, setReports] = useState<Report[]>([]);
  const [weeklies, setWeeklies] = useState<WeeklySummary[]>([]);
  const [monthlies, setMonthlies] = useState<MonthlySummary[]>([]);
  const [loadingReports, setLoadingReports] = useState(false);
  const [loadingWeeklies, setLoadingWeeklies] = useState(false);
  const [generatingWeekly, setGeneratingWeekly] = useState(false);
  const [generatingMonthly, setGeneratingMonthly] = useState(false);
  const [regeneratingSummary, setRegeneratingSummary] = useState(false);

  async function handleRegenerateSummary(reportId: string) {
    setRegeneratingSummary(true);
    try {
      const res = await fetch(`/api/reports/${reportId}`, { method: "PATCH" });
      if (res.ok) {
        const updated = await res.json();
        setReports((prev) =>
          prev.map((r) => (r.id === updated.id ? updated : r))
        );
      }
    } finally {
      setRegeneratingSummary(false);
    }
  }

  function handleAddStoreStart() {
    setIsAddingStore(true);
    setNewStoreName("");
    setTimeout(() => addInputRef.current?.focus(), 0);
  }

  function handleAddStoreCommit() {
    const name = newStoreName.trim();
    if (name && !stores.includes(name)) {
      setStores((prev) => [...prev, name]);
      setSelectedStore(name);
    }
    setIsAddingStore(false);
    setNewStoreName("");
  }

  function handleAddStoreCancel() {
    setIsAddingStore(false);
    setNewStoreName("");
  }

  function handleDeleteStore(store: string) {
    const next = stores.filter((s) => s !== store);
    setStores(next);
    if (selectedStore === store) {
      setSelectedStore(next[0] ?? "");
    }
  }

  const selectedReport = reports.find((r) => r.id === selectedReportId) ?? reports[0] ?? null;

  const fetchReports = useCallback(async (store: string) => {
    setLoadingReports(true);
    try {
      const res = await fetch(`/api/reports?store=${encodeURIComponent(store)}&limit=30`);
      const data: Report[] = await res.json();
      setReports(data);
      setSelectedReportId(data[0]?.id ?? null);

      // 「（要約生成中）」のままの日報をバックグラウンドで再試行
      const pending = data.filter((r) => r.summary === "（要約生成中）");
      for (const r of pending) {
        fetch(`/api/reports/${r.id}`, { method: "PATCH" })
          .then((res) => res.ok ? res.json() : null)
          .then((updated) => {
            if (updated) {
              setReports((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
            }
          })
          .catch(() => {});
      }
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
      <div className="grid min-h-0 flex-1 grid-cols-[100px_220px_1fr_220px]">
        {/* Pane1: 店舗リスト */}
        <aside className="flex flex-col border-r border-border">
          <div className="flex items-center justify-between border-b border-border px-3 py-2">
            <span className="text-xs font-semibold text-muted-foreground">店舗</span>
            <button
              onClick={handleAddStoreStart}
              className="flex items-center justify-center rounded-md p-0.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              aria-label="店舗を追加"
            >
              <Plus className="size-3.5" />
            </button>
          </div>
          <ul className="flex flex-col">
            {stores.map((store) => (
              <li key={store} className="group/store-item relative">
                <button
                  onClick={() => setSelectedStore(store)}
                  className="flex w-full flex-col gap-0.5 px-3 py-2.5 pr-8 text-left transition-colors hover:bg-accent data-[active=true]:bg-accent"
                  data-active={selectedStore === store}
                >
                  <span className={`truncate text-sm ${selectedStore === store ? "font-semibold" : "text-muted-foreground"}`}>
                    {store}
                  </span>
                </button>
                <AlertDialog>
                  <AlertDialogTrigger
                    render={
                      <button
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover/store-item:opacity-100"
                        aria-label={`${store}を削除`}
                      />
                    }
                  >
                    <Trash2 className="size-3.5" />
                  </AlertDialogTrigger>
                  <AlertDialogContent size="sm">
                    <AlertDialogHeader>
                      <AlertDialogTitle>店舗を削除しますか？</AlertDialogTitle>
                      <AlertDialogDescription>
                        「{store}」を店舗リストから削除します。この操作は元に戻せません。
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>いいえ</AlertDialogCancel>
                      <AlertDialogAction
                        variant="destructive"
                        onClick={() => handleDeleteStore(store)}
                      >
                        はい、削除する
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </li>
            ))}
            {isAddingStore && (
              <li className="px-2 py-1.5">
                <Input
                  ref={addInputRef}
                  value={newStoreName}
                  onChange={(e) => setNewStoreName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddStoreCommit();
                    if (e.key === "Escape") handleAddStoreCancel();
                  }}
                  onBlur={handleAddStoreCommit}
                  placeholder="店舗名を入力"
                  maxLength={4}
                  className="h-7 text-xs"
                />
              </li>
            )}
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
                      <p className="truncate text-xs text-muted-foreground">
                        {r.summary.slice(0, 15)}
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
