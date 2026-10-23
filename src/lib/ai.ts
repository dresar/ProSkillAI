import { db } from "@/db";
import { settings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { randomBytes } from "node:crypto";

export interface AiConfig {
  endpoint: string;
  apiKey: string;
  defaultModel: string;
  defaultCredits: number;
  fallbackEndpoint: string;
  fallbackApiKey: string;
  fallbackModel: string;
}

export const DEFAULT_AI_CONFIG: AiConfig = {
  endpoint: process.env.BYNARA_AI_ENDPOINT || "https://router.bynara.id/v1",
  apiKey: process.env.BYNARA_AI_KEY || "",
  defaultModel: process.env.BYNARA_DEFAULT_MODEL || "minimax-m3.1-flash:free",
  defaultCredits: 10,
  fallbackEndpoint: process.env.SUMOPOD_AI_ENDPOINT || "https://ai.sumopod.com/v1",
  fallbackApiKey: process.env.SUMOPOD_AI_KEY || "",
  fallbackModel: process.env.SUMOPOD_DEFAULT_MODEL || "deepseek-v4.1-flash:netra",
};

export const HARDCODED_AI_CONFIG = DEFAULT_AI_CONFIG;

export interface AiModelItem {
  id: string;
  name: string;
  isFree: boolean;
  inputPrice: number;
  outputPrice: number;
  contextWindow?: number;
}

export async function getStoredAiConfig(): Promise<AiConfig> {
  try {
    const row = await db.query.settings.findFirst({
      where: eq(settings.key, "ai_config"),
    });
    if (row && typeof row.value === "object" && row.value !== null) {
      return {
        ...DEFAULT_AI_CONFIG,
        ...(row.value as Partial<AiConfig>),
      };
    }
  } catch {}
  return { ...DEFAULT_AI_CONFIG };
}

export async function saveAiConfig(newConfig: Partial<AiConfig>): Promise<AiConfig> {
  const current = await getStoredAiConfig();
  const merged: AiConfig = {
    ...current,
    ...newConfig,
  };

  const existing = await db.query.settings.findFirst({
    where: eq(settings.key, "ai_config"),
  });

  if (existing) {
    await db
      .update(settings)
      .set({
        value: merged,
        updatedAt: new Date(),
      })
      .where(eq(settings.key, "ai_config"));
  } else {
    await db.insert(settings).values({
      id: randomBytes(16).toString("hex"),
      key: "ai_config",
      value: merged,
    });
  }

  return merged;
}

export async function fetchBynaraModels(): Promise<AiModelItem[]> {
  try {
    const config = await getStoredAiConfig();
    const apiKey = config.apiKey || process.env.BYNARA_AI_KEY || "";
    const endpoint = config.endpoint || process.env.BYNARA_AI_ENDPOINT || "https://router.bynara.id/v1";

    if (!apiKey) {
      return getFallbackModelList();
    }

    const res = await fetch(`${endpoint}/models`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return getFallbackModelList();
    }

    const data = await res.json();
    if (!Array.isArray(data?.data)) {
      return getFallbackModelList();
    }

    return data.data.map((m: any) => {
      const inputPrice = Number(m.input_idr_per_1k ?? 0);
      const outputPrice = Number(m.output_idr_per_1k ?? 0);
      const isFree = inputPrice === 0 && outputPrice === 0;

      return {
        id: m.id,
        name: m.name || m.id,
        isFree,
        inputPrice,
        outputPrice,
        contextWindow: m.context_window,
      };
    });
  } catch {
    return getFallbackModelList();
  }
}

function getFallbackModelList(): AiModelItem[] {
  return [
    { id: "minimax-m3.1-flash:free", name: "MiniMax M3.1 Flash Free", isFree: true, inputPrice: 0, outputPrice: 0 },
    { id: "nemotron-3.5-lightning-free", name: "Nemotron 3.5 Lightning Free", isFree: true, inputPrice: 0, outputPrice: 0 },
    { id: "laguna-s-2.1", name: "Laguna S 2.1", isFree: true, inputPrice: 0, outputPrice: 0 },
    { id: "agnes-video-v2.0", name: "Agnes Video 2.0", isFree: true, inputPrice: 0, outputPrice: 0 },
    { id: "agnes-2.5-flash", name: "Agnes 2.5 Flash", isFree: false, inputPrice: 0.1, outputPrice: 0.2 },
    { id: "agnes-3-flash", name: "Agnes 3 Flash", isFree: false, inputPrice: 0.2, outputPrice: 0.4 },
    { id: "deepseek-v4-flash", name: "DeepSeek v4 Flash", isFree: false, inputPrice: 0.34, outputPrice: 0.95 },
    { id: "qwen3.8-flash", name: "Qwen 3.8 Flash", isFree: false, inputPrice: 0.66, outputPrice: 2.08 },
    { id: "deepseek-v4-pro", name: "DeepSeek v4 Pro", isFree: false, inputPrice: 5.9, outputPrice: 17.7 },
  ];
}

export async function askSkillAi({
  skillTitle,
  skillSummary,
  skillCategory,
  skillContent,
  skillFiles,
  question,
  locale,
  config,
}: {
  skillTitle: string;
  skillSummary: string;
  skillCategory?: string | null;
  skillContent: string;
  skillFiles?: Array<{ name: string; content?: string }>;
  question: string;
  locale?: string;
  config?: AiConfig;
}): Promise<{ answer: string; modelUsed: string }> {
  const activeConfig = config || (await getStoredAiConfig());
  const isEn = locale === "en";

  const filesSummary = skillFiles && skillFiles.length > 0
    ? `\n- Auxiliary Files / Sub-Skills (${skillFiles.length}):\n` + skillFiles.map(f => `  * ${f.name}: ${(f.content || "").slice(0, 1000)}`).join("\n")
    : "";

  const systemPrompt = isEn
    ? `You are ProSkillAI Intelligent Assistant specialized in the skill "${skillTitle}".
Answer the user's question clearly, concisely, and practically based on the skill documentation and auxiliary files provided.
Use polite, helpful language and concise markdown formatting.

Skill Reference:
- Title: ${skillTitle}
- Summary: ${skillSummary}
- Category: ${skillCategory || "General"}${filesSummary}
- Documentation / Code:
${skillContent.slice(0, 16000)}`
    : `Anda adalah Asisten Cerdas ProSkillAI khusus untuk skill "${skillTitle}".
Jawab pertanyaan pengguna dengan jelas, ringkas, dan praktis berdasarkan dokumentasi skill dan berkas pendukung yang disediakan.
Gunakan format markdown yang rapi, bahasa yang ramah dan solutif.

Referensi Skill:
- Judul: ${skillTitle}
- Ringkasan: ${skillSummary}
- Kategori: ${skillCategory || "Umum"}${filesSummary}
- Dokumentasi / Konten Lengkap:
${skillContent.slice(0, 16000)}`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    const res = await fetch(`${activeConfig.endpoint}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${activeConfig.apiKey}`,
      },
      body: JSON.stringify({
        model: activeConfig.defaultModel,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: question },
        ],
        temperature: 0.5,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      const content = data?.choices?.[0]?.message?.content;
      if (content && typeof content === "string" && content.trim().length > 0) {
        return { answer: content.trim(), modelUsed: activeConfig.defaultModel };
      }
    }
  } catch {}

  const fallbackRes = await fetch(`${activeConfig.fallbackEndpoint}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${activeConfig.fallbackApiKey}`,
    },
    body: JSON.stringify({
      model: activeConfig.fallbackModel,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: question },
      ],
      temperature: 0.5,
    }),
  });

  if (!fallbackRes.ok) {
    const errText = await fallbackRes.text().catch(() => "");
    throw new Error(`AI service temporary unavailable: ${errText || fallbackRes.statusText}`);
  }

  const fallbackData = await fallbackRes.json();
  const fallbackContent = fallbackData?.choices?.[0]?.message?.content;
  if (!fallbackContent || typeof fallbackContent !== "string") {
    throw new Error("No response received from AI model");
  }

  return {
    answer: fallbackContent.trim(),
    modelUsed: `${activeConfig.fallbackModel} (fallback)`,
  };
}

