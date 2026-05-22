"use client";

import { useSyncExternalStore } from "react";
import { Bar, BarChart, CartesianGrid, Legend, PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { TacticalMetric } from "@/lib/analytics";

type CompetitionPoint = {
  competition: string;
  matches: number;
  points: number;
  xGD: number;
};

export function CompetitionBarChart({ data }: { data: CompetitionPoint[] }) {
  const mounted = useMounted();

  if (!mounted) {
    return <div className="h-[220px] w-full rounded-md bg-zinc-950/30 light:bg-zinc-100" />;
  }

  return (
    <div className="h-[220px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
          <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
          <XAxis dataKey="competition" tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
          <Tooltip contentStyle={{ background: "#071014", border: "1px solid #26343a", borderRadius: 8, color: "#fff" }} />
          <Legend />
          <Bar dataKey="points" name="Очки" radius={[4, 4, 0, 0]} fill="#e21b22" />
          <Bar dataKey="xGD" name="xGD" radius={[4, 4, 0, 0]} fill="#f2b705" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function TacticalRadarChart({ metrics }: { metrics: TacticalMetric }) {
  const mounted = useMounted();
  const data = [
    { metric: "Пресинг", value: metrics.pressingIntensity },
    { metric: "Розіграш", value: metrics.buildUpQuality },
    { metric: "Шанси", value: metrics.chanceCreation },
    { metric: "Контроль", value: metrics.matchControl },
    { metric: "Стандарти", value: metrics.setPieceThreat },
    { metric: "Стабільність", value: 100 - metrics.tacticalRiskScore }
  ];

  if (!mounted) {
    return <div className="h-[260px] w-full rounded-md bg-zinc-950/30 light:bg-zinc-100" />;
  }

  return (
    <div className="h-[260px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="74%">
          <PolarGrid stroke="rgba(148,163,184,0.24)" />
          <PolarAngleAxis dataKey="metric" tick={{ fill: "#94a3b8", fontSize: 12 }} />
          <Radar dataKey="value" stroke="#e21b22" fill="#e21b22" fillOpacity={0.28} />
          <Tooltip contentStyle={{ background: "#071014", border: "1px solid #26343a", borderRadius: 8, color: "#fff" }} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function RiskMatrix({ metrics }: { metrics: TacticalMetric }) {
  const cells = [
    ["Перехідна оборона", metrics.transitionRisk],
    ["Захист штрафного", metrics.defensiveRisk],
    ["Втрата контролю", 100 - metrics.matchControl],
    ["Якість пресингу", 100 - metrics.pressingIntensity],
    ["Повільний розіграш", 100 - metrics.buildUpQuality],
    ["Залежність від стандартів", Math.max(0, metrics.setPieceThreat - metrics.chanceCreation + 55)],
    ["Гостьова компактність", metrics.tacticalRiskScore],
    ["Створення моментів", 100 - metrics.chanceCreation],
    ["Після втрат", metrics.transitionRisk * 0.7 + metrics.defensiveRisk * 0.3]
  ];

  return (
    <div className="grid grid-cols-3 overflow-hidden rounded-md border border-zinc-800 text-center text-sm light:border-zinc-200">
      {cells.map(([label, rawValue]) => {
        const value = Number(rawValue);
        const tone = value > 66 ? "bg-united-red/85 text-white" : value > 48 ? "bg-united-gold/85 text-black" : "bg-green-600/85 text-white";
        return (
          <div key={String(label)} className={`${tone} flex min-h-[82px] flex-col justify-center p-3 text-xs font-semibold`}>
            <span>{label}</span>
            <span className="mt-1 text-lg">{Math.round(value)}</span>
          </div>
        );
      })}
    </div>
  );
}

export function MiniResultBars({ values }: { values: number[] }) {
  return (
    <div className="mt-4 flex h-9 items-end justify-center gap-1">
      {values.map((height, index) => (
        <span key={index} className="w-5 rounded-full bg-united-red" style={{ height: Math.max(8, height) }} />
      ))}
    </div>
  );
}

function useMounted() {
  return useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false
  );
}
