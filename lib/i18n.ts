export type Locale = "ua" | "en";

export const labels = {
  ua: {
    product: "AI Football Intelligence & Automation Platform",
    season: "Manchester United 2025/26",
    synced: "Дані синхронізовано",
    aiReady: "AI готовий",
    n8nActive: "n8n активний",
    supabaseOnline: "Supabase online",
    lastSync: "Остання синхронізація: 2 хв тому",
    collapse: "Згорнути меню",
    overview: "Огляд",
    players: "Аналітика гравців",
    tactics: "Тактичний аналіз",
    analyst: "AI-аналітик",
    automation: "Автоматизація",
    demo: "Демо-сценарій",
    quality: "Якість AI",
    caseStudy: "Case Study",
    flow: "Джерела -> Supabase -> Метрики -> AI Agent -> n8n -> Звіт"
  },
  en: {
    product: "AI Football Intelligence & Automation Platform",
    season: "Manchester United 2025/26",
    synced: "Data synced",
    aiReady: "AI ready",
    n8nActive: "n8n active",
    supabaseOnline: "Supabase online",
    lastSync: "Last sync: 2 min ago",
    collapse: "Collapse menu",
    overview: "Overview",
    players: "Player Analytics",
    tactics: "Tactical Analysis",
    analyst: "AI Analyst",
    automation: "Automation",
    demo: "Demo Scenario",
    quality: "AI Quality",
    caseStudy: "Case Study",
    flow: "Sources -> Supabase -> Metrics -> AI Agent -> n8n -> Report"
  }
} as const;
