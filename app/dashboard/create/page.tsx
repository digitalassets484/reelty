"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Topbar } from "@/components/dashboard/Topbar";
import { VIDEO_TYPES, type VideoType } from "@/lib/mock-data";
import {
  Sparkles,
  Clapperboard,
  Loader2,
  CheckCircle2,
  ArrowLeft,
  CalendarClock,
  RefreshCw,
  Link2,
} from "lucide-react";

// Prototype: pretend we scraped these off the pasted Realtor.ca / MLS link.
const SAMPLE_LISTING: Record<string, string> = {
  address: "214 Altadore Rd SW, Calgary",
  price: "$879,000",
  beds: "4 bed · 3.5 bath",
  highlights: "Chef's kitchen, south-facing yard, steps to the river pathway",
  rooms: "Great room, chef's kitchen, primary suite, west-facing backyard",
  daysOnMarket: "6 days",
  note: "Sold over asking with multiple offers",
};

// Prompt-first "Video Agent" path (not shown in the format gallery).
const VIDEO_AGENT: VideoType = {
  id: "video-agent",
  label: "Video Agent",
  emoji: "✨",
  blurb: "Describe it, I'll script it.",
  card: { title: "Video Agent", tagline: "Describe it, I'll script it", gradient: "from-brand to-indigo-700" },
  inputs: [{ key: "prompt", label: "Your prompt", placeholder: "Describe the video you want…", type: "textarea" }],
};

type ScriptResult = {
  hook: string;
  script: string;
  caption: string;
  hashtags: string[];
  disclosure: string;
};

type Step = "type" | "inputs" | "script" | "render" | "done";

export default function CreatePage() {
  return (
    <Suspense fallback={null}>
      <CreateFlow />
    </Suspense>
  );
}

