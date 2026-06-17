import { GoogleGenAI } from "@google/genai";

function getClient() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY is not set");
  return new GoogleGenAI({ apiKey: key });
}

async function generate(prompt: string): Promise<string> {
  const ai = getClient();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });
  return response.text?.trim() ?? "";
}

/**
 * 日報テキストを100文字以内に要約する
 */
export async function summarizeReport(transcript: string): Promise<string> {
  const prompt = `以下は同日・同シフトで複数のスタッフが入力した日報です（「---」で区切られています）。
時系列順に並んでいるため、後の入力が前の内容を上書き・解決している場合はその最終状態を優先してください。
100文字以内で要点を箇条書きせず簡潔に要約してください。

${transcript}`;
  return generate(prompt);
}

/**
 * 複数の日報要約から週報を生成する
 */
export async function generateWeeklySummary(
  storeName: string,
  periodLabel: string,
  reportSummaries: string[],
): Promise<string> {
  const reports = reportSummaries
    .map((s, i) => `【${i + 1}件目】${s}`)
    .join("\n");
  const prompt = `以下は${storeName}の${periodLabel}の日報サマリーです（計${reportSummaries.length}件）。
週次レポートとして200文字以内でまとめてください。
良かった点・課題・来週へのアクション候補を含めてください。

${reports}`;
  return generate(prompt);
}

/**
 * 複数の週報から月報を生成する
 */
export async function generateMonthlySummary(
  storeName: string,
  year: number,
  month: number,
  weeklySummaries: string[],
): Promise<string> {
  const summaries = weeklySummaries
    .map((s, i) => `【第${i + 1}週】${s}`)
    .join("\n");
  const prompt = `以下は${storeName}の${year}年${month}月の週報です（計${weeklySummaries.length}週）。
月次レポートとして300文字以内でまとめてください。
月全体の傾向・継続課題・翌月への提言を含めてください。

${summaries}`;
  return generate(prompt);
}
