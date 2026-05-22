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
import { AutomationCard, Panel, SectionTitle, StatusBadge } from "@/components/ui";
import { automationCards } from "@/lib/mock-data";

export default function CaseStudyPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold">Case Study</h1>
        <p className="mt-2 max-w-4xl text-zinc-400 light:text-zinc-600">
          AI-аналітика, автоматизація та трасування рішень для футбольного клубу
          <span className="ml-3 rounded-md border border-united-red/50 px-2 py-1 text-xs text-united-red">Manchester United 2025/26</span>
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.75fr_0.75fr_1.5fr]">
        <CaseList
          title="Проблема"
          icon={AlertCircle}
          tone="red"
          items={[
            "Дані з різних джерел оновлюються нерівномірно",
            "Аналітики витрачають час на ручну підготовку звітів",
            "Ризики форми та тактики виявляються запізно",
            "Потрібна прозорість AI-рекомендацій"
          ]}
        />
        <CaseList
          title="Рішення"
          icon={CheckCircle2}
          tone="green"
          items={[
            "Єдина панель футбольної аналітики",
            "AI-агент для рекомендацій перед матчем",
            "n8n автоматизує звіти та сповіщення",
            "Supabase зберігає метрики, сценарії та результати"
          ]}
        />
        <Panel>
          <SectionTitle title="Архітектура рішення" />
          <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-6">
            {([
              [FileCode2, "Парсинг джерел", "API, CSV, Web"],
              [Database, "Supabase", "Дані і метрики"],
              [Gauge, "Обчислення метрик", "xG, форма, пресинг"],
              [Bot, "OpenAI Agent", "Пояснення і рекомендації"],
              [GitBranch, "n8n workflows", "Автоматизація процесів"],
              [FileText, "Звіт", "PDF, Email, Slack"]
            ] as [LucideIcon, string, string][]).map(([Icon, title, text]) => (
              <div key={title} className="min-h-[150px] rounded-md border border-zinc-800 bg-black/20 p-4 text-center light:border-zinc-200 light:bg-zinc-50">
                <Icon className="mx-auto h-8 w-8 text-united-red" />
                <h3 className="mt-4 text-sm font-bold">{title}</h3>
                <p className="mt-2 text-xs text-zinc-400 light:text-zinc-500">{text}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <Panel>
          <SectionTitle title="Демо-сценарій" />
          <div className="grid gap-3 md:grid-cols-5">
            {[
              ["1", "Дані матчів", "Збір і синхронізація"],
              ["2", "Виявлення аномалії", "AI виділяє відхилення"],
              ["3", "AI-рекомендація", "Пояснення і ризики"],
              ["4", "Автоматичний звіт", "PDF і сповіщення"],
              ["5", "Перевірка якості", "Метрики якості"]
            ].map(([step, title, text]) => (
              <div key={step} className="relative rounded-md border border-zinc-800 p-4 light:border-zinc-200">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-united-red font-bold text-white">{step}</div>
                <h3 className="mt-4 text-sm font-bold">{title}</h3>
                <p className="mt-2 text-xs text-zinc-400 light:text-zinc-500">{text}</p>
                <div className="mt-4"><StatusBadge tone={step === "5" ? "gold" : "green"}>{step === "5" ? "очікує перевірки" : "виконано"}</StatusBadge></div>
              </div>
            ))}
          </div>
        </Panel>
        <Panel>
          <SectionTitle title="Потік роботи AI-агента" />
          <div className="grid gap-3 md:grid-cols-6">
            {([
              [MessageSquare, "Контекст матчу", "Суперник, турнір, місце"],
              [CheckCircle2, "Обрані метрики", "xG, xGA, PPDA"],
              [Zap, "Виявлений патерн", "Падіння пресингу"],
              [Sparkles, "Рекомендація", "Посилити центр"],
              [ShieldCheck, "Впевненість", "87%"],
              [Gauge, "Ризик", "Середній"]
            ] as [LucideIcon, string, string][]).map(([Icon, title, text]) => (
              <div key={title} className="min-h-[130px] rounded-md border border-zinc-800 bg-black/20 p-3 text-center light:border-zinc-200 light:bg-zinc-50">
                <Icon className="mx-auto h-6 w-6 text-zinc-200 light:text-zinc-700" />
                <h3 className="mt-3 text-sm font-bold">{title}</h3>
                <p className="mt-2 text-xs text-zinc-400 light:text-zinc-500">{text}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-zinc-400 light:text-zinc-600">
            Джерела даних: match_events · player_minutes · tactical_data · xg_model · scouting_reports
          </p>
        </Panel>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_0.8fr_1fr]">
        <Panel>
          <SectionTitle title="n8n автоматизації" action="Відкрити центр автоматизації" />
          <div className="grid gap-3 sm:grid-cols-2">
            {automationCards.map(([title, status, meta]) => (
              <AutomationCard key={title} title={title} status={status} meta={meta} />
            ))}
          </div>
        </Panel>
        <Panel>
          <SectionTitle title="Supabase: збереження даних" action="Відкрити в Supabase" />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[420px] text-sm">
              <thead className="text-left text-zinc-400">
                <tr>{["Таблиця", "Рядків", "RLS", "API"].map((h) => <th key={h} className="border-b border-zinc-800 pb-2 font-medium light:border-zinc-200">{h}</th>)}</tr>
              </thead>
              <tbody>
                {["match_events", "player_metrics", "ai_recommendations", "automation_runs", "quality_checks"].map((row, index) => (
                  <tr key={row} className="border-b border-zinc-900 light:border-zinc-100">
                    <td className="py-2.5">{row}</td>
                    <td className="py-2.5 text-zinc-400">{["1.24M", "412K", "18.7K", "9.6K", "6.2K"][index]}</td>
                    <td className="py-2.5 text-green-400">✓</td>
                    <td className="py-2.5 text-green-400">●</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
        <Panel>
          <SectionTitle title="Навички продемонстровано" action="Детальніше про кейс" />
          <div className="grid gap-3 sm:grid-cols-2">
            {([
              [Bot, "AI agents"],
              [MessageSquare, "Prompt design"],
              [Gauge, "Football analytics"],
              [Database, "Data modeling"],
              [Globe2, "Supabase"],
              [Workflow, "n8n"],
              [Zap, "Anomaly detection"],
              [ShieldCheck, "QA checks"],
              [FileText, "Reporting automation"]
            ] as [LucideIcon, string][]).map(([Icon, label]) => (
              <div key={label} className="flex items-center gap-3 rounded-md border border-zinc-800 p-3 light:border-zinc-200">
                <Icon className="h-5 w-5 text-zinc-200 light:text-zinc-700" />
                <span className="text-sm font-semibold">{label}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 rounded-md border border-zinc-800 p-3 text-sm light:border-zinc-200">UA-first українська локалізація</div>
        </Panel>
      </div>
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
  items: string[];
}) {
  return (
    <Panel>
      <SectionTitle title={title} />
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item} className="flex items-start gap-3 border-b border-zinc-900 pb-3 text-sm last:border-0 light:border-zinc-100">
            <Icon className={tone === "red" ? "mt-0.5 h-5 w-5 text-united-red" : "mt-0.5 h-5 w-5 text-green-400"} />
            <span className="text-zinc-300 light:text-zinc-700">{item}</span>
          </div>
        ))}
      </div>
    </Panel>
  );
}
