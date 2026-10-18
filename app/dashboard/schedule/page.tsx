"use client";

import { Topbar } from "@/components/dashboard/Topbar";
import { useDashboard } from "@/components/DashboardProvider";
import { platformLabel } from "@/lib/mock-data";
import { ShieldCheck, Video, ImageIcon } from "lucide-react";

export default function SchedulePage() {
  const { content } = useDashboard();
  const queued = content
    .filter((i) => i.scheduledFor)
    .sort((a, b) => new Date(a.scheduledFor!).getTime() - new Date(b.scheduledFor!).getTime());

  return (
    <>
      <Topbar title="Schedule" subtitle="What's going out, and when. Nothing posts without your OK." />
      <div className="mx-auto w-full max-w-3xl p-6">
        <div className="mb-6 flex items-start gap-3 rounded-2xl bg-brand/5 p-4 text-sm text-ink/70 ring-1 ring-brand/15">
          <ShieldCheck className="mt-0.5 shrink-0 text-brand" size={18} />
          <span>
            <span className="font-semibold text-ink">Approve before posting is on.</span> Each post waits
            for your tap before your GHL planner sends it live.
          </span>
        </div>

        {queued.length === 0 && (
          <p className="text-sm text-ink/45">Nothing scheduled yet. Approve content in your Library to queue it here.</p>
        )}

        <div className="space-y-3">
          {queued.map((item) => {
            const d = new Date(item.scheduledFor!);
            return (
              <div key={item.id} className="card flex items-center gap-4 p-4">
                <div className="flex w-16 shrink-0 flex-col items-center rounded-xl bg-ink/[0.03] py-2 ring-1 ring-ink/5">
                  <span className="text-xs font-semibold uppercase text-brand">
                    {d.toLocaleString("en-US", { month: "short" })}
                  </span>
                  <span className="text-xl font-extrabold text-ink">{d.getDate()}</span>
                </div>
                <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-gradient-to-br ${item.thumb} text-white`}>
                  {item.kind === "video" ? <Video size={18} /> : <ImageIcon size={18} />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-ink">{item.title}</div>
                  <div className="text-xs text-ink/45">
                    {d.toLocaleString("en-US", { hour: "numeric", minute: "2-digit" })} ·{" "}
                    {item.platforms.map(platformLabel).join(", ")}
                  </div>
                </div>
                <span
                  className={`chip ${
                    item.status === "posted" ? "bg-emerald-100 text-emerald-700" : "bg-indigo-100 text-indigo-700"
                  }`}
                >
                  {item.status}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