export async function translateIdToEn({
  text,
  type = "title",
  config,
}: {
  text: string;
  type?: "title" | "description" | "content";
  config?: AiConfig;
}): Promise<string> {
  const trimmed = text.trim();
  if (!trimmed) return "";

  const activeConfig = config || (await getStoredAiConfig());

  const systemPrompt =
    type === "title"
      ? "You are an expert AI prompt engineer and translator. Translate this Indonesian title to concise, high-impact, professional English (title case or natural sentence case). Keep bracket variables intact like [variable]. Output ONLY the direct English translation without quotes or conversational filler."
      : type === "description"
      ? "You are an expert AI prompt engineer and translator. Translate this Indonesian description to concise, natural, professional English (1-3 sentences max). Keep bracket variables intact. Output ONLY the English translation without quotes or conversational filler."
      : "You are an expert AI prompt engineer and translator. Translate this Indonesian AI prompt template or skill instructions into professional English. CRITICAL: Preserve all variables like [variable_name] or {{variable_name}} exactly as they are without translating the variable names inside brackets or braces. Keep all markdown formatting, code fences, and structure intact. Output ONLY the translated template content without conversational filler or wrapping quotes.";

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(`${activeConfig.endpoint}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${activeConfig.apiKey}`,
      },
      body: JSON.stringify({
        model: activeConfig.defaultModel,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: trimmed },
        ],
        temperature: 0.3,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      const content = data?.choices?.[0]?.message?.content;
      if (content && typeof content === "string" && content.trim().length > 0) {
        return content.trim();
      }
    }
  } catch {}

  const fallbackRes = await fetch(`${activeConfig.fallbackEndpoint}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${activeConfig.fallbackApiKey}`,
    },
    body: JSON.stringify({
      model: activeConfig.fallbackModel,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: trimmed },
      ],
      temperature: 0.3,
    }),
  });

  if (!fallbackRes.ok) {
    throw new Error("Translation service currently unavailable");
  }

  const fallbackData = await fallbackRes.json();
  const fallbackContent = fallbackData?.choices?.[0]?.message?.content;
  if (!fallbackContent || typeof fallbackContent !== "string") {
    throw new Error("No response received from translation AI model");
  }

  return fallbackContent.trim();
}

