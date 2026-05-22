import { buildAiContext, type AiMetricsContext } from "@/lib/ai-context";
import type { AiAgentKind, AiRequestBody, AiResponse } from "@/lib/ai-types";

const model = "gpt-4o-mini";

const aiResponseSchema = {
  type: "object",
  additionalProperties: false,
  required: ["language", "answer", "recommendations", "trace", "usedMetrics", "dataLineage", "qualityChecks"],
  properties: {
    language: { type: "string", enum: ["uk", "en"] },
    answer: { type: "string" },
    recommendations: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["title", "priority", "rationale"],
        properties: {
          title: { type: "string" },
          priority: { type: "string", enum: ["high", "medium", "low"] },
          rationale: { type: "string" }
        }
      }
    },
    trace: {
      type: "object",
      additionalProperties: false,
      required: ["selectedMetrics", "detectedPatterns", "reasoningSummary", "confidence", "riskLevel"],
      properties: {
        selectedMetrics: { type: "array", items: { type: "string" } },
        detectedPatterns: { type: "array", items: { type: "string" } },
        reasoningSummary: { type: "string" },
        confidence: { type: "number", minimum: 0, maximum: 1 },
        riskLevel: { type: "string", enum: ["low", "medium", "high"] }
      }
    },
    usedMetrics: { type: "array", items: { type: "string" } },
    dataLineage: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["source", "filter", "impact"],
        properties: {
          source: { type: "string" },
          filter: { type: "string" },
          impact: { type: "string", enum: ["primary", "supporting"] }
        }
      }
    },
    qualityChecks: {
      type: "object",
      additionalProperties: false,
      required: ["groundedInData", "missingDataWarnings", "hallucinationRisk"],
      properties: {
        groundedInData: { type: "boolean" },
        missingDataWarnings: { type: "array", items: { type: "string" } },
        hallucinationRisk: { type: "string", enum: ["low", "medium", "high"] }
      }
    }
  }
} as const;

export async function runAiAgent(kind: AiAgentKind, body: AiRequestBody): Promise<AiResponse> {
  const language = body.language === "en" ? "en" : "uk";
  const context = buildAiContext({ filters: body.filters, fixtureId: body.fixtureId });
  const fallback = buildFallbackResponse(kind, language, context, body);

  if (!process.env.OPENAI_API_KEY) {
    return withWarning(fallback, language === "uk" ? "OPENAI_API_KEY відсутній, показано локальний grounded fallback." : "OPENAI_API_KEY is missing, showing local grounded fallback.");
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content: systemPrompt(kind, language)
          },
          {
            role: "user",
            content: JSON.stringify({
              task: taskPrompt(kind, language, body),
              question: body.question,
              currentAiOutputToEvaluate: kind === "evaluate" ? body.previousResponse : undefined,
              context
            })
          }
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "football_ai_response",
            strict: true,
            schema: aiResponseSchema
          }
        },
        max_tokens: 1300
      })
    });

    if (!response.ok) {
      return withWarning(fallback, language === "uk" ? "OpenAI API тимчасово недоступний, показано локальний grounded fallback." : "OpenAI API is unavailable, showing local grounded fallback.");
    }

    const payload = (await response.json()) as {
      choices?: { message?: { content?: string | null } }[];
    };
    const outputText = payload.choices?.[0]?.message?.content;
    if (!outputText) {
      return withWarning(fallback, language === "uk" ? "OpenAI не повернув структурований текст, показано fallback." : "OpenAI did not return structured text, showing fallback.");
    }

    return normalizeAiResponse(JSON.parse(outputText), fallback);
  } catch {
    return withWarning(fallback, language === "uk" ? "AI-запит не вдався, показано локальний grounded fallback." : "AI request failed, showing local grounded fallback.");
  }
}

function systemPrompt(kind: AiAgentKind, language: "uk" | "en") {
  const role = {
    insights: "You are a football intelligence analyst explaining dashboard signals.",
    chat: "You are an AI Analyst answering a user's football operations question.",
    "match-prep": "You are a match preparation agent for coaching staff.",
    report: "You are a weekly executive football intelligence report agent.",
    evaluate: "You are an AI evaluation agent checking groundedness and risk."
  }[kind];

  return [
    role,
    "Return JSON only and follow the supplied JSON schema.",
    "Use only supplied demo metrics. Do not invent official live football facts.",
    "Do not reveal hidden chain-of-thought. Use trace.reasoningSummary as a concise audit summary.",
    language === "uk" ? "Write user-facing strings in Ukrainian." : "Write user-facing strings in English."
  ].join(" ");
}

