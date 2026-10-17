"use client";

import { useState } from "react";
import { Topbar } from "@/components/dashboard/Topbar";
import { ACCOUNT, SOCIALS, PLANS, platformLabel } from "@/lib/mock-data";
import { CheckCircle2, Plus } from "lucide-react";

export default function SettingsPage() {
  const [approve, setApprove] = useState(ACCOUNT.approveBeforePosting);
  const plan = PLANS.find((p) => p.name === ACCOUNT.plan)!;

  return (
    <>
      <Topbar title="Settings" subtitle="Your brand, avatar, socials and plan." />
      <div className="mx-auto w-full max-w-3xl space-y-6 p-6">
        {/* Brand kit */}
        <section className="card p-7">
          <h2 className="font-bold text-ink">Brand kit</h2>
          <p className="mt-1 text-sm text-ink/55">Used on every video and picture post.</p>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <label className="label">Name</label>
              <input className="input" defaultValue={ACCOUNT.name} />
            </div>
            <div>
              <label className="label">Brokerage</label>
              <input className="input" defaultValue={ACCOUNT.brokerage} />
            </div>
          </div>
          <div className="mt-5 flex items-center gap-6">
            <div>
              <label className="label">Primary</label>
              <div className="flex items-center gap-2">
                <span className="h-9 w-9 rounded-lg ring-1 ring-ink/10" style={{ background: ACCOUNT.brand.primary }} />
                <span className="text-sm text-ink/60">{ACCOUNT.brand.primary}</span>
              </div>
            </div>
            <div>
              <label className="label">Secondary</label>
              <div className="flex items-center gap-2">
                <span className="h-9 w-9 rounded-lg ring-1 ring-ink/10" style={{ background: ACCOUNT.brand.secondary }} />
                <span className="text-sm text-ink/60">{ACCOUNT.brand.secondary}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Digital twin */}
        <section className="card p-7">
          <h2 className="font-bold text-ink">Digital twin</h2>
          <div className="mt-4 flex items-center justify-between rounded-xl bg-ink/[0.03] p-4 ring-1 ring-ink/5">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-emerald-500" size={22} />
              <div>
                <div className="text-sm font-semibold capitalize text-ink">{ACCOUNT.twinStatus}</div>
                <div className="text-xs text-ink/45">Created during setup. Used for all avatar videos.</div>
              </div>
            </div>
            <button className="btn-ghost !py-2 text-sm">Retrain</button>
          </div>
        </section>

        {/* Socials */}
        <section className="card p-7">
          <h2 className="font-bold text-ink">Connected socials</h2>
          <p className="mt-1 text-sm text-ink/55">Managed in your GHL sub-account. Posts route here automatically.</p>
          <div className="mt-5 space-y-2.5">
            {SOCIALS.map((s) => (
              <div key={s.platform} className="flex items-center justify-between rounded-xl bg-ink/[0.02] p-3 ring-1 ring-ink/5">
                <div>
                  <div className="text-sm font-semibold text-ink">{platformLabel(s.platform)}</div>
                  <div className="text-xs text-ink/45">{s.handle}</div>
                </div>
                {s.connected ? (
                  <span className="chip bg-emerald-100 text-emerald-700">Connected</span>
                ) : (
                  <button className="chip bg-brand/10 text-brand"><Plus size={13} /> Connect</button>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Posting */}
        <section className="card p-7">
          <h2 className="font-bold text-ink">Posting</h2>
          <div className="mt-4 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-ink">Approve before posting</div>
              <div className="text-xs text-ink/45">Recommended for compliance. Review each post before it goes live.</div>
            </div>
            <button
              onClick={() => setApprove(!approve)}
              className={`relative h-7 w-12 rounded-full transition ${approve ? "bg-brand" : "bg-ink/20"}`}
            >
              <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${approve ? "left-6" : "left-1"}`} />
            </button>
          </div>
        </section>

        {/* Plan */}
        <section className="card p-7">
          <h2 className="font-bold text-ink">Plan</h2>
          <div className="mt-4 flex items-center justify-between rounded-xl bg-ink p-5 text-white">
            <div>
              <div className="text-lg font-bold">{plan.name}</div>
              <div className="text-sm text-white/60">${plan.price}/mo · {plan.videos} videos</div>
            </div>
            <button className="btn-primary !py-2.5 text-sm">Upgrade</button>
          </div>
        </section>
      </div>
    </>
  );
}
