"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mic, CheckCircle, Loader2 } from "lucide-react";

const STORES = ["北店", "南店", "東店", "西店"];
const SHIFTS = ["早番", "遅番"] as const;
const SAMPLE_TRANSCRIPT =
  "おはようございます。昨日の売上は目標比105%で好調でした。" +
  "常連客のAさんから接客についてお褒めの言葉をいただきました。" +
  "木村さんが来週有休取得予定なのでシフト調整が必要です。在庫は問題なし。";

type Status = "idle" | "submitting" | "done";

/** 設計サンプル用：API なしで音声入力の流れを確認 */
export default function DemoReportPage() {
  const router = useRouter();
  const [store, setStore] = useState(STORES[0]);
  const [shift, setShift] = useState<(typeof SHIFTS)[number]>("早番");
  const [transcript, setTranscript] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit() {
    if (!transcript.trim()) return;
    setStatus("submitting");
    await new Promise((r) => setTimeout(r, 600));
    setStatus("done");
  }

  if (status === "done") {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-6 p-8 text-center">
          <CheckCircle className="size-16 text-primary" />
          <div className="flex flex-col gap-2">
            <p className="text-lg font-semibold">送信しました（サンプル）</p>
            <p className="text-sm text-muted-foreground">
              {store} / {shift} — 実際の保存は行っていません
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setTranscript("");
                setStatus("idle");
              }}
            >
              続けて入力
            </Button>
            <Button variant="ghost" onClick={() => router.push("/demo")}>
              ダッシュボードへ
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <header className="flex h-11 shrink-0 items-center justify-between border-b border-border px-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">本日の報告</span>
          <Badge variant="secondary" className="text-xs">
            サンプル
          </Badge>
        </div>
        <Button size="sm" onClick={() => router.push("/demo")}>
          ダッシュボード
        </Button>
      </header>

      <div className="flex flex-1 items-center justify-center px-4 py-8">
        <div className="flex w-full max-w-md flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-muted-foreground">
              店舗
            </label>
            <Select
              value={store}
              onValueChange={(v) => {
                if (v) setStore(v);
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STORES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-muted-foreground">
              シフト
            </label>
            <div className="flex gap-2">
              {SHIFTS.map((s) => (
                <Button
                  key={s}
                  variant={shift === s ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShift(s)}
                >
                  {s}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={() => setTranscript(SAMPLE_TRANSCRIPT)}
              className="flex size-20 cursor-pointer items-center justify-center rounded-full border-2 border-primary bg-primary transition-colors hover:opacity-90"
              aria-label="サンプル文字起こしを表示"
            >
              <Mic className="size-7 text-primary-foreground" />
            </button>
            <p className="text-sm text-muted-foreground">
              クリックでサンプルの文字起こしを表示
            </p>
          </div>

          {transcript && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">
                  文字起こし
                </span>
                <Badge variant="secondary">完了</Badge>
              </div>
              <Textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                rows={5}
                className="resize-none"
              />
            </div>
          )}

          <Button
            onClick={handleSubmit}
            disabled={!transcript.trim() || status === "submitting"}
          >
            {status === "submitting" && (
              <Loader2 className="mr-2 size-4 animate-spin" />
            )}
            {status === "submitting" ? "送信中..." : "送信する"}
          </Button>
        </div>
      </div>
    </div>
  );
}
