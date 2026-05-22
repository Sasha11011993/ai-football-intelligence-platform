import { ArrowRight, CheckCircle2, Clock3, FileText, Play, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export function Panel({
  children,
  className,
  accent
}: {
  children: React.ReactNode;
  className?: string;
  accent?: boolean;
}) {
  return <section className={cn("panel min-w-0 p-4", accent && "accent-panel", className)}>{children}</section>;
}

export function SectionTitle({
  title,
  action
}: {
  title: string;
  action?: string;
}) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="text-base font-semibold text-zinc-100 light:text-zinc-950">{title}</h2>
      {action && (
        <span className="flex items-center gap-2 text-xs font-semibold text-united-red">
          {action}
          <ArrowRight className="h-4 w-4" />
        </span>
      )}
    </div>
  );
}

export function KpiCard({
  label,
  value,
  delta,
  tone = "green",
  accent
}: {
  label: string;
  value: string;
  delta: string;
  tone?: "green" | "gold" | "red";
  accent?: boolean;
}) {
  const toneClass = {
    green: "text-green-400",
    gold: "text-united-gold",
    red: "text-united-red"
  }[tone];

  return (
    <Panel accent={accent} className="min-h-[138px]">
      <p className="text-center text-sm text-zinc-300 light:text-zinc-600">{label}</p>
      <div className="mt-3 text-center text-4xl font-bold">{value}</div>
      <p className={cn("mt-3 text-center text-sm", toneClass)}>{delta}</p>
      <div className="mt-4 flex items-end justify-center gap-1">
        {[18, 24, 15, 31, 22, 26, 17, 34, 23, 20].map((height, index) => (
          <span
            key={index}
            className={cn("w-6 rounded-full", tone === "gold" ? "bg-united-gold" : "bg-united-red")}
            style={{ height }}
          />
        ))}
      </div>
    </Panel>
  );
}

export function StatusBadge({ children, tone }: { children: React.ReactNode; tone: "green" | "blue" | "gold" | "red" }) {
  const styles = {
    green: "border-green-500/40 bg-green-500/10 text-green-400",
    blue: "border-blue-500/40 bg-blue-500/10 text-blue-400",
    gold: "border-yellow-500/40 bg-yellow-500/10 text-yellow-400",
    red: "border-red-500/40 bg-red-500/10 text-red-400"
  };
  return <span className={cn("rounded-md border px-3 py-1 text-xs font-bold uppercase", styles[tone])}>{children}</span>;
}

export function AutomationCard({ title, status, meta }: { title: string; status: string; meta: string }) {
  const tone = status === "готово" ? "green" : status === "заплановано" ? "blue" : status === "виконано" ? "green" : "gold";
  return (
    <div className="rounded-md border border-zinc-800 bg-black/20 p-4 light:border-zinc-200 light:bg-zinc-50">
      <div className="flex items-start justify-between gap-3">
        <FileText className="h-6 w-6 text-zinc-200 light:text-zinc-700" />
        <StatusBadge tone={tone}>{status}</StatusBadge>
      </div>
      <h3 className="mt-4 font-semibold">{title}</h3>
      <p className="mt-2 text-xs text-zinc-400 light:text-zinc-500">{meta}</p>
      <div className="mt-4 flex items-center gap-2">
        <CheckCircle2 className="h-5 w-5 rounded-full bg-green-500/20 p-0.5 text-green-400" />
        <ArrowRight className="h-4 w-4 text-zinc-500" />
        {tone === "gold" ? <Clock3 className="h-5 w-5 text-united-gold" /> : <Play className="h-5 w-5 text-green-400" />}
      </div>
    </div>
  );
}

export function RiskBadge({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-md border border-united-red/60 bg-united-red/10 px-3 py-2 text-sm">
      <ShieldAlert className="h-5 w-5 text-united-red" />
      <span>{label}</span>
    </div>
  );
}
