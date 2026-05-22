"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  BarChart3,
  Bot,
  BrainCircuit,
  CalendarDays,
  Gauge,
  Home,
  Languages,
  LineChart,
  Moon,
  PanelLeftClose,
  PlaySquare,
  ShieldCheck,
  Sun,
  UserRound,
  Workflow
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale } from "@/components/providers";

const nav = [
  { href: "/", key: "overview", icon: Home },
  { href: "/analytics", key: "players", icon: UserRound },
  { href: "/tactics", key: "tactics", icon: Gauge },
  { href: "/ai-analyst", key: "analyst", icon: Bot },
  { href: "/automation", key: "automation", icon: Workflow },
  { href: "/demo", key: "demo", icon: PlaySquare },
  { href: "/quality", key: "quality", icon: ShieldCheck },
  { href: "/case-study", key: "caseStudy", icon: LineChart }
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { locale, setLocale, t } = useLocale();

  return (
    <div className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top_left,rgba(226,27,34,0.16),transparent_34%),linear-gradient(135deg,#061014,#08171d_46%,#04080b)] text-zinc-100 light:bg-[linear-gradient(135deg,#f8fafc,#edf2f4)] light:text-zinc-950">
      <div className="flex min-h-screen">
        <aside className="hidden w-[230px] shrink-0 border-r border-zinc-800/90 bg-black/25 p-3 lg:flex lg:flex-col light:border-zinc-200 light:bg-white/65">
          <BrandMark compact={false} />
          <nav className="mt-6 space-y-2">
            {nav.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex h-12 items-center gap-3 rounded-md px-4 text-sm font-semibold text-zinc-300 transition light:text-zinc-700",
                    active
                      ? "bg-united-red text-white shadow-glow"
                      : "hover:bg-zinc-900/80 hover:text-white light:hover:bg-zinc-100 light:hover:text-zinc-950"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {t[item.key]}
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto space-y-3">
            <div className="panel p-4 text-sm">
              <div className="flex items-center gap-2 text-green-400">
                <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                Синхронізація в нормі
              </div>
              <p className="mt-2 text-zinc-400">2 хв тому</p>
            </div>
            <button className="flex h-12 w-full items-center gap-3 rounded-md border border-zinc-800 px-4 text-sm text-zinc-300 light:border-zinc-200 light:text-zinc-700">
              <PanelLeftClose className="h-5 w-5" />
              {t.collapse}
            </button>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 border-b border-zinc-800/90 bg-[#061014]/90 px-3 py-3 backdrop-blur light:border-zinc-200 light:bg-white/88 md:px-5">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-3 lg:hidden">
                <BrandMark compact />
              </div>
              <div className="hidden min-w-0 flex-1 items-center gap-3 lg:flex">
                <BrandMark compact />
                <span className="truncate text-lg font-semibold">{t.product}</span>
              </div>
              <button className="flex h-10 min-w-[220px] items-center justify-between rounded-md border border-zinc-700 bg-black/20 px-4 text-sm light:border-zinc-200 light:bg-white">
                <span className="truncate">{t.season}</span>
                <CalendarDays className="h-4 w-4 text-zinc-400" />
              </button>
              <StatusPill text={t.synced} />
              <StatusPill text={t.aiReady} />
              <StatusPill text={t.n8nActive} />
              <StatusPill text={t.supabaseOnline} />
              <span className="ml-auto hidden text-right text-xs text-zinc-400 xl:block">{t.lastSync}</span>
              <div className="flex rounded-md border border-zinc-700 p-1 light:border-zinc-200">
                <button
                  aria-label="Light theme"
                  className={cn("rounded px-3 py-2", theme === "light" && "bg-zinc-200 text-zinc-950")}
                  onClick={() => setTheme("light")}
                >
                  <Sun className="h-4 w-4" />
                </button>
                <button
                  aria-label="Dark theme"
                  className={cn("rounded px-3 py-2", theme !== "light" && "bg-zinc-800 text-white")}
                  onClick={() => setTheme("dark")}
                >
                  <Moon className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center rounded-md border border-united-red/70 p-1 text-sm font-bold">
                <Languages className="mx-2 h-4 w-4 text-zinc-400" />
                {(["ua", "en"] as const).map((item) => (
                  <button
                    key={item}
                    className={cn(
                      "rounded px-3 py-1.5 uppercase",
                      locale === item ? "bg-united-red text-white" : "text-zinc-400"
                    )}
                    onClick={() => setLocale(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <nav className="mt-3 flex gap-2 overflow-x-auto pb-1 lg:hidden">
              {nav.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex shrink-0 items-center gap-2 rounded-md border px-3 py-2 text-sm",
                      pathname === item.href
                        ? "border-united-red bg-united-red text-white"
                        : "border-zinc-800 bg-black/20 text-zinc-300 light:border-zinc-200 light:bg-white light:text-zinc-700"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {t[item.key]}
                  </Link>
                );
              })}
            </nav>
          </header>
          <div className="mx-auto w-full max-w-[1880px] p-3 md:p-5">{children}</div>
        </main>
      </div>
    </div>
  );
}

function BrandMark({ compact }: { compact: boolean }) {
  return (
    <div className={cn("flex items-center gap-3", compact ? "shrink-0" : "px-1")}>
      <div className="grid h-11 w-11 place-items-center rounded-md bg-gradient-to-br from-united-red to-red-900 shadow-glow">
        <BarChart3 className="h-6 w-6 text-white" />
      </div>
      {!compact && <BrainCircuit className="h-5 w-5 text-united-red" />}
    </div>
  );
}

function StatusPill({ text }: { text: string }) {
  return (
    <div className="hidden h-10 items-center gap-2 rounded-md border border-zinc-800 bg-black/20 px-3 text-xs text-zinc-300 light:border-zinc-200 light:bg-white light:text-zinc-700 sm:flex">
      <span className="h-2 w-2 rounded-full bg-green-500" />
      {text}
    </div>
  );
}
