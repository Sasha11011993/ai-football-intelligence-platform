"use client";

import {
  AlertCircle,
  Bot,
  CheckCircle2,
  Database,
  FileCode2,
  FileText,
  Gauge,
  GitBranch,
  Globe2,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Workflow,
  Zap,
  type LucideIcon
} from "lucide-react";
import Link from "next/link";
import { useLocale } from "@/components/providers";
import { AutomationCard, Panel, SectionTitle, StatusBadge } from "@/components/ui";
import { automationCards } from "@/lib/mock-data";

const copy = {
  ua: {
    title: "Case Study",
    subtitle: "AI-аналітика, автоматизація та трасування рішень для футбольного клубу",
    context: "Manchester United 2025/26 demo season",
    problem: "Проблема",
    solution: "Рішення",
    architecture: "Архітектура рішення",
    demo: "Демо-сценарій",
    agent: "Потік роботи AI-агента",
    automations: "n8n автоматизації",
    supabase: "Supabase: збереження даних",
    skills: "Навички продемонстровано",
    openDemo: "Відкрити демо",
    openAutomation: "Відкрити центр",
    planned: "Phase 7 planned",
    current: "Phase 6 v1",
    problemItems: [
      "Аналітика матчів, гравців і тактики часто живе в різних таблицях та звітах.",
      "Тренерський штаб потребує швидкого сигналу, коли форма або defensive risk змінюються.",
      "AI-рекомендації мають бути пояснюваними: потрібні метрики, джерела і QA-перевірки.",
      "Автоматичні звіти мають бути готові до Slack, email або n8n, навіть якщо доставка у v1 mock."
    ],
    solutionItems: [
      "Dashboard-first продукт з фільтрами, KPI, графіками та tactical risk matrix.",
      "OpenAI-backed agents повертають структурований JSON: відповідь, рекомендації, trace, lineage і quality checks.",
      "n8n workflows запускають weekly report, matchday prep, anomaly alert і demo orchestrator.",
      "Supabase persistence спроєктовано для Phase 7 без впливу на локальний demo-first v1."
    ],
    architectureNodes: [
      ["Джерела", "Demo data зараз, API/CSV/Web у майбутньому"],
      ["Метрики", "Форма, xG/xGA, PPDA, transition risk"],
      ["AI Agent", "Пояснення, рекомендації, structured output"],
      ["n8n", "Orchestration, report payload, alert payload"],
      ["Звіт", "Markdown export, notification-ready JSON"],
      ["Supabase", "Заплановане збереження real-data у Phase 7"]
    ],
    demoSteps: [
      ["1", "Виявлення проблеми", "Away + transition risk вибірка"],
      ["2", "Аналіз метрик", "formIndex, xGD, stability, tactical risk"],
      ["3", "AI-рекомендація", "grounded висновок і дії"],
      ["4", "Automation result", "n8n-ready report payload"],
      ["5", "Quality summary", "trace, lineage, hallucination risk"]
    ],
    agentSteps: [
      ["Контекст", "Фільтри, fixtures, match scope"],
      ["Метрики", "Curated context замість raw dump"],
      ["Патерни", "Ризик переходів і away form"],
      ["Рішення", "Пріоритети для штабу"],
      ["Trace", "User-safe audit summary"],
      ["QA", "Groundedness і missing data"]
    ],
    supabaseRows: [
      ["matches / player_metrics", "нормалізовані футбольні сутності"],
      ["ingestion_runs", "аудит імпорту і parser snapshots"],
      ["ai_reports / anomaly_alerts", "збережені AI-висновки"],
      ["automation_runs", "історія n8n запусків"],
      ["storage buckets", "raw snapshots, imports, exports"]
    ]
  },
  en: {
    title: "Case Study",
    subtitle: "AI analytics, automation, and decision traceability for a football club",
    context: "Manchester United 2025/26 demo season",
    problem: "Problem",
    solution: "Solution",
    architecture: "Solution Architecture",
    demo: "Demo Scenario",
    agent: "AI Agent Workflow",
    automations: "n8n Automations",
    supabase: "Supabase: Data Persistence",
    skills: "Skills Demonstrated",
    openDemo: "Open demo",
    openAutomation: "Open hub",
    planned: "Phase 7 planned",
    current: "Phase 6 v1",
    problemItems: [
      "Match, player, and tactical analytics often live in separate spreadsheets and reports.",
      "Coaching staff need an early signal when form or defensive risk changes.",
      "AI recommendations must be explainable through metrics, sources, and quality checks.",
      "Automated reports should be ready for Slack, email, or n8n while delivery remains mocked in v1."
    ],
    solutionItems: [
      "A dashboard-first product with filters, KPIs, charts, and a tactical risk matrix.",
      "OpenAI-backed agents return structured JSON: answer, recommendations, trace, lineage, and quality checks.",
      "n8n workflows run weekly reports, matchday prep, anomaly alerts, and demo orchestration.",
      "Supabase persistence is designed for Phase 7 without blocking the local demo-first v1."
    ],
    architectureNodes: [
      ["Sources", "Demo data now, API/CSV/Web later"],
      ["Metrics", "Form, xG/xGA, PPDA, transition risk"],
      ["AI Agent", "Explanation, recommendation, structured output"],
      ["n8n", "Orchestration, report payload, alert payload"],
      ["Report", "Markdown export, notification-ready JSON"],
      ["Supabase", "Planned real-data persistence in Phase 7"]
    ],
    demoSteps: [
      ["1", "Problem detection", "Away + transition risk scope"],
      ["2", "Metrics analysis", "formIndex, xGD, stability, tactical risk"],
      ["3", "AI recommendation", "grounded explanation and actions"],
      ["4", "Automation result", "n8n-ready report payload"],
      ["5", "Quality summary", "trace, lineage, hallucination risk"]
    ],
    agentSteps: [
      ["Context", "Filters, fixtures, match scope"],
      ["Metrics", "Curated context instead of raw dump"],
      ["Patterns", "Transition risk and away form"],
      ["Decision", "Staff priorities"],
      ["Trace", "User-safe audit summary"],
      ["QA", "Groundedness and missing data"]
    ],
    supabaseRows: [
      ["matches / player_metrics", "normalized football entities"],
      ["ingestion_runs", "import audit and parser snapshots"],
      ["ai_reports / anomaly_alerts", "stored AI outputs"],
      ["automation_runs", "n8n run history"],
      ["storage buckets", "raw snapshots, imports, exports"]
    ]
  }
} as const;

