import Link from "next/link";
import {
  ArrowRight,
  Video,
  Image as ImageIcon,
  CalendarClock,
  Sparkles,
  ShieldCheck,
  Wand2,
  Clapperboard,
  Check,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { PLANS, VIDEO_TYPES } from "@/lib/mock-data";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* NAV */}
      <header className="sticky top-0 z-40 border-b border-ink/5 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Logo />
          <nav className="hidden items-center gap-8 text-sm font-medium text-ink/70 md:flex">
            <a href="#how" className="hover:text-ink">How it works</a>
            <a href="#features" className="hover:text-ink">Features</a>
            <a href="#pricing" className="hover:text-ink">Pricing</a>
            <a href="#faq" className="hover:text-ink">FAQ</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-semibold text-ink/70 hover:text-ink">
              Log in
            </Link>
            <Link href="/signup" className="btn-primary !py-2.5 !px-4 text-sm">
              Start free
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[900px] -translate-x-1/2 rounded-full bg-brand/10 blur-3xl" />
        <div className="mx-auto max-w-6xl px-6 pb-16 pt-20 text-center">
          <span className="chip bg-brand/10 text-brand">
            <Sparkles size={14} /> Built for real estate agents
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-6xl">
            Your face. Your listings.
            <span className="block text-brand">On every feed — on autopilot.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-ink/60">
            Drop in an address. Reelty writes the script, films an AI video of you,
            designs the branded post, and schedules it to all your socials. You just
            hit approve.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/signup" className="btn-primary text-base">
              Start creating <ArrowRight size={18} />
            </Link>
            <Link href="/dashboard" className="btn-ghost text-base">
              See the dashboard
            </Link>
          </div>
          <p className="mt-4 text-xs text-ink/40">
            Listing in. Post out. · No video editing · No design skills
          </p>

          {/* hero mock */}
          <div className="relative mx-auto mt-14 max-w-4xl">
            <div className="card overflow-hidden p-0 ring-ink/10">
              <div className="flex items-center gap-1.5 border-b border-ink/5 bg-ink/[0.02] px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-red-400/70" />
                <span className="h-3 w-3 rounded-full bg-amber-400/70" />
                <span className="h-3 w-3 rounded-full bg-emerald-400/70" />
                <span className="ml-3 text-xs text-ink/40">app.reelty.io/dashboard/create</span>
              </div>
              <div className="grid gap-4 p-5 sm:grid-cols-3">
                {[
                  { t: "1 · Address", d: "123 Maple Ave, Calgary · $749,000" },
                  { t: "2 · Claude writes", d: "“Just listed in Altadore — and it won’t last…”" },
                  { t: "3 · Scheduled", d: "Posting to IG, FB & TikTok · Fri 9:00 AM" },
                ].map((s) => (
                  <div key={s.t} className="rounded-xl bg-ink/[0.03] p-4 text-left ring-1 ring-ink/5">
                    <div className="text-xs font-bold uppercase tracking-wide text-brand">{s.t}</div>
                    <div className="mt-2 text-sm text-ink/70">{s.d}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="border-t border-ink/5 bg-ink/[0.015] py-20">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHead
            eyebrow="How it works"
            title="Four steps. Two minutes. Zero editing."
            sub="You never touch HeyGen, Placid or a scheduler. Reelty runs all of it behind one screen."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-4">
            {[
              { icon: Wand2, t: "Drop your inputs", d: "Paste a listing link or type an address, price and a few details." },
              { icon: Sparkles, t: "Claude writes it", d: "Hook, full script and a platform-ready caption — edit or approve." },
              { icon: Clapperboard, t: "Your avatar films it", d: "An AI video of you presents it in 1080p. Branded intro + outro." },
              { icon: CalendarClock, t: "Auto-scheduled", d: "Approve once and it posts to every social account on your calendar." },
            ].map((s, i) => (
              <div key={s.t} className="card p-6">
                <div className="flex items-center justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand/10 text-brand">
                    <s.icon size={20} />
                  </span>
                  <span className="text-3xl font-black text-ink/10">{i + 1}</span>
                </div>
                <h3 className="mt-4 font-bold text-ink">{s.t}</h3>
                <p className="mt-1.5 text-sm text-ink/60">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHead
            eyebrow="Everything in one place"
            title="A full content team, minus the team"
            sub="Video, graphics and scheduling that would normally take four tools and a VA."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            <Feature
              icon={Video}
              title="AI avatar videos"
              points={["A digital twin of you", "New listing, just sold, market update & more", "1080p, up to 2 minutes on Pro"]}
            />
            <Feature
              icon={ImageIcon}
              title="Branded picture posts"
              points={["Fill-in-the-blanks templates", "Always on-brand, never broken", "Near-unlimited on every plan"]}
            />
            <Feature
              icon={CalendarClock}
              title="Auto-scheduling"
              points={["Posts to all your socials", "Approve-before-posting, on by default", "A full content calendar"]}
            />
          </div>

          <div className="mt-6 flex items-start gap-4 rounded-2xl bg-ink p-6 text-white grid-bg">
            <ShieldCheck className="mt-0.5 shrink-0 text-accent" size={22} />
            <div>
              <div className="font-bold">Compliance built in</div>
              <p className="mt-1 text-sm text-white/70">
                Nothing posts without your OK by default. Brokerage disclosure lines are baked into
                every script, so a wrong price or missing name never slips out automatically. Your
                licence stays protected.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* VIDEO TYPES */}
      <section className="border-y border-ink/5 bg-ink/[0.015] py-16">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHead eyebrow="Content types" title="Know exactly what to post" />
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {VIDEO_TYPES.map((v) => (
              <span key={v.id} className="chip bg-white px-4 py-2 text-sm text-ink/70 ring-1 ring-ink/10">
                <span>{v.emoji}</span> {v.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHead
            eyebrow="Pricing"
            title="Pick a plan. We handle the rest."
            sub="One-time setup fee covers your avatar, socials and brand kit — waived on annual plans."
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {PLANS.map((p) => (
              <div
                key={p.id}
                className={`card relative p-7 ${p.featured ? "ring-2 ring-brand shadow-glow" : ""}`}
              >
                {p.featured && (
                  <span className="chip absolute -top-3 left-7 bg-brand text-white">Most popular</span>
                )}
                <h3 className="text-lg font-bold text-ink">{p.name}</h3>
                <p className="mt-1 text-sm text-ink/55">{p.blurb}</p>
                <div className="mt-5 flex items-end gap-1">
                  <span className="text-4xl font-extrabold text-ink">${p.price}</span>
                  <span className="pb-1 text-sm text-ink/50">/mo</span>
                </div>
                <div className="mt-1 text-xs text-ink/45">{p.videos} videos / month</div>
                <Link
                  href="/signup"
                  className={`mt-6 w-full ${p.featured ? "btn-primary" : "btn-dark"}`}
                >
                  Choose {p.name}
                </Link>
                <ul className="mt-6 space-y-2.5">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-ink/70">
                      <Check size={16} className="mt-0.5 shrink-0 text-accent-dark" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t border-ink/5 bg-ink/[0.015] py-20">
        <div className="mx-auto max-w-3xl px-6">
          <SectionHead eyebrow="FAQ" title="The honest questions" />
          <div className="mt-10 space-y-4">
            {FAQ.map((f) => (
              <div key={f.q} className="card p-6">
                <div className="font-semibold text-ink">{f.q}</div>
                <p className="mt-2 text-sm text-ink/60">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="relative overflow-hidden rounded-3xl bg-ink p-12 text-center text-white grid-bg">
            <div className="pointer-events-none absolute -bottom-24 left-1/2 h-72 w-96 -translate-x-1/2 rounded-full bg-brand/30 blur-3xl" />
            <h2 className="relative text-3xl font-extrabold sm:text-4xl">Post like you have a full marketing team.</h2>
            <p className="relative mx-auto mt-4 max-w-xl text-white/70">
              Start today. Your first video is written, filmed and scheduled before your coffee’s cold.
            </p>
            <div className="relative mt-8 flex justify-center">
              <Link href="/signup" className="btn-primary text-base">
                Start free <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-ink/5 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
          <Logo />
          <p className="text-xs text-ink/40">© {new Date().getFullYear()} Reelty · A Peter Eki product · Prototype</p>
        </div>
      </footer>
    </main>
  );
}

function SectionHead({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <div className="text-xs font-bold uppercase tracking-widest text-brand">{eyebrow}</div>
      <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{title}</h2>
      {sub && <p className="mt-3 text-ink/55">{sub}</p>}
    </div>
  );
}

function Feature({
  icon: Icon,
  title,
  points,
}: {
  icon: React.ElementType;
  title: string;
  points: string[];
}) {
  return (
    <div className="card p-7">
      <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand/10 text-brand">
        <Icon size={20} />
      </span>
      <h3 className="mt-4 text-lg font-bold text-ink">{title}</h3>
      <ul className="mt-4 space-y-2">
        {points.map((p) => (
          <li key={p} className="flex items-start gap-2 text-sm text-ink/65">
            <Check size={16} className="mt-0.5 shrink-0 text-accent-dark" /> {p}
          </li>
        ))}
      </ul>
    </div>
  );
}

const FAQ = [
  {
    q: "Why not just pay HeyGen $29 myself?",
    a: "Because HeyGen hands you an empty editor. Reelty hands you a finished post. We write the real-estate script, bake in your brokerage disclosure, design the matching graphic, and schedule it to every platform. Listing in, post out — not a blank timeline.",
  },
  {
    q: "Do I need to film myself?",
    a: "Once. On Growth and Pro we create a digital twin from a short training clip during setup, then every future video uses it — no camera required. Starter uses a photo avatar.",
  },
  {
    q: "What’s the setup fee for?",
    a: "A one-time charge that covers building your avatar, spinning up your scheduling account, connecting your socials and loading your brand kit. It’s waived when you pay annually.",
  },
  {
    q: "Will it post things without me seeing them?",
    a: "No. ‘Approve before posting’ is on by default. You review every video and caption before it goes live. You can turn it off once you trust it.",
  },
];
