import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export const metadata = {
  title: "店舗レポート — システム概要",
  description: "4店舗の音声日報・週報・月報システムの説明",
};

export default function OverviewPage() {
  return (
    <div className="mx-auto flex min-h-svh max-w-3xl flex-col gap-8 px-4 py-10">
      <header className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-semibold">店舗レポート</h1>
          <Badge variant="secondary">システム概要</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          4店舗のマネージャーが音声で日報を残し、統括が遠隔で定性コメントを一覧・週報・月報として確認する仕組みです。
        </p>
        <div className="flex flex-wrap gap-2">
          <Button render={<Link href="/demo" />}>デモ画面を見る</Button>
          <Button variant="outline" render={<Link href="/demo/report/new" />}>
            音声入力デモ
          </Button>
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>誰が何をするか</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2 rounded-md border border-border p-4">
              <p className="text-sm font-semibold">店舗マネージャー</p>
              <p className="text-sm text-muted-foreground">
                店舗PC（Edge）でマイクに話すだけ。店舗・早番/遅番を選んで送信。
              </p>
            </div>
            <div className="flex flex-col gap-2 rounded-md border border-border p-4">
              <p className="text-sm font-semibold">統括</p>
              <p className="text-sm text-muted-foreground">
                4ペインのダッシュボードで日報・週報・月報を確認。定量データは別システムで閲覧。
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>画面構成（4ペイン）</CardTitle>
          <CardDescription>統括用ダッシュボード</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="grid grid-cols-4 gap-1 overflow-hidden rounded-md border border-border text-center text-xs">
            <div className="border-r border-border bg-muted/40 p-3 font-semibold">
              ペイン1
              <br />
              店舗
            </div>
            <div className="border-r border-border p-3 font-semibold">
              ペイン2
              <br />
              日報一覧
            </div>
            <div className="border-r border-border bg-muted/40 p-3 font-semibold">
              ペイン3
              <br />
              AI要約
            </div>
            <div className="p-3 font-semibold">
              ペイン4
              <br />
              週報・月報
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            日報詳細は全文ではなく AI 要約のみ表示。週報は月曜起算・日曜締め、月報は月初締め。毎週月曜・毎月1日 6:00 に自動生成（手動の再生成も可）。
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>データの流れ</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm">
          <div className="flex flex-col gap-2 rounded-md border border-border bg-muted/20 p-4 font-mono text-xs leading-relaxed sm:text-sm">
            <p>マネージャー（Edge + マイク）</p>
            <p className="text-muted-foreground">↓ Web Speech API で文字起こし</p>
            <p>送信 → API（要約: Gemini）</p>
            <p className="text-muted-foreground">↓ 保存</p>
            <p>Supabase（日報）</p>
            <p className="text-muted-foreground">↓ 集計（自動 Cron）</p>
            <p>週報 → 月報（Gemini で要約）</p>
            <p className="text-muted-foreground">↓ 閲覧</p>
            <p>統括ダッシュボード（ブラウザ）</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>技術構成</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
            <li>フロント: Next.js 16 / React 19 / shadcn/ui</li>
            <li>音声入力: ブラウザ内蔵 Web Speech API（追加アプリ不要）</li>
            <li>要約: Google Gemini API（無料枠）</li>
            <li>DB: Supabase PostgreSQL（無料枠）</li>
            <li>ホスティング: Vercel（無料枠）</li>
            <li>認証: なし（URL を知っている人が利用）</li>
          </ul>
        </CardContent>
      </Card>

      <Separator />

      <footer className="flex flex-col gap-2 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">このページの共有 URL</p>
        <p>
          Vercel にデプロイすると、次のような公開 URL で説明できます（例）:
        </p>
        <p className="rounded-md border border-border bg-muted/30 px-3 py-2 font-mono text-xs">
          https://あなたのプロジェクト名.vercel.app/overview
        </p>
        <p>
          動作デモは{" "}
          <code className="rounded bg-muted px-1">/demo</code>{" "}
          、本番は Supabase 設定後に{" "}
          <code className="rounded bg-muted px-1">/</code> です。
        </p>
      </footer>
    </div>
  );
}
