import Link from "next/link";
import { Topbar } from "@/components/dashboard/Topbar";
import { MondayDrop } from "@/components/dashboard/MondayDrop";
import { ACCOUNT, LIBRARY, SOCIALS, VIDEO_TYPES, platformLabel, type VideoType } from "@/lib/mock-data";
import {
  ArrowRight,
  Check,
  Home as HomeIcon,
  Clapperboard,
  Sparkles,
  TrendingUp,
  BadgeCheck,
  UserRound,
  MapPin,
  Lightbulb,
  ImageIcon,
  Mic,
  Palette,
  Video as VideoIcon,
  type LucideIcon,
} from "lucide-react";

const TYPE_ICONS: Record<string, LucideIcon> = {
  "new-listing": HomeIcon,
  "hosted-home-tour": Clapperboard,
  "listing-spotlight": Sparkles,
  "market-update": TrendingUp,
  "just-sold": BadgeCheck,
  "meet-the-agent": UserRound,
  neighbourhood: MapPin,
  "buyer-seller-tip": Lightbulb,
};

const statusStyles: Record<string, string> = {
  draft: "bg-ink/10 text-ink/60",
  rendering: "bg-amber-100 text-amber-700",
  ready: "bg-brand/10 text-brand",
  scheduled: "bg-indigo-100 text-indigo-700",
  posted: "bg-emerald-100 text-emerald-700",
};

export default function DashboardHome() {
  return (
    <>
      <Topbar title={`Hey, ${ACCOUNT.name.split(" ")[0]} 👋`} subtitle="What do you want to post today?" />
      <div className="space-y-10 p-6">
        <MondayDrop />
        <SetupSteps />

        {/* VIDEO AGENT banner */}
        <Link href="/dashboard/create" className="group relative block overflow-hidden rounded-2xl bg-ink p-6 text-white grid-bg">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand/30 blur-3xl" />
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand text-white shadow-glow">
                <Sparkles size={20} />
              </span>
              <div>
                <h2 className="font-extrabold">Video Agent</h2>
                <p className="text-sm text-white/65">Describe the video you want — I&apos;ll write the script, you just approve.</p>
              </div>
            </div>
            <span className="btn-primary w-fit !py-2.5">
              Start with a prompt <ArrowRight size={16} />
            </span>
          </div>
        </Link>

        {/* CONTENT-TYPE GALLERY (the main thing) */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-ink">Create a video</h2>
              <p className="text-sm text-ink/50">Pick a format. We write it, film your avatar, and schedule it.</p>
            </div>
            <Link href="/dashboard/picture-posts" className="hidden text-sm font-semibold text-brand hover:underline sm:block">
              Or make a picture post →
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {VIDEO_TYPES.map((t) => (
              <ContentCard key={t.id} type={t} />
            ))}
          </div>
        </section>

        {/* LOWER ROW: recent + credits */}
        <section className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="card p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-bold text-ink">Recent content</h2>
                <Link href="/dashboard/library" className="text-sm font-semibold text-brand hover:underline">
                  View all
                </Link>
              </div>
              <div className="space-y-3">
                {LIBRARY.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 rounded-xl p-2 hover:bg-ink/[0.02]">
                    <div className={`h-12 w-12 shrink-0 rounded-lg bg-gradient-to-br ${item.thumb}`} />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold text-ink">{item.title}</div>
                      <div className="text-xs text-ink/45">
                        {item.typeLabel} · {item.platforms.map(platformLabel).join(", ")}
                      </div>
                    </div>
                    <span className={`chip ${statusStyles[item.status]}`}>{item.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card p-6">
              <h2 className="font-bold text-ink">Video credits</h2>
              <div className="mt-4 flex items-end justify-between">
                <span className="text-3xl font-extrabold text-ink">{ACCOUNT.creditsTotal - ACCOUNT.creditsUsed}</span>
                <span className="text-sm text-ink/45">of {ACCOUNT.creditsTotal} left</span>
              </div>
              <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-ink/10">
                <div
                  className="h-full rounded-full bg-brand"
                  style={{ width: `${Math.round((ACCOUNT.creditsUsed / ACCOUNT.creditsTotal) * 100)}%` }}
                />
              </div>
              <p className="mt-3 text-xs text-ink/45">Resets on the 1st. Picture posts don't use credits.</p>
            </div>

            <div className="card p-6">
              <h2 className="font-bold text-ink">Connected socials</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {SOCIALS.filter((s) => s.connected).map((s) => (
                  <span key={s.platform} className="chip bg-ink/[0.04] text-ink/60 ring-1 ring-ink/10">
                    {platformLabel(s.platform)}
                  </span>
                ))}
              </div>
              <Link href="/dashboard/settings" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline">
                Manage <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

function ContentCard({ type }: { type: VideoType }) {
  const Icon = TYPE_ICONS[type.id] ?? Clapperboard;
  return (
    <Link
      href={`/dashboard/create?type=${type.id}`}
      className={`group relative flex aspect-[16/10] flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br ${type.card.gradient} p-5 text-white shadow-card transition hover:shadow-glow`}
    >
      <Icon className="absolute -bottom-3 -right-3 opacity-15 transition group-hover:opacity-25" size={120} strokeWidth={1.4} />
      <div className="relative">
        <h3 className="text-xl font-extrabold leading-tight drop-shadow-sm">{type.card.title}</h3>
        <p className="mt-1 text-sm text-white/80">{type.card.tagline}</p>
      </div>
      <span className="relative inline-flex w-fit items-center gap-1.5 rounded-full bg-white/20 px-3.5 py-1.5 text-sm font-semibold backdrop-blur transition group-hover:bg-white/30">
        Create now <ArrowRight size={15} className="transition group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

function SetupSteps() {
  const steps = [
    { n: 1, title: "Create your avatar", desc: "A 15-second clip becomes your digital twin.", icon: VideoIcon, done: ACCOUNT.twinStatus === "ready" },
    { n: 2, title: "Set your brand kit", desc: "Logo, colors and brokerage on every post.", icon: Palette, done: true },
    { n: 3, title: "Connect your socials", desc: "Link your accounts for auto-posting.", icon: Mic, done: SOCIALS.some((s) => s.connected) },
    { n: 4, title: "Make your first video", desc: "Pick a format below and hit create.", icon: Sparkles, done: false },
  ];
  const doneCount = steps.filter((s) => s.done).length;
  const firstOpen = steps.find((s) => !s.done)?.n;

  return (
    <section>
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink/60">
        <span>Finish your setup</span>
        <span className="chip bg-brand/10 text-brand">{doneCount} of {steps.length}</span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s) => {
          const active = s.n === firstOpen;
          return (
            <div
              key={s.n}
              className={`card relative p-5 ${active ? "ring-2 ring-brand shadow-glow" : ""}`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`grid h-9 w-9 place-items-center rounded-xl ${
                    s.done ? "bg-emerald-100 text-emerald-600" : active ? "bg-brand text-white" : "bg-ink/5 text-ink/40"
                  }`}
                >
                  {s.done ? <Check size={18} /> : <s.icon size={18} />}
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wide text-ink/35">Step {s.n}</span>
              </div>
              <h3 className="mt-3 text-sm font-bold text-ink">{s.title}</h3>
              <p className="mt-1 text-xs text-ink/50">{s.desc}</p>
              {active && (
                <Link href="/dashboard/create" className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-brand hover:underline">
                  Start <ArrowRight size={13} />
                </Link>
              )}
              {s.done && <span className="mt-3 inline-block text-xs font-semibold text-emerald-600">Done</span>}
            </div>
          );
        })}
      </div>
    </section>
  );
}
