import type { MonthlySummary, Report, WeeklySummary } from "@/lib/store-types";

/** 設計時 Canvas と同じサンプルデータ（API 不要） */
export const DEMO_REPORTS: Report[] = [
  // ── 北店 ──────────────────────────────────────────────
  {
    id: "demo-1",
    store_name: "北店",
    shift: "早番",
    reported_at: "2026-06-03T00:00:00.000Z",
    summary:
      "売上は目標比105%で好調。常連客から接客の褒め言葉をいただいた。来週のシフト調整が必要。",
    transcript: "",
    created_at: "2026-06-03T00:00:00.000Z",
  },
  {
    id: "demo-2",
    store_name: "北店",
    shift: "遅番",
    reported_at: "2026-06-03T09:00:00.000Z",
    summary:
      "夕方から混雑。レジ待ち15分発生。明日の朝に在庫確認を引き継ぎ予定。",
    transcript: "",
    created_at: "2026-06-03T09:00:00.000Z",
  },
  {
    id: "demo-3",
    store_name: "北店",
    shift: "早番",
    reported_at: "2026-06-02T00:00:00.000Z",
    summary:
      "納品トラブルで10分遅延開店。業者に確認済み、翌日から正常化。売上は平常通り。",
    transcript: "",
    created_at: "2026-06-02T00:00:00.000Z",
  },
  {
    id: "demo-3b",
    store_name: "北店",
    shift: "遅番",
    reported_at: "2026-06-02T09:00:00.000Z",
    summary:
      "閉店作業中にPOSレジの不具合。再起動で復旧。翌日の始業時に再確認予定。",
    transcript: "",
    created_at: "2026-06-02T09:00:00.000Z",
  },
  // ── 南店 ──────────────────────────────────────────────
  {
    id: "demo-4",
    store_name: "南店",
    shift: "早番",
    reported_at: "2026-06-03T00:00:00.000Z",
    summary:
      "新商品の反応が良好。複数のお客様から問い合わせあり。在庫追加を検討中。",
    transcript: "",
    created_at: "2026-06-03T00:00:00.000Z",
  },
  {
    id: "demo-4b",
    store_name: "南店",
    shift: "遅番",
    reported_at: "2026-06-03T09:00:00.000Z",
    summary:
      "夜間は客数少なめで売上は目標比92%。スタッフ2名が丁寧な接客でクレームゼロ。",
    transcript: "",
    created_at: "2026-06-03T09:00:00.000Z",
  },
  {
    id: "demo-4c",
    store_name: "南店",
    shift: "早番",
    reported_at: "2026-06-02T00:00:00.000Z",
    summary:
      "催事コーナーの陳列を変更。お客様の回遊率が上がり売上前日比+8%を達成。",
    transcript: "",
    created_at: "2026-06-02T00:00:00.000Z",
  },
  {
    id: "demo-4d",
    store_name: "南店",
    shift: "遅番",
    reported_at: "2026-06-01T09:00:00.000Z",
    summary:
      "雨天のため客足が少なく静かな営業。スタッフ研修を実施、接客スクリプトを全員で確認した。",
    transcript: "",
    created_at: "2026-06-01T09:00:00.000Z",
  },
  // ── 東店 ──────────────────────────────────────────────
  {
    id: "demo-5",
    store_name: "東店",
    shift: "早番",
    reported_at: "2026-06-03T00:00:00.000Z",
    summary:
      "空調設備の不具合を確認。業者へ連絡済みで本日午後に対応予定。営業は通常通り実施。",
    transcript: "",
    created_at: "2026-06-03T00:00:00.000Z",
  },
  {
    id: "demo-5b",
    store_name: "東店",
    shift: "遅番",
    reported_at: "2026-06-03T09:00:00.000Z",
    summary:
      "空調修理完了。夕方のピーク時に客数増。売上は目標比+4%で好調な1日となった。",
    transcript: "",
    created_at: "2026-06-03T09:00:00.000Z",
  },
  {
    id: "demo-5c",
    store_name: "東店",
    shift: "早番",
    reported_at: "2026-06-02T00:00:00.000Z",
    summary:
      "常連客から商品リクエストあり。仕入れ担当に共有済み。来週の入荷予定を確認中。",
    transcript: "",
    created_at: "2026-06-02T00:00:00.000Z",
  },
  {
    id: "demo-5d",
    store_name: "東店",
    shift: "早番",
    reported_at: "2026-06-01T00:00:00.000Z",
    summary:
      "月初めで客数多め。レジ2台フル稼働でスムーズに対応。売上は目標比+7%と好スタート。",
    transcript: "",
    created_at: "2026-06-01T00:00:00.000Z",
  },
  // ── 西店 ──────────────────────────────────────────────
  {
    id: "demo-6",
    store_name: "西店",
    shift: "遅番",
    reported_at: "2026-06-03T09:00:00.000Z",
    summary:
      "閉店直前に混雑。スタッフ1名体調不良で早退。明日のシフト要確認。在庫補充は完了。",
    transcript: "",
    created_at: "2026-06-03T09:00:00.000Z",
  },
  {
    id: "demo-6b",
    store_name: "西店",
    shift: "早番",
    reported_at: "2026-06-03T00:00:00.000Z",
    summary:
      "周辺エリアでイベントがあり客足が増加。売上は目標比+12%と大幅達成。スタッフ全員が丁寧に対応。",
    transcript: "",
    created_at: "2026-06-03T00:00:00.000Z",
  },
  {
    id: "demo-6c",
    store_name: "西店",
    shift: "遅番",
    reported_at: "2026-06-02T09:00:00.000Z",
    summary:
      "夜間清掃時に照明の一部が点滅。電気設備の点検を手配。営業中は問題なし。",
    transcript: "",
    created_at: "2026-06-02T09:00:00.000Z",
  },
  {
    id: "demo-6d",
    store_name: "西店",
    shift: "早番",
    reported_at: "2026-06-01T00:00:00.000Z",
    summary:
      "新スタッフが初出勤。先輩スタッフのOJTで問題なく業務遂行。お客様への対応も丁寧で好印象。",
    transcript: "",
    created_at: "2026-06-01T00:00:00.000Z",
  },
];

