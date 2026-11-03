import Link from "next/link";
import { getAllClients } from "@/lib/admin";
import { ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ClientsPage() {
  const clients = await getAllClients();

  return (
    <>
      <header className="border-b border-ink/5 bg-white px-6 py-5">
        <h1 className="text-xl font-extrabold tracking-tight text-ink">Clients</h1>
        <p className="mt-0.5 text-sm text-ink/50">{clients.length} agent{clients.length === 1 ? "" : "s"} on Reelty.</p>
      </header>

      <div className="p-6">
        <div className="card overflow-hidden p-0">
          <div className="hidden grid-cols-12 gap-4 border-b border-ink/5 bg-ink/[0.02] px-5 py-3 text-xs font-semibold uppercase tracking-wide text-ink/45 sm:grid">
            <div className="col-span-4">Agent</div>
            <div className="col-span-2">Plan</div>
            <div className="col-span-2">Credits</div>
            <div className="col-span-2">Content</div>
            <div className="col-span-2">Joined</div>
          </div>
          {clients.length === 0 && <div className="px-5 py-8 text-sm text-ink/45">No clients yet.</div>}
          {clients.map((c) => (
            <Link
              key={c.id}
              href={`/admin/clients/${c.id}`}
              className="grid grid-cols-1 items-center gap-2 border-b border-ink/5 px-5 py-4 transition last:border-0 hover:bg-ink/[0.02] sm:grid-cols-12 sm:gap-4"
            >
              <div className="col-span-4 flex items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink text-sm font-bold text-white">
                  {c.name.slice(0, 2).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-ink">{c.name}</div>
                  <div className="truncate text-xs text-ink/45">{c.email}</div>
                </div>
              </div>
              <div className="col-span-2 text-sm text-ink/70">{c.plan} · ${c.price}</div>
              <div className="col-span-2 text-sm text-ink/70">{c.creditsUsed}/{c.creditsTotal}</div>
              <div className="col-span-2 text-sm text-ink/70">{c.contentCount}</div>
              <div className="col-span-2 flex items-center justify-between text-sm text-ink/50">
                {new Date(c.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                <ArrowRight size={16} className="text-ink/30" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
