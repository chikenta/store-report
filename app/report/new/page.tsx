"use client";

import { useState, useRef, useEffect } from "react";
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
import { Mic, MicOff, CheckCircle, Loader2 } from "lucide-react";

const DEFAULT_STORES = ["北店", "南店", "東店", "西店"];
const SHIFTS = ["早番", "遅番"] as const;
type Shift = (typeof SHIFTS)[number];

type Status = "idle" | "recording" | "submitting" | "done" | "error";

// Web Speech API の型定義（@types に含まれないため宣言）
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}
interface SpeechRecognitionInstance extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
}
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition: new () => SpeechRecognitionInstance;
  }
}

export default function NewReportPage() {
  const router = useRouter();
  const [stores, setStores] = useState<string[]>(DEFAULT_STORES);
  const [store, setStore] = useState(DEFAULT_STORES[0]);

  useEffect(() => {
    fetch("/api/stores")
      .then((r) => r.json())
      .then((data) => {
        const list: string[] = Array.isArray(data) ? data : DEFAULT_STORES;
        setStores(list);
        setStore(list[0] ?? DEFAULT_STORES[0]);
      })
      .catch(() => {});
  }, []);
  const [shift, setShift] = useState<Shift>("早番");
  const [transcript, setTranscript] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  function startRecording() {
    const SpeechRecognition =
      window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setErrorMsg("このブラウザは音声入力に対応していません（Edge を使用してください）");
      setStatus("error");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "ja-JP";
    recognition.continuous = true;
    recognition.interimResults = true;

    let finalText = "";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalText += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }
      setTranscript(finalText + interim);
    };

    recognition.onerror = () => {
      setErrorMsg("音声認識でエラーが発生しました。マイクのアクセスを許可してください。");
      setStatus("error");
    };

    recognition.onend = () => {
      if (status === "recording") setStatus("idle");
    };

    recognitionRef.current = recognition;
    recognition.start();
    setTranscript("");
    setStatus("recording");
  }

  function stopRecording() {
    recognitionRef.current?.stop();
    setStatus("idle");
  }

  async function handleSubmit() {
    if (!transcript.trim()) return;
    setStatus("submitting");
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ store_name: store, shift, transcript }),
      });
      if (!res.ok) {
        const text = await res.text();
        let message = "送信に失敗しました（しばらく待ってから再試行してください）";
        try { message = JSON.parse(text).error ?? message; } catch { /* ignore */ }
        throw new Error(message);
      }
      setStatus("done");
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "送信に失敗しました");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-6 p-8 text-center">
          <CheckCircle className="size-16 text-primary" />
          <div className="flex flex-col gap-2">
            <p className="text-lg font-semibold">送信しました</p>
            <p className="text-sm text-muted-foreground">
              {store} / {shift} の報告が記録されました
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
            <Button variant="ghost" onClick={() => router.push("/")}>
              ダッシュボードへ
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-background px-4">
      <div className="flex w-full max-w-md flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">本日の報告</h1>
          <Button variant="default" size="sm" onClick={() => router.push("/")}>
            ダッシュボード
          </Button>
        </div>

        {/* 店舗 */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-muted-foreground">
            店舗
          </label>
          <Select value={store} onValueChange={(v) => { if (v) setStore(v); }}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {stores.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* シフト */}
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

        {/* マイクボタン */}
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={status === "recording" ? stopRecording : startRecording}
            disabled={status === "submitting"}
            className="flex size-20 cursor-pointer items-center justify-center rounded-full border-2 border-border bg-card transition-colors hover:bg-accent disabled:cursor-not-allowed data-[recording=true]:border-primary data-[recording=true]:bg-primary"
            data-recording={status === "recording"}
            aria-label={status === "recording" ? "録音停止" : "録音開始"}
          >
            {status === "recording" ? (
              <MicOff className="size-7 text-primary-foreground" />
            ) : (
              <Mic className="size-7 text-foreground" />
            )}
          </button>
          <p className="text-sm text-muted-foreground">
            {status === "recording"
              ? "録音中 — クリックで停止"
              : "クリックして話す"}
          </p>
        </div>

        {/* 文字起こし結果 */}
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

        {/* エラー */}
        {status === "error" && (
          <p className="text-sm text-destructive">{errorMsg}</p>
        )}

        {/* 送信 */}
        <Button
          onClick={handleSubmit}
          disabled={!transcript.trim() || status === "recording" || status === "submitting"}
        >
          {status === "submitting" && (
            <Loader2 className="mr-2 size-4 animate-spin" />
          )}
          {status === "submitting" ? "送信中..." : "送信する"}
        </Button>
      </div>
    </div>
  );
}
