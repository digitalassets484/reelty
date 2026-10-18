"use client";

import { useState } from "react";
import { Topbar } from "@/components/dashboard/Topbar";
import { useDashboard } from "@/components/DashboardProvider";
import { platformLabel, type ContentItem } from "@/lib/mock-data";
import { Video, ImageIcon, CheckCircle2, CalendarClock, X } from "lucide-react";

const statusStyles: Record<string, string> = {
  draft: "bg-ink/10 text-ink/60",
  rendering: "bg-amber-100 text-amber-700",
  ready: "bg-brand/10 text-brand",
  scheduled: "bg-indigo-100 text-indigo-700",
  posted: "bg-emerald-100 text-emerald-700",
};

const FILTERS = ["all", "video", "picture"] as const;

export default function LibraryPage() {
  const { content } = useDashboard();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");
  const [active, setActive] = useState<ContentItem | null>(null);

  const items = content.filter((i) => filter === "all" || i.kind === filter);

  return (
    <>
      <Topbar title="Library" subtitle="Every piece of content you've made. Approve, schedule, or edit." />
      <div className="p-6">
        <div className="mb-5 flex gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`chip capitalize ${filter === f ? "bg-ink text-white" : "bg-white text-ink/60 ring-1 ring-ink/10"}`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => setActive(item)}
              className="card group overflow-hidden p-0 text-left transition hover:shadow-glow"
            >
              <div className={`relative flex aspect-video items-center justify-center bg-gradient-to-br ${item.thumb} text-white`}>
                {item.kind === "video" ? <Video size={28} /> : <ImageIcon size={28} />}
                <span className={`chip absolute right-3 top-3 ${statusStyles[item.status]}`}>{item.status}</span>
              </div>
              <div className="p-4">
                <div className="truncate text-sm font-semibold text-ink">{item.title}</div>
                <div className="mt-1 text-xs text-ink/45">
                  {item.typeLabel} · {item.platforms.map(platformLabel).join(", ")}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {active && <DetailDrawer item={active} onClose={() => setActive(null)} />}
    </>
  );
}

function DetailDrawer({ item, onClose }: { item: ContentItem; onClose: () => void }) {
  const [scheduled, setScheduled] = useState(item.status === "scheduled" || item.status === "posted");
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-ink/40" onClick={onClose}>
      <div className="h-full w-full max-w-md overflow-y-auto bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <span className={`chip ${statusStyles[scheduled ? "scheduled" : item.status]}`}>
            {scheduled ? "scheduled" : item.status}
          </span>
          <button onClick={onClose} className="rounded-lg p-1.5 text-ink/40 hover:bg-ink/5 hover:text-ink">
            <X size={20} />
          </button>
        </div>

        <div className={`mt-4 flex aspect-video items-center justify-center rounded-2xl bg-gradient-to-br ${item.thumb} text-white`}>
          {item.kind === "video" ? <Video size={32} /> : <ImageIcon size={32} />}
        </div>

        <h2 className="mt-5 text-lg font-bold text-ink">{item.title}</h2>
        <div className="mt-1 text-sm text-ink/45">{item.typeLabel}</div>

        <div className="mt-5">
          <div className="label">Caption</div>
          <p className="rounded-xl bg-ink/[0.03] p-4 text-sm text-ink/70 ring-1 ring-ink/5">{item.caption}</p>
        </div>

        <div className="mt-4">
          <div className="label">Platforms</div>
          <div className="flex flex-wrap gap-2">
            {item.platforms.map((p) => (
              <span key={p} className="chip bg-ink/[0.04] text-ink/60 ring-1 ring-ink/10">{platformLabel(p)}</span>
            ))}
          </div>
        </div>

        {scheduled ? (
          <div className="mt-6 flex items-center gap-2 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700">
            <CheckCircle2 size={18} /> Queued in your GHL planner — pending your approval.
          </div>
        ) : (
          <button onClick={() => setScheduled(true)} className="btn-primary mt-6 w-full">
            <CalendarClock size={18} /> Approve & schedule
          </button>
        )}
      </div>
    </div>
  );
}