export interface AiAuditResult {
  score: number;
  grade: "S" | "A" | "B" | "C" | "D";
  summary: string;
  strengths: string[];
  warnings: string[];
  recommendations: string[];
}

export async function auditPromptOrSkill({
  targetType,
  title,
  description,
  content,
  files = [],
  config,
}: {
  targetType: "prompt" | "skill";
  title: string;
  description: string;
  content: string;
  files?: Array<{ name: string; content: string; language?: string }>;
  config?: AiConfig;
}): Promise<AiAuditResult> {
  const activeConfig = config || (await getStoredAiConfig());

  const systemPrompt = `You are an elite AI Prompt and Skill Security & Quality Auditor.
Analyze the provided ${targetType === "prompt" ? "AI Prompt Template" : "Agent Skill Package"} thoroughly.
Evaluate its instructions, variable schema, safety/injection guardrails, structure, clarity, executability, and best practices.
Respond ONLY with a valid JSON object matching this schema:
{
  "score": number between 0 and 100,
  "grade": "S" (90-100) | "A" (80-89) | "B" (70-79) | "C" (55-69) | "D" (<55),
  "summary": "Executive summary of the audit findings in Indonesian (2-3 sentences)",
  "strengths": ["List of 2-5 positive points and strengths in Indonesian"],
  "warnings": ["List of potential flaws, security risks, ambiguous directives, or missing guards in Indonesian"],
  "recommendations": ["List of 3-6 concrete, actionable improvements in Indonesian"]
}
Do not enclose in markdown ticks or code blocks. Return strictly pure JSON.`;

  let filesSummary = "";
  if (files && files.length > 0) {
    filesSummary = `\nAttached Auxiliary Files (${files.length} files):\n` +
      files.map((f, i) => `File ${i + 1}: ${f.name} (${f.language || "text"})\n${f.content.slice(0, 1500)}`).join("\n\n");
  }

  const userPayload = `Audit Target: ${targetType.toUpperCase()}
Title: ${title}
Description: ${description}
Content:
${content.slice(0, 8000)}
${filesSummary}`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    const res = await fetch(`${activeConfig.endpoint}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${activeConfig.apiKey}`,
      },
      body: JSON.stringify({
        model: activeConfig.defaultModel,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPayload },
        ],
        temperature: 0.2,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      const rawText = data?.choices?.[0]?.message?.content;
      if (rawText && typeof rawText === "string") {
        const cleaned = rawText.replace(/^```json\s*|\s*```$/g, "").trim();
        const parsed = JSON.parse(cleaned);
        return {
          score: Number(parsed.score) || 75,
          grade: parsed.grade || "B",
          summary: parsed.summary || "Audit selesai.",
          strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
          warnings: Array.isArray(parsed.warnings) ? parsed.warnings : [],
          recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
        };
      }
    }
  } catch {}

  const fallbackRes = await fetch(`${activeConfig.fallbackEndpoint}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${activeConfig.fallbackApiKey}`,
    },
    body: JSON.stringify({
      model: activeConfig.fallbackModel,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPayload },
      ],
      temperature: 0.2,
    }),
  });

  if (!fallbackRes.ok) {
    throw new Error("Audit service temporarily unavailable");
  }

  const fallbackData = await fallbackRes.json();
  const rawFallback = fallbackData?.choices?.[0]?.message?.content;
  if (!rawFallback || typeof rawFallback !== "string") {
    throw new Error("No response received from audit AI model");
  }

  const cleaned = rawFallback.replace(/^```json\s*|\s*```$/g, "").trim();
  const parsed = JSON.parse(cleaned);

  return {
    score: Number(parsed.score) || 75,
    grade: parsed.grade || "B",
    summary: parsed.summary || "Audit selesai.",
    strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
    warnings: Array.isArray(parsed.warnings) ? parsed.warnings : [],
    recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
  };
}

export async function testAiModel(
  modelId: string,
  config?: AiConfig
): Promise<{ success: boolean; latencyMs: number; message: string }> {
  const activeConfig = config || (await getStoredAiConfig());
  const start = Date.now();

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(`${activeConfig.endpoint}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${activeConfig.apiKey}`,
      },
      body: JSON.stringify({
        model: modelId,
        messages: [{ role: "user", content: "ping" }],
        max_tokens: 10,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);
    const latencyMs = Date.now() - start;

    if (res.ok) {
      const data = await res.json();
      const reply = data?.choices?.[0]?.message?.content ?? "OK";
      return {
        success: true,
        latencyMs,
        message: `Online (${reply.slice(0, 30)})`,
      };
    }

    const errJson = await res.json().catch(() => null);
    const errMsg = errJson?.error?.message || `HTTP ${res.status}`;
    return {
      success: false,
      latencyMs,
      message: errMsg,
    };
  } catch (err: any) {
    const latencyMs = Date.now() - start;
    return {
      success: false,
      latencyMs,
      message: err?.message || "Request timed out",
    };
  }
}