export const DEMO_WEEKLIES: WeeklySummary[] = [
  // ── 北店 ──────────────────────────────────────────────
  {
    id: "demo-w1",
    store_name: "北店",
    year: 2026,
    week: 23,
    period_label: "6/2〜6/8",
    summary:
      "売上は目標比+3%で好調。水曜夕方の混雑対応が課題でレジ要員の増強を検討。納品トラブルが1件あったが翌日に正常化。常連客からの評価は高く接客品質を維持。",
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
      "売上は前週比−1%とやや低下。雨天の影響で客足が減少。スタッフ欠員が1件発生し対応済み。週後半は回復傾向で翌週に期待。",
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
      "売上は目標比+5%で好調。新商品の導入効果が顕著。接客トラブル0件で品質安定。週末の集客施策が功を奏した。",
    auto_generated: true,
    created_at: "2026-05-26T00:00:00.000Z",
  },
  // ── 南店 ──────────────────────────────────────────────
  {
    id: "demo-w4",
    store_name: "南店",
    year: 2026,
    week: 23,
    period_label: "6/2〜6/8",
    summary:
      "新商品の反応が好評で売上は目標比+6%。催事コーナーのレイアウト変更が客数増に貢献。雨天日の落ち込みを週末で挽回。接客クレームなし。",
    auto_generated: true,
    created_at: "2026-06-09T00:00:00.000Z",
  },
  {
    id: "demo-w5",
    store_name: "南店",
    year: 2026,
    week: 22,
    period_label: "5/26〜6/1",
    summary:
      "売上は目標比ほぼ同水準。スタッフ研修を実施し接客スキルが向上。週末はキャンペーン効果で客数+15%を記録。",
    auto_generated: true,
    created_at: "2026-06-02T00:00:00.000Z",
  },
  {
    id: "demo-w6",
    store_name: "南店",
    year: 2026,
    week: 21,
    period_label: "5/19〜5/25",
    summary:
      "連休明けで売上が一時落ち込むも週後半に回復。在庫管理の改善で欠品が減少。スタッフのモチベーションは高い。",
    auto_generated: true,
    created_at: "2026-05-26T00:00:00.000Z",
  },
  // ── 東店 ──────────────────────────────────────────────
  {
    id: "demo-w7",
    store_name: "東店",
    year: 2026,
    week: 23,
    period_label: "6/2〜6/8",
    summary:
      "空調トラブルが発生したが当日中に修理完了。影響は最小限で売上への影響なし。週全体では目標比+4%を達成。常連客からのリクエスト商品の入荷調整を進行中。",
    auto_generated: true,
    created_at: "2026-06-09T00:00:00.000Z",
  },
  {
    id: "demo-w8",
    store_name: "東店",
    year: 2026,
    week: 22,
    period_label: "5/26〜6/1",
    summary:
      "月初めで客数が多く売上は目標比+7%の好スタート。スタッフ2名増員でレジ待ちを解消。接客満足度調査で高評価を獲得。",
    auto_generated: true,
    created_at: "2026-06-02T00:00:00.000Z",
  },
  {
    id: "demo-w9",
    store_name: "東店",
    year: 2026,
    week: 21,
    period_label: "5/19〜5/25",
    summary:
      "売上は目標比−2%とやや低調。競合店の特売が影響か。差別化施策として接客力強化研修を来週実施予定。",
    auto_generated: true,
    created_at: "2026-05-26T00:00:00.000Z",
  },
  // ── 西店 ──────────────────────────────────────────────
  {
    id: "demo-w10",
    store_name: "西店",
    year: 2026,
    week: 23,
    period_label: "6/2〜6/8",
    summary:
      "周辺イベント効果で売上が大幅増。火曜の目標比+12%が週全体を押し上げ、週計で+8%を達成。新スタッフのOJTも順調。照明設備の点検を完了。",
    auto_generated: true,
    created_at: "2026-06-09T00:00:00.000Z",
  },
  {
    id: "demo-w11",
    store_name: "西店",
    year: 2026,
    week: 22,
    period_label: "5/26〜6/1",
    summary:
      "売上は目標比+2%で安定。スタッフ体調不良による欠員が1件発生し即対応。閉店時間帯の混雑が続いており人員配置の見直しを検討。",
    auto_generated: true,
    created_at: "2026-06-02T00:00:00.000Z",
  },
  {
    id: "demo-w12",
    store_name: "西店",
    year: 2026,
    week: 21,
    period_label: "5/19〜5/25",
    summary:
      "新スタッフ採用の準備期間。既存スタッフの負担が増えたが全員がカバー。売上は目標比ほぼ同水準を維持。",
    auto_generated: true,
    created_at: "2026-05-26T00:00:00.000Z",
  },
];