const architectureIcons = [FileCode2, Gauge, Bot, GitBranch, FileText, Database] as const;
const agentIcons = [MessageSquare, CheckCircle2, Zap, Sparkles, ShieldCheck, Gauge] as const;

export default function CaseStudyPage() {
  const { locale } = useLocale();
  const text = copy[locale];

  return (
    <div className="space-y-4">
      <Panel accent>
        <div className="grid gap-4 xl:grid-cols-[1fr_260px] xl:items-end">
          <div>
            <h1 className="text-3xl font-bold">{text.title}</h1>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-zinc-400 light:text-zinc-600">{text.subtitle}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <StatusBadge tone="red">{text.context}</StatusBadge>
              <StatusBadge tone="blue">{text.current}</StatusBadge>
              <StatusBadge tone="gold">{text.planned}</StatusBadge>
            </div>
          </div>
          <Link className="flex h-11 items-center justify-center rounded-md bg-united-red px-4 text-sm font-bold text-white shadow-glow" href="/demo">
            {text.openDemo}
          </Link>
        </div>
      </Panel>

      <div className="grid gap-4 xl:grid-cols-[0.8fr_0.8fr_1.4fr]">
        <CaseList title={text.problem} icon={AlertCircle} tone="red" items={text.problemItems} />
        <CaseList title={text.solution} icon={CheckCircle2} tone="green" items={text.solutionItems} />
        <Panel>
          <SectionTitle title={text.architecture} />
          <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-6">
            {text.architectureNodes.map(([title, body], index) => {
              const Icon = architectureIcons[index];
              return <FlowNode key={title} icon={Icon} title={title} body={body} />;
            })}
          </div>
        </Panel>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <Panel>
          <SectionTitle title={text.demo} action={text.openDemo} />
          <div className="grid gap-3 md:grid-cols-5">
            {text.demoSteps.map(([step, title, body]) => (
              <div key={step} className="rounded-md border border-zinc-800 p-4 light:border-zinc-200">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-united-red font-bold text-white">{step}</div>
                <h3 className="mt-4 text-sm font-bold">{title}</h3>
                <p className="mt-2 text-xs leading-5 text-zinc-400 light:text-zinc-500">{body}</p>
                <div className="mt-4"><StatusBadge tone="green">ready</StatusBadge></div>
              </div>
            ))}
          </div>
        </Panel>
        <Panel>
          <SectionTitle title={text.agent} />
          <div className="grid gap-3 md:grid-cols-6">
            {text.agentSteps.map(([title, body], index) => {
              const Icon = agentIcons[index];
              return <FlowNode key={title} icon={Icon} title={title} body={body} compact />;
            })}
          </div>
        </Panel>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_0.85fr_1fr]">
        <Panel>
          <SectionTitle title={text.automations} action={text.openAutomation} />
          <div className="grid gap-3 sm:grid-cols-2">
            {automationCards.map(([title, status, meta]) => (
              <AutomationCard key={title} title={title} status={status} meta={meta} />
            ))}
          </div>
        </Panel>
        <Panel>
          <SectionTitle title={text.supabase} />
          <p className="mb-4 text-sm leading-6 text-zinc-400 light:text-zinc-600">
            {locale === "ua"
              ? "У Phase 6 дані працюють локально. Supabase схема вже спроєктована як наступний шар для реальних імпортів, звітів і журналів автоматизації."
              : "Phase 6 runs on local demo data. The Supabase schema is designed as the next layer for real imports, reports, and automation logs."}
          </p>
          <div className="space-y-2">
            {text.supabaseRows.map(([name, body]) => (
              <div key={name} className="rounded-md border border-zinc-800 p-3 light:border-zinc-200">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold">{name}</span>
                  <StatusBadge tone="blue">{text.planned}</StatusBadge>
                </div>
                <p className="mt-2 text-sm text-zinc-400 light:text-zinc-600">{body}</p>
              </div>
            ))}
          </div>
        </Panel>
        <Panel>
          <SectionTitle title={text.skills} />
          <div className="grid gap-3 sm:grid-cols-2">
            {([
              [Bot, "AI agents"],
              [MessageSquare, "Prompt design"],
              [Gauge, "Football analytics"],
              [Database, "Data modeling"],
              [Globe2, "Supabase planning"],
              [Workflow, "n8n orchestration"],
              [Zap, "Anomaly detection"],
              [ShieldCheck, "QA checks"],
              [FileText, "Report export"]
            ] as [LucideIcon, string][]).map(([Icon, label]) => (
              <div key={label} className="flex items-center gap-3 rounded-md border border-zinc-800 p-3 light:border-zinc-200">
                <Icon className="h-5 w-5 text-zinc-200 light:text-zinc-700" />
                <span className="text-sm font-semibold">{label}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function FlowNode({ icon: Icon, title, body, compact }: { icon: LucideIcon; title: string; body: string; compact?: boolean }) {
  return (
    <div className="min-h-[132px] rounded-md border border-zinc-800 bg-black/20 p-3 text-center light:border-zinc-200 light:bg-zinc-50">
      <Icon className="mx-auto h-6 w-6 text-united-red" />
      <h3 className="mt-3 text-sm font-bold">{title}</h3>
      <p className={compact ? "mt-2 text-xs leading-5 text-zinc-400 light:text-zinc-500" : "mt-2 text-xs leading-5 text-zinc-400 light:text-zinc-500"}>{body}</p>
    </div>
  );
}

function CaseList({
  title,
  icon: Icon,
  tone,
  items
}: {
  title: string;
  icon: LucideIcon;
  tone: "red" | "green";
  items: readonly string[];
}) {
  return (
    <Panel>
      <SectionTitle title={title} />
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item} className="flex items-start gap-3 border-b border-zinc-900 pb-3 text-sm last:border-0 light:border-zinc-100">
            <Icon className={tone === "red" ? "mt-0.5 h-5 w-5 shrink-0 text-united-red" : "mt-0.5 h-5 w-5 shrink-0 text-green-400"} />
            <span className="text-zinc-300 light:text-zinc-700">{item}</span>
          </div>
        ))}
      </div>
    </Panel>
  );
}
