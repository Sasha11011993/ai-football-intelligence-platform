import type { AnalyticsFilters } from "@/lib/analytics";

export type AiLanguage = "uk" | "en";

export type AiRecommendation = {
  title: string;
  priority: "high" | "medium" | "low";
  rationale: string;
};

export type AiTrace = {
  selectedMetrics: string[];
  detectedPatterns: string[];
  reasoningSummary: string;
  confidence: number;
  riskLevel: "low" | "medium" | "high";
};

export type AiDataLineage = {
  source: string;
  sourceCategory: "match_data" | "derived_metrics" | "player_data" | "fixture_data" | "ai_evaluation";
  filter: string;
  dateRange: string;
  metrics: string[];
  impact: "primary" | "supporting";
};

export type AiQualityChecks = {
  groundedInData: boolean;
  missingDataWarnings: string[];
  hallucinationRisk: "low" | "medium" | "high";
};

export type AiResponse = {
  language: AiLanguage;
  answer: string;
  recommendations: AiRecommendation[];
  trace: AiTrace;
  usedMetrics: string[];
  dataLineage: AiDataLineage[];
  qualityChecks: AiQualityChecks;
};

export type AiAgentKind = "insights" | "chat" | "match-prep" | "report" | "evaluate";

export type AiRequestBody = {
  language?: "ua" | AiLanguage;
  question?: string;
  filters?: Partial<AnalyticsFilters>;
  fixtureId?: string;
  previousResponse?: AiResponse;
};
