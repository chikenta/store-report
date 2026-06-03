-- ============================================================
-- 店舗レポートシステム Supabase スキーマ
-- Supabase の SQL Editor に貼り付けて実行してください
-- ============================================================

-- 日報テーブル
create table if not exists reports (
  id           uuid primary key default gen_random_uuid(),
  store_name   text not null,
  shift        text not null check (shift in ('早番', '遅番')),
  reported_at  timestamptz not null default now(),
  transcript   text not null,
  summary      text not null default '',
  created_at   timestamptz not null default now()
);

-- 週報テーブル
create table if not exists weekly_summaries (
  id             uuid primary key default gen_random_uuid(),
  store_name     text not null,
  year           integer not null,
  week           integer not null,
  period_label   text not null,
  summary        text not null,
  auto_generated boolean not null default false,
  created_at     timestamptz not null default now(),
  unique (store_name, year, week)
);

-- 月報テーブル
create table if not exists monthly_summaries (
  id             uuid primary key default gen_random_uuid(),
  store_name     text not null,
  year           integer not null,
  month          integer not null,
  summary        text not null,
  auto_generated boolean not null default false,
  created_at     timestamptz not null default now(),
  unique (store_name, year, month)
);

-- インデックス（一覧取得を高速化）
create index if not exists reports_store_reported on reports (store_name, reported_at desc);
create index if not exists weekly_store_year_week on weekly_summaries (store_name, year desc, week desc);
create index if not exists monthly_store_year_month on monthly_summaries (store_name, year desc, month desc);
