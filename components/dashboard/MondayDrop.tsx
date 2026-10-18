"use client";

import { useState } from "react";
import Link from "next/link";
import { useDashboard } from "@/components/DashboardProvider";
import { CalendarDays, Check, Loader2, Pencil, Sparkles } from "lucide-react";

type S = "pending" | "building" | "done";

export function MondayDrop() {
  const { agent, weekly } = useDashboard();
  const [states, setStates] = useState<Record<string, S>>({});
  const set = (id: string, s: S) => setStates((p) => ({ ...p, [id]: s }));

  async function approve(id: string) {
    set(id, "building");
    await new Promise((r) => setTimeout(r, 1300)); // Phase 2: trigger real build + schedule
    set(id, "done");
  }

  const building = Object.values(states).filter((s) => s === "building").length;

  if (weekly.length === 0) return null;

  return (
    <section className="card overflow-hidden p-0">
      <div className="flex items-center justify-between gap-3 border-b border-ink/5 bg-gradient-to-r from-brand/10 to-transparent px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand text-white shadow-glow">
            <CalendarDays size={20} />
          </span>
          <div>
            <h2 className="font-extrabold text-ink">This week&apos;s scripts are ready</h2>
            <p className="text-sm text-ink/55">
              {weekly.length} drafts on {agent.niche.toLowerCase()} + your Calgary market. Approve and we build +
              schedule them — no work on your end.
            </p>
          </div>
        </div>
        <span className="chip hidden bg-brand/10 text-brand sm:inline-flex">
          <Sparkles size={13} /> Monday drop
        </span>
      </div>

      <div className="grid gap-px bg-ink/5 sm:grid-cols-3">
        {weekly.map((s) => {
          const st = states[s.id] ?? "pending";
          return (
            <div key={s.id} className="flex flex-col bg-white p-5">
              <span className="chip w-fit bg-ink/[0.04] text-ink/55 ring-1 ring-ink/10">{s.tag}</span>
              <h3 className="mt-3 font-bold leading-snug text-ink">{s.title}</h3>
              <p className="mt-2 flex-1 text-sm text-ink/55">“{s.hook}”</p>
              {st === "done" ? (
                <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2.5 text-sm font-semibold text-emerald-700">
                  <Check size={16} /> Building + scheduling
                </div>
              ) : (
                <div className="mt-4 flex gap-2">
                  <button onClick={() => approve(s.id)} disabled={st === "building"} className="btn-primary flex-1 !py-2.5 text-sm">
                    {st === "building" ? <><Loader2 className="animate-spin" size={15} /> Building…</> : <><Check size={15} /> Approve</>}
                  </button>
                  <Link href="/dashboard/create" className="btn-ghost !px-3 !py-2.5" aria-label="Edit script">
                    <Pencil size={15} />
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {building > 0 && (
        <div className="border-t border-ink/5 px-6 py-3 text-xs font-medium text-ink/50">
          Building {building} video{building > 1 ? "s" : ""}… they&apos;ll land in your Library, ready to post.
        </div>
      )}
    </section>
  );
}
