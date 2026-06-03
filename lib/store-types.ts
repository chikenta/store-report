export type Shift = "早番" | "遅番";

export interface Report {
  id: string;
  store_name: string;
  shift: Shift;
  reported_at: string;
  transcript: string;
  summary: string;
  created_at: string;
}

export interface WeeklySummary {
  id: string;
  store_name: string;
  year: number;
  week: number;
  period_label: string;
  summary: string;
  auto_generated: boolean;
  created_at: string;
}

export interface MonthlySummary {
  id: string;
  store_name: string;
  year: number;
  month: number;
  summary: string;
  auto_generated: boolean;
  created_at: string;
}
