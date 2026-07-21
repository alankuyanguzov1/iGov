import { NextResponse } from "next/server";
import { getBenefitBySlug } from "@/content/benefits";

/**
 * Модуль «Понятный закон»: отвечает на вопрос пользователя о конкретной льготе.
 * Модель получает ТОЛЬКО верифицированный контент карточки и обязана отвечать
 * строго по нему. Расчет права на льготу этот модуль не выполняет никогда:
 * eligibility считает детерминированный движок правил.
 */

const WINDOW_MS = 60 * 60 * 1000;
const LIMIT_PER_HOUR = 10;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= LIMIT_PER_HOUR) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

const SYSTEM_PROMPT =
  "Ты консультант сервиса GovAid Navigator по мерам государственной поддержки Казахстана. " +
  "Отвечай на вопрос пользователя ТОЛЬКО на основе переданного контекста карточки льготы. " +
  "Правила: пиши простым разговорным русским языком без юридического жаргона; " +
  "2-5 коротких предложений; без markdown, без списков, без эмодзи; " +
  "никогда не гарантируй назначение выплаты и не выдумывай суммы, условия или сроки, которых нет в контексте; " +
  "если в контексте нет ответа на вопрос, честно скажи об этом и посоветуй посмотреть закон по ссылке на карточке или уточнить в госоргане.";

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  let body: { slug?: unknown; question?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const slug = typeof body.slug === "string" ? body.slug : "";
  const question = typeof body.question === "string" ? body.question.trim() : "";

  if (!slug || question.length < 3 || question.length > 500) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const benefit = getBenefitBySlug(slug);
  if (!benefit) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const context = [
    `Название льготы: ${benefit.title}`,
    `Что получите: ${benefit.whatYouGet}`,
    `Кто имеет право: ${benefit.whoEligible.join("; ")}`,
    `Как оформить: ${benefit.howToApply.join("; ")}`,
    `Документы: ${benefit.documents.join("; ")}`,
    `Размер: ${benefit.amountFormula}. ${benefit.amountExample}`,
    `Правовое основание: ${benefit.legalRef}`,
    benefit.proactive
      ? "Особенность: льгота часто назначается государством автоматически через SMS от 1414"
      : "",
  ]
    .filter(Boolean)
    .join("\n");

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [
          {
            role: "user",
            parts: [{ text: `Контекст карточки:\n${context}\n\nВопрос пользователя: ${question}` }],
          },
        ],
        generationConfig: { temperature: 0.2, maxOutputTokens: 500 },
      }),
    },
  );

  if (!response.ok) {
    const details = await response.text();
    console.error(`[explain] Gemini error ${response.status}: ${details.slice(0, 500)}`);
    return NextResponse.json({ error: "llm_error" }, { status: 502 });
  }

  const data = (await response.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  const answer =
    data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") ?? "";

  if (!answer) {
    return NextResponse.json({ error: "llm_error" }, { status: 502 });
  }

  return NextResponse.json({ answer });
}
