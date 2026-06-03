import type { MonthlySummary, Report, WeeklySummary } from "@/lib/store-types";

/** 設計時 Canvas と同じサンプルデータ（API 不要） */
export const DEMO_REPORTS: Report[] = [
  {
    id: "demo-1",
    store_name: "北店",
    shift: "早番",
    reported_at: "2026-06-03T00:00:00.000Z",
    summary:
      "売上は目標比105%で好調。常連客から接客の褒め言葉。来週シフト調整が必要。",
    transcript: "",
    created_at: "2026-06-03T00:00:00.000Z",
  },
  {
    id: "demo-2",
    store_name: "北店",
    shift: "遅番",
    reported_at: "2026-06-03T09:00:00.000Z",
    summary: "夕方から混雑。レジ待ち15分発生。明日の朝に在庫確認を引き継ぎ。",
    transcript: "",
    created_at: "2026-06-03T09:00:00.000Z",
  },
  {
    id: "demo-3",
    store_name: "北店",
    shift: "早番",
    reported_at: "2026-06-02T00:00:00.000Z",
    summary: "納品トラブルで10分遅延開店。業者に確認済み、翌日から正常化。",
    transcript: "",
    created_at: "2026-06-02T00:00:00.000Z",
  },
  {
    id: "demo-4",
    store_name: "南店",
    shift: "早番",
    reported_at: "2026-06-03T00:00:00.000Z",
    summary: "新商品の反応が良好。複数のお客様から問い合わせあり。在庫追加を検討。",
    transcript: "",
    created_at: "2026-06-03T00:00:00.000Z",
  },
  {
    id: "demo-5",
    store_name: "東店",
    shift: "早番",
    reported_at: "2026-06-03T00:00:00.000Z",
    summary: "空調設備の不具合。業者へ連絡済みで本日午後に対応予定。",
    transcript: "",
    created_at: "2026-06-03T00:00:00.000Z",
  },
  {
    id: "demo-6",
    store_name: "西店",
    shift: "遅番",
    reported_at: "2026-06-03T09:00:00.000Z",
    summary: "閉店直前に混雑。スタッフ1名体調不良で早退。明日のシフト要確認。",
    transcript: "",
    created_at: "2026-06-03T09:00:00.000Z",
  },
];

export const DEMO_WEEKLIES: WeeklySummary[] = [
  {
    id: "demo-w1",
    store_name: "北店",
    year: 2026,
    week: 23,
    period_label: "6/2〜6/8",
    summary:
      "売上は目標比+3%で好調。水曜夕方の混雑対応が課題。レジ要員の増強を検討。常連客からの評価は高く接客品質は維持。",
    auto_generated: true,
    created_at: "2026-06-09T00:00:00.000Z",
  },
  {
    id: "demo-w2",
    store_name: "北店",
    year: 2026,
    week: 22,
    period_label: "5/26〜6/1",
    summary:
      "売上は前週比−1%とやや低下。雨天の影響で客足が減少。スタッフ欠員が1件発生し対応済み。",
    auto_generated: true,
    created_at: "2026-06-02T00:00:00.000Z",
  },
  {
    id: "demo-w3",
    store_name: "北店",
    year: 2026,
    week: 21,
    period_label: "5/19〜5/25",
    summary:
      "売上は目標比+5%で好調。新商品の導入効果が顕著。接客トラブル0件で品質安定。",
    auto_generated: true,
    created_at: "2026-05-26T00:00:00.000Z",
  },
];

export const DEMO_MONTHLIES: MonthlySummary[] = [
  {
    id: "demo-m1",
    store_name: "北店",
    year: 2026,
    month: 5,
    summary:
      "月間売上は目標比+1.2%。週末の客数増加が主因。スタッフ満足度は安定。設備面では空調修理が完了。来月の繁忙期に向けて増員採用を推奨。",
    auto_generated: true,
    created_at: "2026-06-01T00:00:00.000Z",
  },
];
