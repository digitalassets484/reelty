import Link from "next/link";
import { notFound } from "next/navigation";
import { getClientDetail } from "@/lib/admin";
import { PLANS, platformLabel } from "@/lib/mock-data";
import { setClientPlan, resetClientCredits } from "@/app/admin-actions";
import { ArrowLeft, RotateCcw } from "lucide-react";

export const dynamic = "force-dynamic";

const statusStyles: Record<string, string> = {
  draft: "bg-ink/10 text-ink/60",
  rendering: "bg-amber-100 text-amber-700",
  ready: "bg-brand/10 text-brand",
  scheduled: "bg-indigo-100 text-indigo-700",
  posted: "bg-emerald-100 text-emerald-700",
};

export default async function ClientDetail({ params }: { params: { id: string } }) {
  const c = await getClientDetail(params.id);
  if (!c) notFound();

  return (
    <>
      <header className="border-b border-ink/5 bg-white px-6 py-5">
        <Link href="/admin/clients" className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink/55 hover:text-ink">
          <ArrowLeft size={16} /> All clients
        </Link>
        <div className="mt-3 flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-ink text-base font-bold text-white">
            {c.name.slice(0, 2).toUpperCase()}
          </span>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-ink">{c.name}</h1>
            <p className="text-sm text-ink/50">{c.email}{c.brokerage ? ` · ${c.brokerage}` : ""}</p>
          </div>
        </div>
      </header>

      <div className="grid gap-6 p-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Plan & credits */}
          <div className="card p-6">
            <h2 className="font-bold text-ink">Plan &amp; credits</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {PLANS.map((p) => {
                const current = p.name === c.plan;
                return (
                  <div key={p.id} className={`rounded-2xl p-4 ring-1 ${current ? "bg-ink text-white ring-ink" : "bg-ink/[0.02] text-ink ring-ink/10"}`}>
                    <div className="font-bold">{p.name}</div>
                    <div className={`text-sm ${current ? "text-white/60" : "text-ink/50"}`}>${p.price}/mo · {p.videos}</div>
                    {current ? (
                      <div className="mt-3 chip bg-white/15 text-white">Current</div>
                    ) : (
                      <form action={setClientPlan.bind(null, c.id, p.id)} className="mt-3">
                        <button className="btn-dark w-full !py-2 text-xs">Set</button>
                      </form>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="mt-5 flex items-center justify-between rounded-xl bg-ink/[0.03] p-4 ring-1 ring-ink/5">
              <div>
                <div className="text-sm font-semibold text-ink">{c.creditsUsed} / {c.creditsTotal} credits used</div>
                <div className="text-xs text-ink/45">Resets monthly.</div>
              </div>
              <form action={resetClientCredits.bind(null, c.id)}>
                <button className="btn-ghost !py-2 text-sm"><RotateCcw size={15} /> Reset</button>
              </form>
            </div>
          </div>

          {/* Content */}
          <div className="card p-6">
            <h2 className="font-bold text-ink">Content ({c.content.length})</h2>
            <div className="mt-4 space-y-2">
              {c.content.length === 0 && <p className="text-sm text-ink/45">No content yet.</p>}
              {c.content.map((item) => (
                <div key={item.id} className="flex items-center gap-3 rounded-xl p-2.5 hover:bg-ink/[0.02]">
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold text-ink">{item.title}</div>
                    <div className="text-xs text-ink/45">{item.typeLabel} · {item.kind}</div>
                  </div>
                  <span className={`chip ${statusStyles[item.status] ?? "bg-ink/10 text-ink/60"}`}>{item.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Side */}
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="font-bold text-ink">Profile</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <Row label="Niche" value={c.niche} />
              <Row label="Digital twin" value={c.twinStatus} />
              <Row label="Approve before posting" value={c.approveBeforePosting ? "On" : "Off"} />
              <Row label="Joined" value={new Date(c.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })} />
            </dl>
          </div>

          <div className="card p-6">
            <h2 className="font-bold text-ink">Socials</h2>
            <div className="mt-3 space-y-2">
              {c.socials.length === 0 && <p className="text-sm text-ink/45">None connected.</p>}
              {c.socials.map((s) => (
                <div key={s.platform} className="flex items-center justify-between text-sm">
                  <span className="text-ink/70">{platformLabel(s.platform)}</span>
                  <span className={`chip ${s.connected ? "bg-emerald-100 text-emerald-700" : "bg-ink/[0.04] text-ink/45 ring-1 ring-ink/10"}`}>
                    {s.connected ? "Connected" : "—"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-ink/45">{label}</dt>
      <dd className="font-medium capitalize text-ink">{value}</dd>
    </div>
  );
}