function taskPrompt(kind: AiAgentKind, language: "uk" | "en", body: AiRequestBody) {
  const prompts = {
    insights:
      language === "uk"
        ? "Сформуй короткий dashboard insight: що відбувається, які метрики це підтримують, і що робити далі."
        : "Create a concise dashboard insight: what is happening, which metrics support it, and what to do next.",
    chat:
      language === "uk"
        ? `Дай відповідь на питання аналітика: ${body.question || "Який головний ризик зараз?"}`
        : `Answer the analyst question: ${body.question || "What is the main risk right now?"}`,
    "match-prep":
      language === "uk"
        ? "Підготуй tactical briefing для наступного матчу: opponent overview, risks, game plan, key matchups, missing-data warnings."
        : "Prepare a tactical briefing for the next fixture: opponent overview, risks, game plan, key matchups, missing-data warnings.",
    report:
      language === "uk"
        ? "Згенеруй стислий weekly executive report з ризиками, можливостями та діями."
        : "Generate a concise weekly executive report with risks, opportunities, and actions.",
    evaluate:
      language === "uk"
        ? "Оціни groundedness, missing data, confidence і hallucination risk для поточного AI-висновку."
        : "Evaluate groundedness, missing data, confidence, and hallucination risk for the current AI output."
  };
  return prompts[kind];
}

