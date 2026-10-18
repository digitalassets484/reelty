"use client";

import { useDashboard } from "@/components/DashboardProvider";
import { Zap } from "lucide-react";

export function Topbar({ title, subtitle }: { title: string; subtitle?: string }) {
  const { agent } = useDashboard();
  const left = agent.creditsTotal - agent.creditsUsed;
  return (
    <header className="flex flex-col gap-4 border-b border-ink/5 bg-white px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-xl font-extrabold tracking-tight text-ink">{title}</h1>
        {subtitle && <p className="mt-0.5 text-sm text-ink/50">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <div className="chip bg-brand/10 text-brand">
          <Zap size={14} /> {left} / {agent.creditsTotal} credits
        </div>
        <div className="flex items-center gap-2 rounded-full bg-ink/[0.03] py-1 pl-1 pr-3 ring-1 ring-ink/10">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-brand text-sm font-bold text-white">
            {agent.brand.logoLabel}
          </span>
          <div className="text-left">
            <div className="text-xs font-semibold leading-tight text-ink">{agent.name}</div>
            <div className="text-[11px] leading-tight text-ink/45">{agent.plan} plan</div>
          </div>
        </div>
      </div>
    </header>
  );
}
