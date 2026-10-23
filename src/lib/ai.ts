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

export const HARDCODED_AI_CONFIG: AiConfig = {
  endpoint: "https://router.bynara.id/v1",
  apiKey: "sk-nry-fhA6_hkXV0V1FZRIg8MRpcEI5VnDiYjUIeaodT-_ORc",
  defaultModel: "minimax-m3.1-flash:free",
  defaultCredits: 5,
  fallbackEndpoint: "https://ai.sumopod.com/v1",
  fallbackApiKey: "sk-4itm0rxnVD9ng2dyPI3x3A",
  fallbackModel: "deepseek-v4.1-flash:netra",
};

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
        ...HARDCODED_AI_CONFIG,
        ...(row.value as Partial<AiConfig>),
      };
    }
  } catch {}
  return { ...HARDCODED_AI_CONFIG };
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
    const res = await fetch("https://router.bynara.id/v1/models", {
      headers: {
        Authorization: `Bearer ${HARDCODED_AI_CONFIG.apiKey}`,
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
  question,
  locale,
  config,
}: {
  skillTitle: string;
  skillSummary: string;
  skillCategory?: string | null;
  skillContent: string;
  question: string;
  locale?: string;
  config?: AiConfig;
}): Promise<{ answer: string; modelUsed: string }> {
  const activeConfig = config || (await getStoredAiConfig());
  const isEn = locale === "en";

  const systemPrompt = isEn
    ? `You are ProSkillAI Intelligent Assistant specialized in the skill "${skillTitle}".
Answer the user's question clearly, concisely, and practically based on the skill documentation provided.
Use polite, helpful language and concise markdown formatting.

Skill Reference:
- Title: ${skillTitle}
- Summary: ${skillSummary}
- Category: ${skillCategory || "General"}
- Documentation / Code:
${skillContent.slice(0, 8000)}`
    : `Anda adalah Asisten Cerdas ProSkillAI khusus untuk skill "${skillTitle}".
Jawab pertanyaan pengguna dengan jelas, ringkas, dan praktis berdasarkan dokumentasi skill yang disediakan.
Gunakan format markdown yang rapi, bahasa yang ramah dan solutif.

Referensi Skill:
- Judul: ${skillTitle}
- Ringkasan: ${skillSummary}
- Kategori: ${skillCategory || "Umum"}
- Dokumentasi / Konten Lengkap:
${skillContent.slice(0, 8000)}`;

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