function buildFallbackResponse(
  kind: AiAgentKind,
  language: "uk" | "en",
  context: AiMetricsContext,
  body: AiRequestBody
): AiResponse {
  const highRisk = context.tacticalMetrics.tacticalRiskScore >= 68;
  const mediumRisk = context.tacticalMetrics.tacticalRiskScore >= 48;
  const riskLevel = highRisk ? "high" : mediumRisk ? "medium" : "low";
  const selectedMetrics = ["formIndex", "awayFormIndex", "xGD", "defensiveStability", "tacticalRiskScore", "transitionRisk"];
  const detectedPattern =
    context.tacticalMetrics.transitionRisk > 60
      ? language === "uk"
        ? "Перехідна оборона є головним ризиковим сигналом у вибірці."
        : "Transition defense is the main risk signal in the selected scope."
      : language === "uk"
        ? "Поточний профіль виглядає контрольованим, але away form потребує моніторингу."
        : "The current profile is controlled, while away form still needs monitoring.";

  const answerByKind = {
    insights:
      language === "uk"
        ? `Форма команди тримається на рівні ${context.teamMetrics.formIndex}, але тактичний ризик ${Math.round(context.tacticalMetrics.tacticalRiskScore)}/100 вимагає уваги до перехідної оборони. xGD становить ${context.teamMetrics.xGD}, тому проблема більше в контролі ризику, ніж у створенні моментів.`
        : `Team form is at ${context.teamMetrics.formIndex}, but tactical risk at ${Math.round(context.tacticalMetrics.tacticalRiskScore)}/100 requires attention to transition defense. xGD is ${context.teamMetrics.xGD}, so the issue is more about risk control than chance creation.`,
    chat:
      language === "uk"
        ? `Питання: ${body.question || "головний ризик"}. Найважливіший сигнал зараз - tactical risk ${Math.round(context.tacticalMetrics.tacticalRiskScore)}/100 і transition risk ${Math.round(context.tacticalMetrics.transitionRisk)}/100. Це варто пов'язати з away form index ${context.teamMetrics.awayFormIndex}.`
        : `Question: ${body.question || "main risk"}. The strongest signal is tactical risk at ${Math.round(context.tacticalMetrics.tacticalRiskScore)}/100 and transition risk at ${Math.round(context.tacticalMetrics.transitionRisk)}/100. This should be read together with away form index ${context.teamMetrics.awayFormIndex}.`,
    "match-prep":
      language === "uk"
        ? `Наступний суперник - ${context.nextFixture.opponent}. Потрібен план із контролем втрат м'яча, захистом центральних переходів і використанням слабких зон суперника: ${context.nextFixture.opponentWeaknesses.join(", ")}.`
        : `Next opponent: ${context.nextFixture.opponent}. The plan should control turnovers, protect central transitions, and attack opponent weaknesses: ${context.nextFixture.opponentWeaknesses.join(", ")}.`,
    report:
      language === "uk"
        ? `Щотижневий висновок: команда має ${context.teamMetrics.points} очок у вибірці, xGD ${context.teamMetrics.xGD} і defensive stability ${context.teamMetrics.defensiveStability}. Головний управлінський фокус - знизити перехідний ризик без втрати chance creation ${context.tacticalMetrics.chanceCreation}.`
        : `Weekly summary: the team has ${context.teamMetrics.points} points in scope, xGD ${context.teamMetrics.xGD}, and defensive stability ${context.teamMetrics.defensiveStability}. The main management focus is reducing transition risk without losing chance creation at ${context.tacticalMetrics.chanceCreation}.`,
    evaluate:
      language === "uk"
        ? "AI-висновок grounded у наданих demo metrics, якщо він обмежується formIndex, xGD, tactical risk, player impact і fixture profile. Ризик галюцинацій зростає для тверджень про live injuries, офіційну таблицю або реальні трансфери."
        : "The AI output is grounded in supplied demo metrics if it stays within formIndex, xGD, tactical risk, player impact, and fixture profile. Hallucination risk rises for claims about live injuries, official standings, or real transfers."
  };

  return {
    language,
    answer: answerByKind[kind],
    recommendations: [
      {
        title: language === "uk" ? "Стабілізувати rest-defense" : "Stabilize rest defense",
        priority: highRisk ? "high" : "medium",
        rationale:
          language === "uk"
            ? `Transition risk ${Math.round(context.tacticalMetrics.transitionRisk)}/100 підсилює загальний tactical risk.`
            : `Transition risk at ${Math.round(context.tacticalMetrics.transitionRisk)}/100 is lifting the overall tactical risk.`
      },
      {
        title: language === "uk" ? "Підтримати лідерів впливу" : "Support impact leaders",
        priority: "medium",
        rationale:
          language === "uk"
            ? `${context.topPlayers[0]?.name ?? "Top player"} має найвищий impact score і повинен залишатися центром створення моментів.`
            : `${context.topPlayers[0]?.name ?? "Top player"} has the highest impact score and should remain central to chance creation.`
      },
      {
        title: language === "uk" ? "Моніторити away form" : "Monitor away form",
        priority: context.teamMetrics.awayFormIndex < 45 ? "high" : "low",
        rationale:
          language === "uk"
            ? `Away form index зараз ${context.teamMetrics.awayFormIndex}, це важливий ранній індикатор ризику.`
            : `Away form index is ${context.teamMetrics.awayFormIndex}, an important early risk indicator.`
      }
    ],
    trace: {
      selectedMetrics,
      detectedPatterns: [detectedPattern],
      reasoningSummary:
        language === "uk"
          ? "Висновок побудований із агрегованих team/tactical metrics, recent trend summary, player impact і next fixture profile."
          : "The conclusion uses aggregated team/tactical metrics, recent trend summary, player impact, and next fixture profile.",
      confidence: context.sampleSize.matches < 5 ? 0.58 : 0.78,
      riskLevel
    },
    usedMetrics: selectedMetrics,
    dataLineage: context.dataLineage,
    qualityChecks: context.qualityChecks
  };
}

function withWarning(response: AiResponse, warning: string): AiResponse {
  return {
    ...response,
    qualityChecks: {
      ...response.qualityChecks,
      missingDataWarnings: [...response.qualityChecks.missingDataWarnings, warning],
      hallucinationRisk: response.qualityChecks.hallucinationRisk === "high" ? "high" : "medium"
    }
  };
}

function normalizeAiResponse(value: unknown, fallback: AiResponse): AiResponse {
  if (!value || typeof value !== "object") return fallback;
  const candidate = value as Partial<AiResponse>;
  return {
    language: candidate.language === "en" ? "en" : fallback.language,
    answer: typeof candidate.answer === "string" ? candidate.answer : fallback.answer,
    recommendations: Array.isArray(candidate.recommendations) ? candidate.recommendations : fallback.recommendations,
    trace: candidate.trace ?? fallback.trace,
    usedMetrics: Array.isArray(candidate.usedMetrics) ? candidate.usedMetrics : fallback.usedMetrics,
    dataLineage: Array.isArray(candidate.dataLineage) ? candidate.dataLineage : fallback.dataLineage,
    qualityChecks: candidate.qualityChecks ?? fallback.qualityChecks
  };
}