function CreateFlow() {
  const params = useSearchParams();
  const router = useRouter();
  const preset = VIDEO_TYPES.find((v) => v.id === params.get("type")) ?? null;
  const [step, setStep] = useState<Step>(preset ? "inputs" : "type");
  const [vtype, setVtype] = useState<VideoType | null>(preset);
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [script, setScript] = useState<ScriptResult | null>(null);
  const [renderPct, setRenderPct] = useState(0);
  const [pulling, setPulling] = useState(false);
  const [pulled, setPulled] = useState(false);
  const [agentPrompt, setAgentPrompt] = useState("");
  const [noCredits, setNoCredits] = useState(false);

  async function startVideoAgent() {
    if (!agentPrompt.trim()) return;
    setVtype(VIDEO_AGENT);
    setInputs({ prompt: agentPrompt });
    setPulled(false);
    setLoading(true);
    const res = await fetch("/api/script", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ videoType: "video-agent", inputs: { prompt: agentPrompt } }),
    });
    const data = await res.json();
    setScript(data);
    setLoading(false);
    setStep("script");
  }

  async function pullDetails() {
    if (!inputs.listingLink || !vtype) return;
    setPulling(true);
    await new Promise((r) => setTimeout(r, 900)); // Phase 2: fetch + parse the real listing
    const next = { ...inputs };
    for (const f of vtype.inputs) {
      if (f.key !== "listingLink" && SAMPLE_LISTING[f.key]) next[f.key] = SAMPLE_LISTING[f.key];
    }
    setInputs(next);
    setPulling(false);
    setPulled(true);
  }

  async function generateScript() {
    setLoading(true);
    const res = await fetch("/api/script", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ videoType: vtype!.id, inputs }),
    });
    const data = await res.json();
    setScript(data);
    setLoading(false);
    setStep("script");
  }

  async function renderVideo() {
    setNoCredits(false);
    setStep("render");
    setRenderPct(0);
    const timer = setInterval(() => {
      setRenderPct((p) => Math.min(p + 8, 92));
    }, 220);
    const title =
      vtype!.id === "video-agent"
        ? script!.hook.slice(0, 60)
        : inputs.address
          ? `${vtype!.card.title} — ${inputs.address}`
          : vtype!.card.title;
    const res = await fetch("/api/render", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        script: script!.script,
        durationSec: 45,
        title,
        typeLabel: vtype!.label,
        caption: script!.caption,
        thumb: vtype!.card.gradient,
      }),
    });
    clearInterval(timer);
    if (res.status === 402) {
      setRenderPct(0);
      setNoCredits(true);
      setStep("script");
      return;
    }
    setRenderPct(100);
    router.refresh(); // reflect the deducted credit in the Topbar
    setTimeout(() => setStep("done"), 500);
  }

  function reset() {
    setStep("type");
    setVtype(null);
    setInputs({});
    setScript(null);
    setRenderPct(0);
    setPulled(false);
  }

  return (
    <>
      <Topbar title="Create a video" subtitle="Pick a type, drop your details, hit approve." />
      <div className="mx-auto w-full max-w-3xl p-6">
        <Stepper step={step} />

        {/* STEP: TYPE */}
        {step === "type" && (
          <div className="mt-6 space-y-6">
            {/* VIDEO AGENT — prompt-first */}
            <div className="card p-6 ring-2 ring-brand/30">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand text-white shadow-glow">
                  <Sparkles size={20} />
                </span>
                <div>
                  <h2 className="font-extrabold text-ink">Video Agent</h2>
                  <p className="text-sm text-ink/55">Describe the video you want. I&apos;ll write the script — you just approve or edit.</p>
                </div>
              </div>
              <textarea
                className="input mt-4 min-h-[96px]"
                placeholder="e.g. A 30-second video about my new listing at 214 Altadore Rd SW, listed at $879k — chef's kitchen, south-facing yard, steps to the river. Friendly and upbeat."
                value={agentPrompt}
                onChange={(e) => setAgentPrompt(e.target.value)}
              />
              <button onClick={startVideoAgent} disabled={!agentPrompt.trim() || loading} className="btn-primary mt-3 w-full">
                {loading ? <><Loader2 className="animate-spin" size={18} /> Writing your script…</> : <><Sparkles size={18} /> Write my script</>}
              </button>
            </div>

            <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-ink/35">
              <span className="h-px flex-1 bg-ink/10" /> Or pick a format <span className="h-px flex-1 bg-ink/10" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {VIDEO_TYPES.map((v) => (
                <button
                  key={v.id}
                  onClick={() => {
                    setVtype(v);
                    setInputs({});
                    setPulled(false);
                    setStep("inputs");
                  }}
                  className="card group p-6 text-left transition hover:shadow-glow"
                >
                  <div className="text-3xl">{v.emoji}</div>
                  <div className="mt-3 font-bold text-ink">{v.label}</div>
                  <div className="mt-1 text-sm text-ink/55">{v.blurb}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP: INPUTS */}
        {step === "inputs" && vtype && (
          <div className="mt-6 card p-7">
            <BackBtn onClick={() => setStep("type")} label="Change type" />
            <div className="mt-3 flex items-center gap-2">
              <span className="text-2xl">{vtype.emoji}</span>
              <h2 className="text-lg font-bold text-ink">{vtype.label}</h2>
            </div>
            <div className="mt-5 space-y-4">
              {vtype.inputs.map((f) => {
                if (f.key === "listingLink") {
                  return (
                    <div key={f.key} className="rounded-xl bg-brand/5 p-4 ring-1 ring-brand/15">
                      <label className="label flex items-center gap-1.5 text-brand">
                        <Link2 size={13} /> Import a listing
                        <span className="font-medium normal-case text-ink/40">— optional, fills the rest for you</span>
                      </label>
                      <div className="flex gap-2">
                        <input
                          className="input"
                          placeholder={f.placeholder}
                          value={inputs[f.key] ?? ""}
                          onChange={(e) => {
                            setInputs({ ...inputs, [f.key]: e.target.value });
                            setPulled(false);
                          }}
                        />
                        <button
                          type="button"
                          onClick={pullDetails}
                          disabled={!inputs.listingLink || pulling}
                          className="btn-dark shrink-0 !px-4"
                        >
                          {pulling ? <Loader2 className="animate-spin" size={16} /> : pulled ? <CheckCircle2 size={16} /> : "Pull details"}
                        </button>
                      </div>
                      {pulled && (
                        <p className="mt-2 text-xs font-medium text-emerald-600">
                          Imported the listing — check the details below, then write the script.
                        </p>
                      )}
                    </div>
                  );
                }
                return (
                  <div key={f.key}>
                    <label className="label">{f.label}</label>
                    {f.type === "textarea" ? (
                      <textarea
                        className="input min-h-[90px]"
                        placeholder={f.placeholder}
                        value={inputs[f.key] ?? ""}
                        onChange={(e) => setInputs({ ...inputs, [f.key]: e.target.value })}
                      />
                    ) : (
                      <input
                        className="input"
                        placeholder={f.placeholder}
                        value={inputs[f.key] ?? ""}
                        onChange={(e) => setInputs({ ...inputs, [f.key]: e.target.value })}
                      />
                    )}
                  </div>
                );
              })}
            </div>
            <button onClick={generateScript} disabled={loading} className="btn-primary mt-6 w-full">
              {loading ? <><Loader2 className="animate-spin" size={18} /> Claude is writing…</> : <><Sparkles size={18} /> Write my script</>}
            </button>
          </div>
        )}

        {/* STEP: SCRIPT */}
        {step === "script" && script && (
          <div className="mt-6 space-y-4">
            <div className="card p-7">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles size={18} className="text-brand" />
                  <h2 className="font-bold text-ink">Claude wrote this for you</h2>
                </div>
                <button onClick={generateScript} className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline">
                  <RefreshCw size={14} /> Rewrite (free)
                </button>
              </div>

              <div className="mt-5">
                <label className="label">Hook</label>
                <input className="input font-semibold" value={script.hook}
                  onChange={(e) => setScript({ ...script, hook: e.target.value })} />
              </div>
              <div className="mt-4">
                <label className="label">Script (your avatar says this)</label>
                <textarea className="input min-h-[120px]" value={script.script}
                  onChange={(e) => setScript({ ...script, script: e.target.value })} />
              </div>
              <div className="mt-4">
                <label className="label">Caption</label>
                <textarea className="input min-h-[90px]" value={script.caption}
                  onChange={(e) => setScript({ ...script, caption: e.target.value })} />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {script.hashtags.map((h) => (
                  <span key={h} className="chip bg-brand/10 text-brand">{h}</span>
                ))}
              </div>
              <div className="mt-5 rounded-xl bg-ink/[0.03] p-3 text-xs text-ink/55 ring-1 ring-ink/5">
                <span className="font-semibold text-ink/70">Compliance line (auto-added):</span> {script.disclosure}
              </div>
            </div>

            {noCredits && (
              <div className="rounded-xl bg-amber-50 p-3 text-sm text-amber-700 ring-1 ring-amber-200">
                You&apos;re out of credits.{" "}
                <a href="/dashboard/settings" className="font-semibold underline">Upgrade your plan</a> to keep creating.
              </div>
            )}
            <div className="flex gap-3">
              <BackBtn onClick={() => setStep("inputs")} label="Edit details" inline />
              <button onClick={renderVideo} className="btn-primary flex-1">
                <Clapperboard size={18} /> Film my avatar · 1 credit
              </button>
            </div>
          </div>
        )}

        {/* STEP: RENDER */}
        {step === "render" && (
          <div className="mt-6 card p-10 text-center">
            <Loader2 className="mx-auto animate-spin text-brand" size={40} />
            <h2 className="mt-5 text-lg font-bold text-ink">Filming your avatar…</h2>
            <p className="mt-1 text-sm text-ink/55">HeyGen is rendering your 1080p video. This takes about a minute live.</p>
            <div className="mx-auto mt-6 h-2.5 w-full max-w-sm overflow-hidden rounded-full bg-ink/10">
              <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${renderPct}%` }} />
            </div>
            <div className="mt-2 text-xs text-ink/45">{renderPct}%</div>
          </div>
        )}

        {/* STEP: DONE */}
        {step === "done" && script && (
          <div className="mt-6 card p-8 text-center">
            <CheckCircle2 className="mx-auto text-emerald-500" size={44} />
            <h2 className="mt-4 text-xl font-extrabold text-ink">Your video is ready 🎬</h2>
            <p className="mt-1 text-sm text-ink/55">Added to your library as a draft. Review it, then schedule or post.</p>

            <div className="mx-auto mt-6 aspect-video w-full max-w-md overflow-hidden rounded-2xl bg-gradient-to-br from-brand to-brand-dark ring-1 ring-ink/10">
              <div className="flex h-full flex-col items-center justify-center text-white">
                <Clapperboard size={32} />
                <div className="mt-3 max-w-xs px-6 text-center text-sm font-semibold">{script.hook}</div>
                <div className="mt-2 text-xs text-white/60">Avatar video preview</div>
              </div>
            </div>

            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <a href="/dashboard/schedule" className="btn-primary">
                <CalendarClock size={18} /> Schedule it
              </a>
              <button onClick={reset} className="btn-ghost">Create another</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function Stepper({ step }: { step: Step }) {
  const steps: { id: Step; label: string }[] = [
    { id: "type", label: "Type" },
    { id: "inputs", label: "Details" },
    { id: "script", label: "Script" },
    { id: "done", label: "Done" },
  ];
  const order: Step[] = ["type", "inputs", "script", "render", "done"];
  const current = order.indexOf(step);
  return (
    <div className="flex items-center gap-2">
      {steps.map((s, i) => {
        const idx = order.indexOf(s.id);
        const active = current >= idx || (step === "render" && s.id === "script");
        return (
          <div key={s.id} className="flex flex-1 items-center gap-2">
            <div
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                active ? "bg-brand text-white" : "bg-ink/10 text-ink/40"
              }`}
            >
              {i + 1}
            </div>
            <span className={`text-xs font-semibold ${active ? "text-ink" : "text-ink/40"}`}>{s.label}</span>
            {i < steps.length - 1 && <div className={`h-0.5 flex-1 rounded ${active ? "bg-brand/40" : "bg-ink/10"}`} />}
          </div>
        );
      })}
    </div>
  );
}

function BackBtn({ onClick, label, inline }: { onClick: () => void; label: string; inline?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 text-sm font-semibold text-ink/55 hover:text-ink ${inline ? "btn-ghost" : ""}`}
    >
      <ArrowLeft size={16} /> {label}
    </button>
  );
}
