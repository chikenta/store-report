import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export const metadata = {
  title: "店舗レポートシステム — 課題概要",
  description: "音声入力×AI要約による販促店舗日報・週報・月報システムの概要",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="border-b border-border pb-2 text-lg font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
      {children}
    </span>
  );
}

export default function OverviewPage() {
  return (
    <div className="mx-auto flex min-h-svh max-w-3xl flex-col gap-10 px-4 py-12">

      {/* ヘッダー */}
      <header className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-bold">店舗レポートシステム</h1>
          <Badge variant="secondary">課題制作物</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
    販促担当者が音声で日報を入力し、AI が自動要約・週報・月報を生成する業務支援ツール。
      すべて無料枠で構築しており、URL を知る社内メンバーのみがアクセスできる。
        </p>
        <div className="flex flex-wrap gap-2">
          <Button render={<Link href="/demo" />} size="sm">デモを見る</Button>
          <Button variant="outline" render={<Link href="/demo/report/new" />} size="sm">音声入力デモ</Button>
        </div>
      </header>

      {/* 画面キャプチャ（テキスト図解） */}
      <Section title="① ツールの画面構成">
        <p className="text-sm text-muted-foreground">
          統括者向け4ペインダッシュボードと、店舗マネージャー向け音声入力ページの2画面で構成。
        </p>

        {/* ダッシュボード図解 */}
        <div className="rounded-lg border border-border bg-muted/30 p-4">
          <p className="mb-3 text-xs font-semibold text-muted-foreground">統括ダッシュボード（4ペイン）</p>
          <div className="grid grid-cols-[90px_160px_1fr_140px] gap-0 overflow-hidden rounded-md border border-border text-xs">
            <div className="flex flex-col gap-1 border-r border-border bg-card p-2">
              <p className="font-semibold">ペイン①</p>
              <p className="text-muted-foreground">店舗選択</p>
              <Separator />
              <p className="rounded bg-primary/10 px-1 text-primary">▶ 北店</p>
              <p className="px-1 text-muted-foreground">南店</p>
              <p className="px-1 text-muted-foreground">東店</p>
              <p className="px-1 text-muted-foreground">西店</p>
            </div>
            <div className="flex flex-col gap-1 border-r border-border bg-card p-2">
              <p className="font-semibold">ペイン②</p>
              <p className="text-muted-foreground">日報一覧</p>
              <Separator />
              <p className="rounded bg-muted px-1">7/26 早番</p>
              <p className="px-1 text-muted-foreground">7/25 遅番</p>
              <p className="px-1 text-muted-foreground">7/25 早番</p>
            </div>
            <div className="flex flex-col gap-1 border-r border-border bg-card p-2">
              <p className="font-semibold">ペイン③</p>
              <p className="text-muted-foreground">AI要約（日報詳細）</p>
              <Separator />
              <p className="text-muted-foreground">・午前中は新商品の問い合わせが多く好調でした。</p>
              <p className="text-muted-foreground">・販促キャンペーンへの反応が想定より高めでした。</p>
            </div>
            <div className="flex flex-col gap-1 bg-card p-2">
              <p className="font-semibold">ペイン④</p>
              <p className="text-muted-foreground">週報 / 月報</p>
              <Separator />
              <p className="text-muted-foreground">7/21〜7/27</p>
              <p className="text-muted-foreground">・今週は全体的に…</p>
            </div>
          </div>
        </div>

        {/* 音声入力画面図解 */}
        <div className="rounded-lg border border-border bg-muted/30 p-4">
          <p className="mb-3 text-xs font-semibold text-muted-foreground">店舗マネージャー向け音声入力ページ</p>
          <div className="flex flex-col gap-3 rounded-md border border-border bg-card p-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="rounded bg-muted px-2 py-1">店舗: 北店 ▼</span>
              <span className="rounded bg-muted px-2 py-1">シフト: 早番 ▼</span>
            </div>
            <div className="h-16 rounded border border-dashed border-border bg-muted/30 p-2 text-muted-foreground">
              （音声入力テキストがここに表示される）
            </div>
            <div className="flex gap-2">
              <span className="rounded-full bg-destructive/20 px-3 py-1 font-semibold text-destructive">● 録音中</span>
              <span className="rounded bg-primary px-3 py-1 font-semibold text-primary-foreground">送信</span>
            </div>
          </div>
        </div>
      </Section>

      {/* 保持できるデータ */}
      <Section title="② 保持できるデータ">
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            {
              title: "日報",
              items: ["店舗名", "日付", "シフト（早番/遅番）", "音声入力テキスト（全文）", "AI要約（箇条書き）"],
            },
            {
              title: "週報",
              items: ["店舗名", "対象週（月〜日）", "AI要約（日報をまとめた内容）", "生成日時"],
            },
            {
              title: "月報",
              items: ["店舗名", "対象月", "AI要約（週報をまとめた内容）", "生成日時"],
            },
          ].map((d) => (
            <div key={d.title} className="flex flex-col gap-2 rounded-md border border-border p-3">
              <p className="font-semibold">{d.title}</p>
              <ul className="flex flex-col gap-1">
                {d.items.map((item) => (
                  <li key={item} className="text-xs text-muted-foreground">・{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="rounded-md border border-border p-3">
          <p className="mb-2 text-sm font-semibold">店舗リスト</p>
          <p className="text-xs text-muted-foreground">
            店舗名をダッシュボードから追加・削除できる。全デバイスでリアルタイムに共有される。
          </p>
        </div>
      </Section>

      {/* 保存先と選定理由 */}
      <Section title="③ 保存先と選んだ理由">
        <div className="flex flex-col gap-3">
          {[
            {
              name: "Supabase（PostgreSQL）",
              role: "日報・週報・月報・店舗リストの保存",
              reason: "無料枠で複数店舗からの書き込みに対応。SQL で柔軟な検索が可能。REST API が自動生成されるため実装が簡単。",
              tags: ["無料", "マルチデバイス対応", "SQL"],
            },
            {
              name: "Vercel",
              role: "Next.js アプリのホスティング",
              reason: "GitHub にプッシュするだけで自動デプロイ。無料枠でサーバーレス関数も動作し、API ルートが使える。",
              tags: ["無料", "自動デプロイ", "サーバーレス"],
            },
            {
              name: "Google Gemini API",
              role: "日報・週報・月報の AI 要約生成",
              reason: "無料枠（1日20回）で利用可能。日本語の要約精度が高く、箇条書き形式での出力指定もできる。",
              tags: ["無料枠あり", "日本語対応", "箇条書き出力"],
            },
            {
              name: "Web Speech API（ブラウザ内蔵）",
              role: "音声のテキスト変換",
              reason: "追加アプリ・費用ゼロ。Chrome/Edge に標準搭載。マイクボタンを押すだけで使えるため操作が簡単。",
              tags: ["無料", "アプリ不要", "Edge/Chrome対応"],
            },
          ].map((s) => (
            <div key={s.name} className="flex flex-col gap-2 rounded-md border border-border p-4">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold">{s.name}</p>
                {s.tags.map((t) => <Tag key={t}>{t}</Tag>)}
              </div>
              <p className="text-xs text-muted-foreground"><span className="font-medium text-foreground">用途: </span>{s.role}</p>
              <p className="text-xs text-muted-foreground"><span className="font-medium text-foreground">選定理由: </span>{s.reason}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* 工夫・苦戦ポイント */}
      <Section title="④ 工夫したポイント・苦戦したポイント">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold text-green-600 dark:text-green-400">✦ 工夫したポイント</p>
            {[
              {
                title: "同日・同シフトの音声入力をマージ",
                body: "同じ店舗・日付・シフトに2人目が入力した場合、上書きせず1件に結合して保存。「後任者が前の報告を消してしまう」問題を防いだ。",
              },
              {
                title: "AI 要約を非同期で処理",
                body: "送信後すぐに「（要約生成中）」と表示し、AI 処理はバックグラウンドで実行。ユーザーを長時間待たせない設計にした。",
              },
              {
                title: "週報・月報の自動生成",
                body: "毎週月曜・毎月1日 6:00 に Cron ジョブで自動生成。手動で「今すぐ再生成」ボタンも設けた。",
              },
              {
                title: "パスワード認証で機密保護",
                body: "社内関係者のみが使えるようパスワード保護を実装。30 日間クッキーで維持するため、毎回ログインする手間がない。",
              },
            ].map((p) => (
              <div key={p.title} className="rounded-md border border-green-200 bg-green-50/50 p-3 dark:border-green-900 dark:bg-green-950/20">
                <p className="text-xs font-semibold">{p.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{p.body}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold text-orange-600 dark:text-orange-400">✦ 苦戦したポイント</p>
            {[
              {
                title: "Gemini API の無料枠制限",
                body: "モデルによってクォータが異なり「limit: 0」エラーが続出。SDK のバージョン変更（@google/genai）とモデルの切り替え（gemini-2.5-flash）で解決した。",
              },
              {
                title: "Supabase の自動停止",
                body: "無料プランでは一定期間アクセスがないとプロジェクトが自動停止する。停止時のエラーを握りつぶさず画面に表示し、再開手順をマニュアル化した。",
              },
              {
                title: "localStorage からの脱却",
                body: "当初は店舗リストを localStorage に保存していたため、他のデバイスで店舗が表示されない問題が発生。Supabase の stores テーブルに移行して解決した。",
              },
              {
                title: "ハイドレーションエラー",
                body: "SSR 時に localStorage を参照するとエラーが出た。useEffect 内でのみ localStorage を読む設計に変更し、後に Supabase API 取得に完全移行した。",
              },
            ].map((p) => (
              <div key={p.title} className="rounded-md border border-orange-200 bg-orange-50/50 p-3 dark:border-orange-900 dark:bg-orange-950/20">
                <p className="text-xs font-semibold">{p.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Separator />

      <footer className="flex flex-col gap-2 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">提出 URL</p>
        <div className="flex flex-col gap-1 rounded-md border border-border bg-muted/30 px-3 py-2 font-mono text-xs">
          <p>概要ページ: https://store-report-seven.vercel.app/overview</p>
          <p>デ　　　モ: https://store-report-seven.vercel.app/demo</p>
        </div>
      </footer>

    </div>
  );
}
