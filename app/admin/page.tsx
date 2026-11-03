import Link from "next/link";
import { getAdminOverview } from "@/lib/admin";
import { Users, DollarSign, Video, Zap, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminOverview() {
  const o = await getAdminOverview();

  const tiles = [
    { label: "Clients", value: o.clientCount, icon: Users },
    { label: "MRR", value: `$${o.mrr.toLocaleString()}`, icon: DollarSign },
    { label: "Videos this month", value: o.videosThisMonth, icon: Video },
    { label: "Credits used", value: o.creditsUsed, icon: Zap },
  ];

  return (
    <>
      <header className="border-b border-ink/5 bg-white px-6 py-5">
        <h1 className="text-xl font-extrabold tracking-tight text-ink">Owner overview</h1>
        <p className="mt-0.5 text-sm text-ink/50">Your whole book of business at a glance.</p>
      </header>

      <div className="space-y-6 p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {tiles.map((t) => (
            <div key={t.label} className="card p-5">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand/10 text-brand">
                <t.icon size={20} />
              </span>
              <div className="mt-4 text-3xl font-extrabold text-ink">{t.value}</div>
              <div className="text-sm text-ink/50">{t.label}</div>
            </div>
          ))}
        </div>

        <div className="card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-ink">Newest clients</h2>
            <Link href="/admin/clients" className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline">
              All clients <ArrowRight size={14} />
            </Link>
          </div>
          {o.recent.length === 0 ? (
            <p className="text-sm text-ink/45">No clients yet.</p>
          ) : (
            <div className="space-y-2">
              {o.recent.map((c) => (
                <Link
                  key={c.id}
                  href={`/admin/clients/${c.id}`}
                  className="flex items-center gap-4 rounded-xl p-2.5 hover:bg-ink/[0.02]"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-ink text-sm font-bold text-white">
                    {c.name.slice(0, 2).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold text-ink">{c.name}</div>
                    <div className="truncate text-xs text-ink/45">{c.email}</div>
                  </div>
                  <span className="chip bg-ink/[0.04] text-ink/60 ring-1 ring-ink/10">{c.plan}</span>
                  <span className="hidden text-xs text-ink/45 sm:block">{c.creditsUsed}/{c.creditsTotal} credits</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
