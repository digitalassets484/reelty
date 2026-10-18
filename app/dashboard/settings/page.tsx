"use client";

import { useState } from "react";
import { Topbar } from "@/components/dashboard/Topbar";
import { useDashboard } from "@/components/DashboardProvider";
import { PLANS, platformLabel } from "@/lib/mock-data";
import { startCheckout } from "@/app/billing-actions";
import { updateProfile, toggleSocial, setApprove as persistApprove, createTwin } from "@/app/settings-actions";
import { CheckCircle2, Clock, Plus } from "lucide-react";

export default function SettingsPage() {
  const { agent, socials } = useDashboard();
  const [approve, setApprove] = useState(agent.approveBeforePosting);
  const plan = PLANS.find((p) => p.name === agent.plan) ?? PLANS[1];

  return (
    <>
      <Topbar title="Settings" subtitle="Your brand, avatar, socials and plan." />
      <div className="mx-auto w-full max-w-3xl space-y-6 p-6">
        {/* Brand kit */}
        <form action={updateProfile} className="card p-7">
          <h2 className="font-bold text-ink">Brand kit</h2>
          <p className="mt-1 text-sm text-ink/55">Used on every video and picture post.</p>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <label className="label">Name</label>
              <input name="name" className="input" defaultValue={agent.name} />
            </div>
            <div>
              <label className="label">Brokerage</label>
              <input name="brokerage" className="input" defaultValue={agent.brokerage} placeholder="e.g. lpt realty" />
            </div>
            <div>
              <label className="label">Niche</label>
              <input name="niche" className="input" defaultValue={agent.niche} placeholder="New builds, luxury, resale, investor…" />
            </div>
          </div>
          <div className="mt-5 flex items-center gap-6">
            <div>
              <label className="label">Primary</label>
              <div className="flex items-center gap-2">
                <span className="h-9 w-9 rounded-lg ring-1 ring-ink/10" style={{ background: agent.brand.primary }} />
                <span className="text-sm text-ink/60">{agent.brand.primary}</span>
              </div>
            </div>
            <div>
              <label className="label">Secondary</label>
              <div className="flex items-center gap-2">
                <span className="h-9 w-9 rounded-lg ring-1 ring-ink/10" style={{ background: agent.brand.secondary }} />
                <span className="text-sm text-ink/60">{agent.brand.secondary}</span>
              </div>
            </div>
          </div>
          <p className="mt-4 text-xs text-ink/45">Colors are auto-extracted from your uploaded logo.</p>
          <button type="submit" className="btn-primary mt-5 !py-2.5 text-sm">Save brand kit</button>
        </form>

        {/* Digital twin */}
        <section className="card p-7">
          <h2 className="font-bold text-ink">Digital twin</h2>
          <div className="mt-4 flex items-center justify-between rounded-xl bg-ink/[0.03] p-4 ring-1 ring-ink/5">
            <div className="flex items-center gap-3">
              {agent.twinStatus === "ready" ? (
                <CheckCircle2 className="text-emerald-500" size={22} />
              ) : (
                <Clock className="text-ink/40" size={22} />
              )}
              <div>
                <div className="text-sm font-semibold capitalize text-ink">{agent.twinStatus}</div>
                <div className="text-xs text-ink/45">
                  {agent.twinStatus === "ready" ? "Used for all avatar videos." : "Record a 15-second clip to create it."}
                </div>
              </div>
            </div>
            {agent.twinStatus === "ready" ? (
              <button className="btn-ghost !py-2 text-sm">Retrain</button>
            ) : (
              <form action={createTwin}>
                <button className="btn-primary !py-2 text-sm">Create</button>
              </form>
            )}
          </div>
        </section>

        {/* Socials */}
        <section className="card p-7">
          <h2 className="font-bold text-ink">Connected socials</h2>
          <p className="mt-1 text-sm text-ink/55">Managed in your GHL sub-account. Posts route here automatically.</p>
          <div className="mt-5 space-y-2.5">
            {socials.length === 0 && <p className="text-sm text-ink/45">No socials connected yet.</p>}
            {socials.map((s) => (
              <div key={s.platform} className="flex items-center justify-between rounded-xl bg-ink/[0.02] p-3 ring-1 ring-ink/5">
                <div>
                  <div className="text-sm font-semibold text-ink">{platformLabel(s.platform)}</div>
                  <div className="text-xs text-ink/45">{s.handle}</div>
                </div>
                <form action={toggleSocial.bind(null, s.platform)}>
                  {s.connected ? (
                    <button className="chip bg-emerald-100 text-emerald-700">Connected</button>
                  ) : (
                    <button className="chip bg-brand/10 text-brand"><Plus size={13} /> Connect</button>
                  )}
                </form>
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
              onClick={() => {
                const v = !approve;
                setApprove(v);
                persistApprove(v);
              }}
              className={`relative h-7 w-12 rounded-full transition ${approve ? "bg-brand" : "bg-ink/20"}`}
            >
              <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${approve ? "left-6" : "left-1"}`} />
            </button>
          </div>
        </section>

        {/* Plan & billing */}
        <section className="card p-7">
          <h2 className="font-bold text-ink">Plan &amp; billing</h2>
          <p className="mt-1 text-sm text-ink/55">You&apos;re on the {plan.name} plan.</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {PLANS.map((p) => {
              const current = p.name === agent.plan;
              return (
                <div
                  key={p.id}
                  className={`rounded-2xl p-4 ring-1 ${current ? "bg-ink text-white ring-ink" : "bg-ink/[0.02] text-ink ring-ink/10"}`}
                >
                  <div className="font-bold">{p.name}</div>
                  <div className={`text-sm ${current ? "text-white/60" : "text-ink/50"}`}>
                    ${p.price}/mo · {p.videos} videos
                  </div>
                  {current ? (
                    <div className="mt-3 chip bg-white/15 text-white">Current</div>
                  ) : (
                    <form action={startCheckout.bind(null, p.id)} className="mt-3">
                      <button className="btn-primary w-full !py-2 text-sm">
                        {p.price > plan.price ? "Upgrade" : "Switch"}
                      </button>
                    </form>
                  )}
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-xs text-ink/45">Plus a one-time setup fee, waived on annual plans.</p>
        </section>
      </div>
    </>
  );
}