export const DEMO_MONTHLIES: MonthlySummary[] = [
  // ── 北店 ──────────────────────────────────────────────
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
  {
    id: "demo-m1b",
    store_name: "北店",
    year: 2026,
    month: 4,
    summary:
      "4月は新年度効果で客数が増加し、売上は目標比+3.5%を達成。新商品の導入が好調。人員補強を実施しスタッフ体制が安定。",
    auto_generated: true,
    created_at: "2026-05-01T00:00:00.000Z",
  },
  // ── 南店 ──────────────────────────────────────────────
  {
    id: "demo-m2",
    store_name: "南店",
    year: 2026,
    month: 5,
    summary:
      "5月は連休を中心に集客が好調で売上は目標比+4.1%。催事コーナーのリニューアルが功を奏した。スタッフ研修を2回実施し接客品質が向上。来月はキャンペーン施策を継続予定。",
    auto_generated: true,
    created_at: "2026-06-01T00:00:00.000Z",
  },
  {
    id: "demo-m2b",
    store_name: "南店",
    year: 2026,
    month: 4,
    summary:
      "売上は目標比+0.8%とほぼ計画通り。在庫管理の改善により欠品率が前月比−30%に低下。新スタッフ2名が順調に業務習得中。",
    auto_generated: true,
    created_at: "2026-05-01T00:00:00.000Z",
  },
  // ── 東店 ──────────────────────────────────────────────
  {
    id: "demo-m3",
    store_name: "東店",
    year: 2026,
    month: 5,
    summary:
      "設備トラブル（空調）が1件発生したが即日対応。売上への影響は軽微で月間では目標比+2.3%を達成。常連客からの要望を収集し仕入れ計画に反映。来月も安定した運営を目指す。",
    auto_generated: true,
    created_at: "2026-06-01T00:00:00.000Z",
  },
  {
    id: "demo-m3b",
    store_name: "東店",
    year: 2026,
    month: 4,
    summary:
      "4月は競合店の特売影響で売上が目標比−1.5%とやや低調。対策として接客強化研修を実施。5月以降の回復に向けた施策を立案中。",
    auto_generated: true,
    created_at: "2026-05-01T00:00:00.000Z",
  },
  // ── 西店 ──────────────────────────────────────────────
  {
    id: "demo-m4",
    store_name: "西店",
    year: 2026,
    month: 5,
    summary:
      "周辺イベントとの連携施策が奏功し5月の売上は目標比+5.8%と好調。新スタッフの採用・育成が完了しチーム体制が強化。設備点検（照明）を実施し安全性を確認。来月は夏季キャンペーンを展開予定。",
    auto_generated: true,
    created_at: "2026-06-01T00:00:00.000Z",
  },
  {
    id: "demo-m4b",
    store_name: "西店",
    year: 2026,
    month: 4,
    summary:
      "4月は閉店時間帯の混雑対応が課題だったが、人員配置の見直しで5月から改善。売上は目標比+1.2%で安定推移。スタッフのモチベーション向上施策として表彰制度を導入。",
    auto_generated: true,
    created_at: "2026-05-01T00:00:00.000Z",
  },
];
