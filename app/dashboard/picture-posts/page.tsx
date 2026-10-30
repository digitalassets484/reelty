"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Topbar } from "@/components/dashboard/Topbar";
import { useDashboard } from "@/components/DashboardProvider";
import { savePicture } from "@/app/content-actions";
import { ImageIcon, Loader2, Download, ArrowLeft, Wand2, Check, Sparkles } from "lucide-react";
import type { AccountView } from "@/lib/data";

type Template = {
  id: string;
  name: string;
  accent: string; // gradient
  fields: { key: string; label: string; placeholder: string }[];
};

const TEMPLATES: Template[] = [
  {
    id: "just-listed",
    name: "Just Listed",
    accent: "from-brand to-brand-dark",
    fields: [
      { key: "address", label: "Address", placeholder: "123 Maple Ave SW" },
      { key: "price", label: "Price", placeholder: "$749,000" },
      { key: "specs", label: "Specs", placeholder: "4 Bed · 3 Bath · 2,100 sqft" },
    ],
  },
  {
    id: "open-house",
    name: "Open House",
    accent: "from-emerald-500 to-teal-600",
    fields: [
      { key: "address", label: "Address", placeholder: "88 Riverstone Cres" },
      { key: "date", label: "Date & time", placeholder: "Sun, Oct 19 · 1–3 PM" },
    ],
  },
  {
    id: "just-sold",
    name: "Just Sold",
    accent: "from-amber-500 to-orange-600",
    fields: [
      { key: "address", label: "Address", placeholder: "22 Aspen Ridge" },
      { key: "note", label: "Note", placeholder: "Sold over asking in 6 days" },
    ],
  },
  {
    id: "quote",
    name: "Tip / Quote",
    accent: "from-indigo-500 to-purple-600",
    fields: [{ key: "quote", label: "Text", placeholder: "Get pre-approved before you shop." }],
  },
];

function buildCardUrl(tpl: Template, fields: Record<string, string>, agent: AccountView): string {
  const v = (k: string) => fields[k] || tpl.fields.find((f) => f.key === k)?.placeholder || "";
  const map: Record<string, { tag: string; l1: string; l2: string; l3: string }> = {
    "just-listed": { tag: "Just Listed", l1: v("address"), l2: v("price"), l3: v("specs") },
    "open-house": { tag: "Open House", l1: v("address"), l2: "", l3: v("date") },
    "just-sold": { tag: "Just Sold", l1: v("address"), l2: "", l3: v("note") },
    quote: { tag: "Tip", l1: v("quote"), l2: "", l3: "" },
  };
  const m = map[tpl.id] ?? { tag: tpl.name, l1: "", l2: "", l3: "" };
  const q = new URLSearchParams({
    template: tpl.id,
    tag: m.tag,
    logo: agent.brand.logoLabel,
    agent: agent.name,
    brokerage: agent.brokerage,
    l1: m.l1,
    l2: m.l2,
    l3: m.l3,
  });
  return `/api/card?${q.toString()}`;
}

