"use client";

import { useState } from "react";
import { Topbar } from "@/components/dashboard/Topbar";
import { ACCOUNT } from "@/lib/mock-data";
import { generatePicture } from "@/lib/mock-client";
import { ImageIcon, Loader2, Download, ArrowLeft, Wand2 } from "lucide-react";

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

export default function PicturePostsPage() {
  const [tpl, setTpl] = useState<Template | null>(null);
  const [fields, setFields] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function generate() {
    setLoading(true);
    setDone(false);
    await generatePicture(tpl!.id, fields);
    setLoading(false);
    setDone(true);
  }

  return (
    <>
      <Topbar title="Picture posts" subtitle="On-brand graphics — no credits, no design skills." />
      <div className="mx-auto w-full max-w-5xl p-6">
        {!tpl ? (
          <>
            <p className="text-sm text-ink/55">Pick a template. You fill the blanks, we keep it on-brand.</p>
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setTpl(t);
                    setFields({});
                    setDone(false);
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
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* form */}
            <div className="card p-7">
              <button onClick={() => setTpl(null)} className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink/55 hover:text-ink">
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
                      onChange={(e) => setFields({ ...fields, [f.key]: e.target.value })}
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
                {loading ? <><Loader2 className="animate-spin" size={18} /> Generating…</> : <><Wand2 size={18} /> Generate graphic</>}
              </button>
            </div>

            {/* preview */}
            <div className="card flex flex-col p-7">
              <h2 className="mb-4 font-bold text-ink">Preview</h2>
              <div className={`relative flex aspect-square w-full flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br ${tpl.accent} p-6 text-white`}>
                <div className="flex items-center justify-between">
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-white/20 text-sm font-bold">
                    {ACCOUNT.brand.logoLabel}
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
                <div className="text-xs font-medium text-white/80">{ACCOUNT.name} · {ACCOUNT.brokerage}</div>
              </div>
              {done && (
                <button className="btn-dark mt-4 w-full">
                  <Download size={18} /> Save to library
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
