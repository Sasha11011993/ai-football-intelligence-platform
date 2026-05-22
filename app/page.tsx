import type { ComponentProps } from "react";
import { Brain, Database, FileText, GitBranch, Network, Zap, type LucideIcon } from "lucide-react";
import { TrendChart } from "@/components/trend-chart";
import { AutomationCard, KpiCard, Panel, RiskBadge, SectionTitle, StatusBadge } from "@/components/ui";
import { automationCards, leaders, matches } from "@/lib/mock-data";

export default function OverviewPage() {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
        <KpiCard accent label="Індекс форми" value="72" delta="↑ 6 за останні 5 матчів" />
        <KpiCard label="xG диференціал" value="+0.38" delta="↑ 0.27 за останні 5 матчів" />
        <KpiCard label="Стабільність захисту" value="68" delta="↑ 5 за останні 5 матчів" tone="gold" />
        <KpiCard label="Вплив гравця" value="8.4" delta="↑ 0.6 за останні 5 матчів" />
        <Panel className="min-h-[138px]">
          <p className="text-center text-sm text-zinc-300 light:text-zinc-600">Наступний матч</p>
          <div className="mt-4 flex items-center justify-center gap-4">
            <div className="rounded-md border border-united-red bg-black/30 px-4 py-2 text-center">
              <p className="text-xs font-bold text-united-red">ТРАВ</p>
              <p className="text-3xl font-bold">11</p>
            </div>
            <div>
              <p className="font-bold">West Ham (В)</p>
              <p className="mt-1 text-xs text-zinc-400">Premier League</p>
              <p className="text-xs text-zinc-400">16:30 BST</p>
            </div>
          </div>
        </Panel>
        <Panel>
          <p className="text-center text-sm text-zinc-300 light:text-zinc-600">Ризик аномалій</p>
          <div className="mt-4 text-center text-4xl font-bold text-united-gold">Середній</div>
          <p className="mt-3 text-center text-sm text-zinc-400">Моніторинг 6 ключових зон</p>
          <div className="mt-4 h-2 rounded-full bg-zinc-800">
            <div className="h-2 w-2/3 rounded-full bg-united-gold" />
          </div>
        </Panel>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr_0.9fr]">
        <Panel>
          <SectionTitle title="Тренд xG та xGA (останні 20 матчів)" />
          <TrendChart />
        </Panel>
        <Panel>
          <SectionTitle title="Останні матчі" action="Переглянути всі матчі" />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead className="text-left text-zinc-400">
                <tr>{["Дата", "Суперник", "Турнір", "Рахунок", "xG", "xGA"].map((h) => <th key={h} className="border-b border-zinc-800 pb-2 font-medium light:border-zinc-200">{h}</th>)}</tr>
              </thead>
              <tbody>
                {matches.map((row) => (
                  <tr key={row.join("-")} className="border-b border-zinc-900/80 light:border-zinc-100">
                    {row.map((cell, index) => (
                      <td key={index} className="py-2.5 text-zinc-300 light:text-zinc-700">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
        <Panel accent>
          <SectionTitle title="AI-аналітик" action="Переглянути повний аналіз" />
          <div className="space-y-3">
            <RiskBadge label="Ризик у виїзних матчах зростає" />
            <RiskBadge label="Інтенсивність пресингу знизилась за останні 3 матчі" />
            <RiskBadge label="Перед наступним матчем варто посилити компактність у центрі поля" />
          </div>
        </Panel>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.95fr_0.95fr_1.1fr]">
        <Panel>
          <SectionTitle title="Лідери впливу" action="Переглянути всіх лідерів" />
          <div className="space-y-2">
            {leaders.map(([name, score, trend], index) => (
              <div key={name} className="grid grid-cols-[32px_1fr_48px_90px] items-center gap-3 rounded-md border border-zinc-800 px-3 py-2 light:border-zinc-200">
                <span className="text-zinc-500">{index + 1}</span>
                <span className="font-medium">{name}</span>
                <span>{score}</span>
                <span className={trend === "down" ? "text-united-red" : "text-green-400"}>{trend === "flat" ? "—" : "● ● ●"}</span>
              </div>
            ))}
          </div>
        </Panel>
        <Panel>
          <SectionTitle title="Матриця ризиків" />
          <div className="grid grid-cols-3 overflow-hidden rounded-md border border-zinc-800 text-center text-sm light:border-zinc-200">
            {["Пропущені передачі", "Переходи в оборону", "Пікове навантаження", "Аеріальні єдиноборства", "Інтенсивність пресингу", "Втома захисників", "Безпека володіння", "Послідовність у розіграші", "Навантаження у подорожах"].map((item, index) => (
              <div key={item} className={["bg-united-gold/80 text-black", "bg-united-red/80 text-white", "bg-green-600/80 text-white"][index % 3] + " min-h-[76px] p-3 text-xs font-semibold"}>
                {item}
              </div>
            ))}
          </div>
        </Panel>
        <Panel accent>
          <SectionTitle title="Трасування AI-агента" action="Переглянути повне трасування" />
          <div className="grid gap-2 text-sm">
            {[
              ["Обрані метрики", "xG, xGA, Удари, Володіння, PPDA"],
              ["Виявлений патерн", "Зростання xGA на виїзді та падіння PPDA"],
              ["Рівень впевненості", "87%"],
              ["Рівень ризику", "Середній"]
            ].map(([label, value]) => (
              <div key={label} className="grid grid-cols-[150px_1fr] gap-3 rounded-md border border-zinc-800 p-3 light:border-zinc-200">
                <span className="text-zinc-400">{label}</span>
                <span>{value}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <Panel accent>
          <SectionTitle title="Центр автоматизації" action="Перейти до автоматизації" />
          <div className="grid gap-3 md:grid-cols-4">
            {automationCards.map(([title, status, meta]) => (
              <AutomationCard key={title} title={title} status={status} meta={meta} />
            ))}
          </div>
        </Panel>
        <Panel accent>
          <SectionTitle title="Потік даних" />
          <div className="grid grid-cols-3 gap-2 md:grid-cols-6">
            {([
              [FileText, "Джерела"],
              [Database, "Supabase"],
              [BarIcon, "Метрики"],
              [Brain, "AI Agent"],
              [GitBranch, "n8n"],
              [Network, "Звіт"]
            ] as [LucideIcon, string][]).map(([Icon, label]) => (
              <div key={String(label)} className="flex min-h-[92px] flex-col items-center justify-center rounded-md border border-zinc-800 bg-black/20 p-3 text-center text-sm light:border-zinc-200 light:bg-zinc-50">
                <Icon className="mb-2 h-7 w-7 text-zinc-200 light:text-zinc-700" />
                {label}
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between rounded-md border border-zinc-800 p-3 text-sm light:border-zinc-200">
            <span className="flex items-center gap-2 text-green-400"><span className="h-2 w-2 rounded-full bg-green-500" /> Усі системи працюють у штатному режимі</span>
            <StatusBadge tone="green">mock</StatusBadge>
          </div>
        </Panel>
      </div>
    </div>
  );
}

function BarIcon(props: ComponentProps<typeof Zap>) {
  return <Zap {...props} />;
}