export default function PicturePostsPage() {
  const { agent } = useDashboard();
  const [mode, setMode] = useState<"templates" | "ai">("templates");

  return (
    <>
      <Topbar title="Picture posts" subtitle="On-brand graphics — no credits, no design skills." />
      <div className="mx-auto w-full max-w-5xl p-6">
        <div className="mb-6 inline-flex rounded-xl bg-ink/[0.04] p-1 ring-1 ring-ink/10">
          {(["templates", "ai"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                mode === m ? "bg-white text-ink shadow-card" : "text-ink/55 hover:text-ink"
              }`}
            >
              {m === "templates" ? "Templates" : "✨ AI image"}
            </button>
          ))}
        </div>

        {mode === "templates" ? <TemplatesMode agent={agent} /> : <AiMode />}
      </div>
    </>
  );
}

function TemplatesMode({ agent }: { agent: AccountView }) {
  const router = useRouter();
  const [tpl, setTpl] = useState<Template | null>(null);
  const [fields, setFields] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [cardUrl, setCardUrl] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function reset() {
    setFields({});
    setCardUrl(null);
    setSaved(false);
  }

  async function generate() {
    if (!tpl) return;
    setLoading(true);
    setSaved(false);
    const url = buildCardUrl(tpl, fields, agent);
    // Warm the render so the <img> shows instantly.
    await fetch(url).catch(() => {});
    setCardUrl(url);
    setLoading(false);
  }

  async function save() {
    if (!tpl || !cardUrl) return;
    const title = `${tpl.name}${fields.address ? ` — ${fields.address}` : ""}`;
    const caption = Object.values(fields).filter(Boolean).join(" · ");
    await savePicture({ title, caption, thumb: tpl.accent, imageUrl: cardUrl });
    setSaved(true);
    router.refresh();
  }

  if (!tpl) {
    return (
      <>
        <p className="text-sm text-ink/55">Pick a template. You fill the blanks, we render it on-brand — free.</p>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setTpl(t);
                reset();
              }}
              className="card group overflow-hidden p-0 text-left transition hover:shadow-glow"
            >
              <div className={`flex aspect-square items-center justify-center bg-gradient-to-br ${t.accent} text-white`}>
                <ImageIcon size={30} />
              </div>
              <div className="p-4 font-semibold text-ink">{t.name}</div>
            </button>
          ))}
        </div>
      </>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* form */}
      <div className="card p-7">
        <button
          onClick={() => {
            setTpl(null);
            reset();
          }}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink/55 hover:text-ink"
        >
          <ArrowLeft size={16} /> All templates
        </button>
        <h2 className="mt-3 text-lg font-bold text-ink">{tpl.name}</h2>
        <div className="mt-5 space-y-4">
          {tpl.fields.map((f) => (
            <div key={f.key}>
              <label className="label">{f.label}</label>
              <input
                className="input"
                placeholder={f.placeholder}
                value={fields[f.key] ?? ""}
                onChange={(e) => {
                  setFields({ ...fields, [f.key]: e.target.value });
                  setCardUrl(null);
                  setSaved(false);
                }}
              />
            </div>
          ))}
          <div>
            <label className="label">Listing photo</label>
            <div className="flex h-24 items-center justify-center rounded-xl border-2 border-dashed border-ink/15 text-sm text-ink/40">
              Drop a photo (prototype)
            </div>
          </div>
        </div>
        <button onClick={generate} disabled={loading} className="btn-primary mt-6 w-full">
          {loading ? <><Loader2 className="animate-spin" size={18} /> Rendering…</> : <><Wand2 size={18} /> Generate graphic</>}
        </button>
      </div>

      {/* preview */}
      <div className="card flex flex-col p-7">
        <h2 className="mb-4 font-bold text-ink">Preview</h2>
        {cardUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cardUrl} alt="Rendered post" className="aspect-square w-full rounded-2xl ring-1 ring-ink/10" />
        ) : (
          <div className={`relative flex aspect-square w-full flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br ${tpl.accent} p-6 text-white`}>
            <div className="flex items-center justify-between">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-white/20 text-sm font-bold">
                {agent.brand.logoLabel}
              </span>
              <span className="chip bg-white/20 text-xs text-white">{tpl.name.toUpperCase()}</span>
            </div>
            <div>
              {tpl.fields.map((f) => (
                <div
                  key={f.key}
                  className={f.key === "price" ? "text-3xl font-extrabold" : f.key === "quote" ? "text-2xl font-bold leading-snug" : "text-lg font-semibold"}
                >
                  {fields[f.key] || f.placeholder}
                </div>
              ))}
            </div>
            <div className="text-xs font-medium text-white/80">{agent.name}{agent.brokerage ? ` · ${agent.brokerage}` : ""}</div>
          </div>
        )}
        {cardUrl &&
          (saved ? (
            <div className="btn mt-4 w-full bg-emerald-600 text-white">
              <Check size={18} /> Saved to library
            </div>
          ) : (
            <button onClick={save} className="btn-dark mt-4 w-full">
              <Download size={18} /> Save to library
            </button>
          ))}
      </div>
    </div>
  );
}

function AiMode() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function generate() {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    setImage(null);
    setSaved(false);
    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      if (res.status === 503) {
        setError("Add your Gemini key (GEMINI_API_KEY) to enable AI images.");
      } else if (!res.ok) {
        setError("Couldn't generate that one — try a different prompt.");
      } else {
        const data = await res.json();
        setImage(data.imageUrl);
      }
    } catch {
      setError("Something went wrong generating the image.");
    }
    setLoading(false);
  }

  async function save() {
    if (!image) return;
    await savePicture({
      title: prompt.slice(0, 60),
      caption: prompt,
      thumb: "from-indigo-600 to-purple-700",
      imageUrl: image,
    });
    setSaved(true);
    router.refresh();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="card p-7">
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-white"><Sparkles size={18} /></span>
          <div>
            <h2 className="font-bold text-ink">AI image</h2>
            <p className="text-sm text-ink/55">Generate a background or lifestyle image from a prompt (Gemini, free tier).</p>
          </div>
        </div>
        <textarea
          className="input mt-5 min-h-[120px]"
          placeholder="e.g. A warm, modern Calgary living room at golden hour, cozy and inviting, no text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button onClick={generate} disabled={!prompt.trim() || loading} className="btn-primary mt-4 w-full">
          {loading ? <><Loader2 className="animate-spin" size={18} /> Generating…</> : <><Sparkles size={18} /> Generate image</>}
        </button>
        {error && <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700">{error}</p>}
        <p className="mt-4 text-xs text-ink/45">Tip: AI images are best for backgrounds and lifestyle shots — use Templates for exact prices and addresses.</p>
      </div>

      <div className="card flex flex-col p-7">
        <h2 className="mb-4 font-bold text-ink">Preview</h2>
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="AI generated" className="aspect-square w-full rounded-2xl object-cover ring-1 ring-ink/10" />
        ) : (
          <div className="flex aspect-square w-full items-center justify-center rounded-2xl bg-ink/[0.03] text-sm text-ink/40 ring-1 ring-ink/5">
            Your AI image will appear here
          </div>
        )}
        {image &&
          (saved ? (
            <div className="btn mt-4 w-full bg-emerald-600 text-white">
              <Check size={18} /> Saved to library
            </div>
          ) : (
            <button onClick={save} className="btn-dark mt-4 w-full">
              <Download size={18} /> Save to library
            </button>
          ))}
      </div>
    </div>
  );
}
