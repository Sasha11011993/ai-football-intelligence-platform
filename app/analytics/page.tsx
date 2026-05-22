"use client";

import { useMemo, useState } from "react";
import { Search, UserRound } from "lucide-react";
import { Panel, SectionTitle, StatusBadge } from "@/components/ui";
import { useLocale } from "@/components/providers";
import { calculatePlayerImpact } from "@/lib/analytics";

const copy = {
  ua: {
    title: "Аналітика гравців",
    subtitle: "Вплив, форма, навантаження та внесок у створення моментів для демо-сезону Manchester United 2025/26.",
    search: "Пошук гравця",
    position: "Позиція",
    all: "Усі",
    leaders: "Рейтинг впливу",
    detail: "Профіль гравця",
    contribution: "Голи + асисти",
    impact: "Індекс впливу",
    minutes: "Хвилини",
    rating: "Рейтинг",
    creative: "Креативність",
    pressing: "Пресинг",
    health: "Статус",
    fit: "готовий",
    monitor: "моніторинг",
    injured: "травма",
    up: "форма зростає",
    flat: "стабільно",
    down: "спад форми"
  },
  en: {
    title: "Player Analytics",
    subtitle: "Impact, form, workload, and chance creation contribution for the Manchester United 2025/26 demo season.",
    search: "Search player",
    position: "Position",
    all: "All",
    leaders: "Impact ranking",
    detail: "Player profile",
    contribution: "Goals + assists",
    impact: "Impact index",
    minutes: "Minutes",
    rating: "Rating",
    creative: "Creativity",
    pressing: "Pressing",
    health: "Status",
    fit: "fit",
    monitor: "monitor",
    injured: "injured",
    up: "form rising",
    flat: "stable",
    down: "form dip"
  }
} as const;

export default function AnalyticsPage() {
  const { locale } = useLocale();
  const text = copy[locale];
  const players = useMemo(() => calculatePlayerImpact(), []);
  const [query, setQuery] = useState("");
  const [position, setPosition] = useState("all");
  const [selectedId, setSelectedId] = useState(players[0]?.id ?? "");

  const filtered = players.filter((player) => {
    const byQuery = player.name.toLowerCase().includes(query.toLowerCase());
    const byPosition = position === "all" || player.position === position;
    return byQuery && byPosition;
  });
  const selected = players.find((player) => player.id === selectedId) ?? filtered[0] ?? players[0];

  return (
    <div className="space-y-4">
      <Panel accent>
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-united-red">
              <UserRound className="h-5 w-5" />
              <span className="text-sm font-bold uppercase">Manchester United 2025/26</span>
            </div>
            <h1 className="mt-2 text-2xl font-bold">{text.title}</h1>
            <p className="mt-1 max-w-3xl text-sm text-zinc-400 light:text-zinc-600">{text.subtitle}</p>
          </div>
          <div className="grid gap-2 md:grid-cols-[240px_140px]">
            <label className="grid gap-1 text-xs text-zinc-400">
              {text.search}
              <span className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                <input className="h-10 w-full rounded-md border border-zinc-800 bg-zinc-950 pl-9 pr-3 text-sm text-zinc-100 light:border-zinc-200 light:bg-white light:text-zinc-950" value={query} onChange={(event) => setQuery(event.target.value)} />
              </span>
            </label>
            <label className="grid gap-1 text-xs text-zinc-400">
              {text.position}
              <select className="h-10 rounded-md border border-zinc-800 bg-zinc-950 px-3 text-sm text-zinc-100 light:border-zinc-200 light:bg-white light:text-zinc-950" value={position} onChange={(event) => setPosition(event.target.value)}>
                <option value="all">{text.all}</option>
                {["GK", "DF", "MF", "FW"].map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </label>
          </div>
        </div>
      </Panel>

      <div className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
        <Panel>
          <SectionTitle title={text.leaders} />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="text-left text-zinc-400">
                <tr>{["#", text.search, text.position, text.impact, text.contribution, "xG", "xA", text.rating, text.health].map((header) => <th key={header} className="border-b border-zinc-800 pb-2 font-medium light:border-zinc-200">{header}</th>)}</tr>
              </thead>
              <tbody>
                {filtered.map((player, index) => (
                  <tr key={player.id} className="cursor-pointer border-b border-zinc-900/80 light:border-zinc-100" onClick={() => setSelectedId(player.id)}>
                    <td className="py-2.5 text-zinc-500">{index + 1}</td>
                    <td className="py-2.5 font-medium">{player.name}</td>
                    <td className="py-2.5 text-zinc-300 light:text-zinc-700">{player.position}</td>
                    <td className="py-2.5 font-bold text-united-gold">{player.impactScore}</td>
                    <td className="py-2.5">{player.goalContribution}</td>
                    <td className="py-2.5">{player.xG}</td>
                    <td className="py-2.5">{player.xA}</td>
                    <td className="py-2.5">{player.rating}</td>
                    <td className="py-2.5"><StatusBadge tone={player.injuryStatus === "fit" ? "green" : player.injuryStatus === "monitor" ? "gold" : "red"}>{text[player.injuryStatus]}</StatusBadge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel accent>
          <SectionTitle title={text.detail} />
          {selected && (
            <div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-bold">{selected.name}</h2>
                  <p className="mt-1 text-sm text-zinc-400">{selected.position} · {text[selected.formTrend]}</p>
                </div>
                <StatusBadge tone={selected.injuryStatus === "fit" ? "green" : selected.injuryStatus === "monitor" ? "gold" : "red"}>{text[selected.injuryStatus]}</StatusBadge>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <Metric label={text.impact} value={selected.impactScore} />
                <Metric label={text.contribution} value={selected.goalContribution} />
                <Metric label={text.minutes} value={selected.minutes} />
                <Metric label={text.rating} value={selected.rating} />
              </div>
              <div className="mt-5 space-y-3">
                <Progress label="xG" value={selected.xG * 7} display={selected.xG} />
                <Progress label="xA" value={selected.xA * 8} display={selected.xA} />
                <Progress label={text.creative} value={selected.keyPasses} display={selected.keyPasses} />
                <Progress label={text.pressing} value={selected.pressingActions / 2.2} display={selected.pressingActions} />
              </div>
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-md border border-zinc-800 bg-black/20 p-3 light:border-zinc-200 light:bg-zinc-50">
      <p className="text-xs text-zinc-400">{label}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}

function Progress({ label, value, display }: { label: string; value: number; display: string | number }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm">
        <span className="text-zinc-400">{label}</span>
        <span>{display}</span>
      </div>
      <div className="h-2 rounded-full bg-zinc-800 light:bg-zinc-200">
        <div className="h-2 rounded-full bg-united-red" style={{ width: `${Math.min(100, value)}%` }} />
      </div>
    </div>
  );
}
